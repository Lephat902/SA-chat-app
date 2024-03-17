import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/services';
import { Message } from '../entities/message.entity';
import { isObjectWithIdExist } from 'src/helpers';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONVERSATION_MESSAGE_ADDED, ConversationMessageAddedEvent, LAST_READ_MESSAGE_EVENT, LastReadMessageEvent } from 'src/events';
import { Builder } from 'builder-pattern';
import { AddMessageDto, MessageQueryDto } from '../dtos';
import { UserConversation } from '../entities';
import { ConversationService } from 'src/conversation/services';
import { User } from 'src/user/entities';
import { Conversation } from 'src/conversation/entities';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(UserConversation)
    private readonly userConversationRepository: Repository<UserConversation>,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async addMessage(addMessageDto: AddMessageDto) {
    const { conversationId, userId, text } = addMessageDto;
    await this.validateUserCanSendMessage(userId, conversationId);

    const message = this.createMessageEntity(conversationId, userId, text);
    const newMessage = await this.messageRepository.save(message);

    this.emitConversationMessageAddedEvent(newMessage);
  }

  async markAsLastRead(userId: string, messageId: string) {
    const message = await this.findMessageWithConversation(messageId);
    const userConversation = await this.findOrInsertUserConversation(userId, message.conversation.id);

    this.validateLastReadMessage(userConversation, message);

    userConversation.lastReadMessage = message;
    await this.userConversationRepository.save(userConversation);

    this.emitLastReadMessageEvent(message.conversation.id, messageId, userId);
  }

  // Kind of a helper method, not called directly by client
  // Called on events of User added to group, conversation created,... (new user - conversation pair)
  async createUserConversationRecords(conversationId: string, userIds: string[]) {
    // First, check all user-conversation pairs to see if they already exist
    const existingUserConversations = await Promise.all(userIds.map(userId =>
      this.userConversationRepository.findOne({
        where: { user: { id: userId }, conversation: { id: conversationId } },
      })
    ));

    // Filter out users for which a userConversation already exists
    const usersNeedingConversations = userIds.filter((_, index) => !existingUserConversations[index]);

    // Now, create all missing user-conversation records in parallel
    return Promise.all(usersNeedingConversations.map(userId => {
      const userConversation = Builder<UserConversation>()
        .user({ id: userId } as User)
        .conversation({ id: conversationId } as Conversation)
        .build()
      return this.userConversationRepository.save(userConversation);
    }));
  }

  async getMessages(messageQueryDto: MessageQueryDto) {
    const { conversationId, limit, dir, markMessageId } = messageQueryDto;

    let queryBuilder = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('message.conversation', 'conversation')
      .leftJoinAndSelect('conversation.userConversations', 'userConversation', 'userConversation.lastReadMessageId = message.id')
      .addSelect('userConversation.user.id', 'lastReadUserId')
      .where('message.conversationId = :conversationId', { conversationId })
      .orderBy('message.createdAt', dir)
      .take(limit);

    if (markMessageId) {
      const markMessage = await this.messageRepository.findOneBy({ id: markMessageId });
      if (markMessage) {
        const comparisonOperator = dir === 'ASC' ? '>' : '<';
        queryBuilder = queryBuilder.andWhere(`message.createdAt ${comparisonOperator} :markMessageCreatedAt`, { markMessageCreatedAt: markMessage.createdAt });
      }
    }

    const messages = await queryBuilder.getRawMany();

    // Group by message id to get lastReadUsers for each message
    const groupedMessages = messages.reduce((acc, message) => {
      if (!acc[message.message_id]) {
        acc[message.message_id] = {
          id: message.message_id,
          text: message.message_text,
          createdAt: message.message_createdAt,
          lastReadUsers: [],
        };
      }
      if (message.lastReadUserId) {
        acc[message.message_id].lastReadUsers.push(message.lastReadUserId);
      }
      return acc;
    }, {});

    return Object.values(groupedMessages);
  }

  private async validateUserCanSendMessage(userId: string, conversationId: string) {
    const user = await this.userService.findOneById(userId, true);

    if (!isObjectWithIdExist(user.conversations, conversationId)) {
      throw new ForbiddenException("You cannot send messages to this conversation");
    }
  }

  private createMessageEntity(conversationId: string, userId: string, text: string): Message {
    const message = this.messageRepository.create({
      text,
      conversation: { id: conversationId },
      user: { id: userId },
    });
    return message;
  }

  private async emitConversationMessageAddedEvent(newMessage: Message) {
    const { id, user, conversation, text, createdAt } = newMessage;
    const eventPayload = Builder<ConversationMessageAddedEvent>()
      .id(id)
      .userId(user.id)
      .conversationId(conversation.id)
      .text(text)
      .createdAt(createdAt)
      .build();
    this.eventEmitter.emit(CONVERSATION_MESSAGE_ADDED, eventPayload);
  }

  private async findMessageWithConversation(messageId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  private async findOrInsertUserConversation(userId: string, conversationId: string): Promise<UserConversation> {
    let userConversation = await this.userConversationRepository.findOne({
      where: { user: { id: userId }, conversation: { id: conversationId } },
      relations: ['lastReadMessage'],
    });

    if (!userConversation) {
      const conversationWithUsers = await this.conversationService.findOne(conversationId, true);
      if (this.conversationService.isMemberOfConversation(conversationWithUsers, userId)) {
        const createdRecords = await this.createUserConversationRecords(conversationId, [userId]);
        userConversation = createdRecords[0];
      } else {
        throw new ForbiddenException();
      }
    }
    return userConversation;
  }

  private validateLastReadMessage(userConversation: UserConversation, message: Message) {
    if (userConversation.lastReadMessage && userConversation.lastReadMessage.createdAt >= message.createdAt) {
      throw new BadRequestException('Cannot mark a message as read if it is before the last read message');
    }
  }

  private emitLastReadMessageEvent(conversationId: string, messageId: string, userId: string) {
    const eventPayload = Builder<LastReadMessageEvent>()
      .userId(userId)
      .conversationId(conversationId)
      .lastReadMessageId(messageId)
      .build();
    this.eventEmitter.emit(LAST_READ_MESSAGE_EVENT, eventPayload);
  }
}
