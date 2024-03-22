import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/services';
import { Conversation } from '../entities/conversation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CONVERSATION_CREATED_EVENT,
  CONVERSATION_DELETED_EVENT,
  ConversationCreatedEvent,
  ConversationDeletedEvent,
  USER_ADDED_TO_GROUP_EVENT,
  USER_REMOVED_FROM_GROUP_EVENT,
  UserAddedToGroupEvent,
  UserRemovedFromGroupEvent,
} from 'src/events';
import { Builder } from 'builder-pattern';
import { ConversationService } from './conversation.service';
import { CreateGroupConversationDto, UpdateGroupConversationDto } from '../dtos';
import { getArrayWithUniqueElements } from 'src/helpers';
import { User } from 'src/user/entities';
import { GroupConversation } from '../entities';

@Injectable()
export class GroupConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(GroupConversation)
    private readonly groupConversationRepository: Repository<GroupConversation>,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async createGroupConversation(createGroupConversationDto: CreateGroupConversationDto) {
    const { adminId } = createGroupConversationDto;
    const initialMembers: string[] = getArrayWithUniqueElements(createGroupConversationDto.initialMembers);
    if (!adminId) {
      throw new BadRequestException('The group must have an admin');
    }
    if (initialMembers.includes(adminId)) {
      throw new BadRequestException("Admin shouldn't be in initial members list");
    }

    const initialMembersToInsert: Partial<User>[] = initialMembers.map(id => ({ id }));
    const conversation = this.groupConversationRepository.create({
      ...createGroupConversationDto,
      users: [
        { id: adminId },
        ...initialMembersToInsert
      ],
    });

    const newConversation = await this.groupConversationRepository.save(conversation);

    this.eventEmitter.emit(
      CONVERSATION_CREATED_EVENT,
      Builder<ConversationCreatedEvent>()
        .conversationId(newConversation.id)
        .membersIdsList([adminId, ...initialMembers])
        .build()
    );
  }

  async removeGroupConversation(id: string, userIdMakeRequest: string) {
    const conversation = await this.findGroupWithUsersById(id);

    if (!conversation) {
      throw new NotFoundException(`Group conversation ${id} not found`);
    }

    this.checkGroupAdminPermission(conversation, userIdMakeRequest);

    await this.conversationRepository.delete({ id });

    const membersIdsList = conversation.users.map(user => user.id);
    this.eventEmitter.emit(
      CONVERSATION_DELETED_EVENT,
      Builder<ConversationDeletedEvent>()
        .conversationId(id)
        .membersIdsList(membersIdsList)
        .build()
    );
  }

  async updateGroupConversation(id: string, adminId: string, updateGroupConversationDto: UpdateGroupConversationDto) {
    const conversation = await this.groupConversationRepository.preload({
      id,
      ...updateGroupConversationDto,
    });

    if (!conversation) {
      throw new NotFoundException(`There is no conversation under id ${id}`);
    }

    this.checkGroupAdminPermission(conversation, adminId);

    return this.groupConversationRepository.save(conversation);
  }

  async addToGroup(userIdMakeRequest: string, userIdToAdd: string, conversationId: string) {
    const [user, conversation] = await Promise.all([
      this.userService.findOneById(userIdToAdd),
      this.findGroupWithUsersById(conversationId),
    ])

    this.checkGroupAdminPermission(conversation, userIdMakeRequest);

    if (this.conversationService.isMemberOfConversation(conversation, userIdToAdd)) {
      throw new BadRequestException(`User ${userIdToAdd} is already in group`);
    }

    conversation.users.push(user);
    await this.conversationRepository.save(conversation);

    this.eventEmitter.emit(
      USER_ADDED_TO_GROUP_EVENT,
      Builder<UserAddedToGroupEvent>()
        .userId(userIdToAdd)
        .conversationId(conversationId)
        .build()
    );
  }

  async deleteFromGroup(userIdMakeRequest: string, userIdToDelete: string, conversationId: string) {
    if (userIdToDelete === userIdMakeRequest) {
      throw new BadRequestException("You cannot delete yourself");
    }

    const conversation = await this.findGroupWithUsersById(conversationId);
    this.checkGroupAdminPermission(conversation, userIdMakeRequest);

    if (!this.conversationService.isMemberOfConversation(conversation, userIdToDelete)) {
      throw new BadRequestException(`User ${userIdToDelete} is not in group`);
    }

    conversation.users = conversation.users.filter(user => user.id !== userIdToDelete);
    await this.conversationRepository.save(conversation);

    this.eventEmitter.emit(
      USER_REMOVED_FROM_GROUP_EVENT,
      Builder<UserRemovedFromGroupEvent>()
        .userId(userIdToDelete)
        .conversationId(conversationId)
        .isKicked(true)
        .build()
    );
  }

  async leaveGroup(userIdMakeRequest: string, conversationId: string) {
    const conversation = await this.findGroupWithUsersById(conversationId);

    if (conversation.adminId === userIdMakeRequest) {
      throw new BadRequestException("Admin cannot leave the group");
    }
    if (!this.conversationService.isMemberOfConversation(conversation, userIdMakeRequest)) {
      throw new BadRequestException("You aren't member of this group");
    }

    conversation.users = conversation.users.filter(user => user.id !== userIdMakeRequest);
    await this.conversationRepository.save(conversation);

    this.eventEmitter.emit(
      USER_REMOVED_FROM_GROUP_EVENT,
      Builder<UserRemovedFromGroupEvent>()
        .userId(userIdMakeRequest)
        .conversationId(conversationId)
        .isKicked(false)
        .build()
    );
  }

  async getMembersOfGroupConversation(userIdMakeRequest: string, conversationId: string) {
    const conversation = await this.findGroupWithUsersById(conversationId);
    if (!this.conversationService.isMemberOfConversation(conversation, userIdMakeRequest)) {
      throw new ForbiddenException("You cannot see members of this group");
    }
    return conversation.users;
  }

  private async findGroupWithUsersById(id: string): Promise<GroupConversation> {
    const conversation = await this.groupConversationRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!conversation) {
      throw new NotFoundException(`Group conversation ${id} not found`);
    }

    return conversation;
  }

  private checkGroupAdminPermission(groupConversation: GroupConversation, userIdMakeRequest: string) {
    if (userIdMakeRequest !== groupConversation.adminId) {
      throw new ForbiddenException("You are not admin of this group");
    }
  }
}
