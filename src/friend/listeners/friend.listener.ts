import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { FRIEND_REQUEST_UPDATED_EVENT, FriendRequestUpdatedEvent } from 'src/events/friend-request';
import { FriendService } from '../services';

@Injectable()
export class FriendListener {
  constructor(
    private readonly friendService: FriendService,
  ) { }

  @OnEvent(FRIEND_REQUEST_UPDATED_EVENT)
  async handleUserFriendAddedEvent(event: FriendRequestUpdatedEvent) {
    const { requesterId, recipientId } = event;
    await this.friendService.addFriend(requesterId, recipientId);
  }
}
