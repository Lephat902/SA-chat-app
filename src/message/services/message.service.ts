import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { UserService } from 'src/user/services';
import { Message } from '../entities/message.entity';
import { isObjectWithIdExist } from 'src/helpers';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONVERSATION_MESSAGE_ADDED, ConversationMessageAddedEvent } from 'src/events';
import { Builder } from 'builder-pattern';
import { AddMessageDto, MessageQueryDto } from '../dtos';
import { SortingDirection } from 'src/common';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async addMessage(addMessageDto: AddMessageDto) {
    const { conversationId, userId, text } = addMessageDto;

    const user = await this.userService.findOneById(userId, true);

    if (!isObjectWithIdExist(user.conversations, conversationId)) {
      throw new ForbiddenException("You cannot send messages to this conversation");
    }

    const message = this.messageRepository.create({
      text,
      conversation: { id: conversationId },
      user,
    });

    const newMessage = await this.messageRepository.save(message);

    this.eventEmitter.emit(
      CONVERSATION_MESSAGE_ADDED,
      Builder<ConversationMessageAddedEvent>()
        .userId(userId)
        .conversationId(conversationId)
        .text(text)
        .createdAt(newMessage.createdAt)
        .build()
    );
  }

  async getMessages(messageQueryDto: MessageQueryDto) {
    const { conversationId, limit, dir, markMessageId } = messageQueryDto;
    let where = { conversation: { id: conversationId } };

    if (markMessageId) {
      const markMessage = await this.messageRepository.findOneBy({ id: markMessageId });
      if (markMessage) {
        where['createdAt'] = dir === SortingDirection.ASC ? MoreThan(markMessage.createdAt) : LessThan(markMessage.createdAt);
      }
    }

    const messages = await this.messageRepository.find({
      where,
      order: { createdAt: dir },
      take: limit,
    });

    return messages;
  }
}
