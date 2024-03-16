import { ConversationService } from '../services/conversation.service';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_FRIEND_ADDED_EVENT, UserFriendAddedEvent } from 'src/events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationListener {
  constructor(
    private readonly conversationService: ConversationService,
  ) { }

  @OnEvent(USER_FRIEND_ADDED_EVENT)
  async handleUserFriendAddedEvent(event: UserFriendAddedEvent) {
    const { firstUserId, secondUserId } = event;
    await this.conversationService.createDirectConversation(firstUserId, secondUserId);
  }
}
