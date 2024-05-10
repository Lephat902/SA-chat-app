import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/services';
import { Conversation } from '../entities/conversation.entity';
import { DirectConversation } from '../entities';
import { isObjectWithIdExist } from 'src/helpers';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONVERSATION_CREATED_EVENT, ConversationCreatedEvent } from 'src/events';
import { Builder } from 'builder-pattern';
import { QueryConversationDto } from '../dtos';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(DirectConversation)
    private readonly directConversationRepository: Repository<DirectConversation>,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async findOneWithUsersById(id: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!conversation) {
      throw new NotFoundException(`There is no conversation under id ${id}`);
    }

    return conversation;
  }

  async createDirectConversation(firstUserId: string, secondUserId: string) {
    const existingDirectConversation = await this.findDirectConversationByUsers(firstUserId, secondUserId);
    if (existingDirectConversation) {
      throw new BadRequestException('Conversation between the two users already exists');
    }

    const [firstUser, secondUser] = await Promise.all([
      this.userService.findOneById(firstUserId),
      this.userService.findOneById(secondUserId)
    ]);

    const conversation = this.directConversationRepository.create({
      users: [firstUser, secondUser]
    });

    const newConversation = await this.directConversationRepository.save(conversation);
    this.emitDirectConversationCreatedEvent(newConversation);
  }

  async findAllConversationsByUserId(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: {
        users: {
          id: userId
        }
      }
    });
  }

  async findAllConversationsWithRelationsByUserId(queryConversationDto: Readonly<QueryConversationDto>): Promise<Conversation[]> {
    // const { userId, page = 1, limit = 10 } = queryConversationDto;
    const { userId } = queryConversationDto;

    // Constructing the query
    const queryBuilder = this.conversationRepository.createQueryBuilder('conversation')
      // Exclude the user with the specified userId out of the response
      .leftJoinAndSelect('conversation.users', 'user', 'user.id != :userId', { userId })
      // Ensure the conversation includes the specified userId
      .andWhere(qb => {
        const idsOfConversationsIncludingUserQuery = qb.subQuery()
          .select('cuu.conversationId')
          .from('conversation_users_user', 'cuu')
          .where('cuu.userId = :userId', { userId })
          .getQuery();
        return `conversation.id IN (${idsOfConversationsIncludingUserQuery})`;
      })
      .orderBy({
        'conversation.createdAt': 'DESC'
      });

    // Calculate offsets for pagination
    // const skip = (page - 1) * limit;
    // queryBuilder.skip(skip).take(limit);

    // Execute query and return result
    const conversations: Conversation[] = await queryBuilder.getMany();

    return conversations;
  }

  isMemberOfConversation(conversation: Conversation, userIdMakeRequest: string) {
    const conversationMembers = conversation.users;
    return isObjectWithIdExist(conversationMembers, userIdMakeRequest);
  }

  private async findDirectConversationByUsers(firstUserId: string, secondUserId: string) {
    const conversation = await this.directConversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.users', 'user')
      .where('user.id IN (:...userIds)', { userIds: [firstUserId, secondUserId] })
      .groupBy('conversation.id')
      .having('COUNT(conversation.id) = :count', { count: 2 })
      .getOne();

    return conversation;
  }

  private emitDirectConversationCreatedEvent(newConversation: DirectConversation) {
    this.eventEmitter.emit(
      CONVERSATION_CREATED_EVENT,
      Builder<ConversationCreatedEvent>()
        .conversationId(newConversation.id)
        .membersIdsList(newConversation.users.map(user => user.id))
        .build()
    );
  }
}
