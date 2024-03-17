import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { FRIEND_REQUEST_UPDATED_EVENT, FriendRequestUpdatedEvent } from 'src/events/friend-request';
import { FriendService } from '../services';
import { RequestStatus } from 'src/friend-request/entities';

@Injectable()
export class FriendListener {
  constructor(
    private readonly friendService: FriendService,
  ) { }

  @OnEvent(FRIEND_REQUEST_UPDATED_EVENT)
  async handleUserFriendAddedEvent(event: FriendRequestUpdatedEvent) {
    const { requesterId, recipientId, newStatus } = event;
    if (newStatus === RequestStatus.ACCEPTED) {
      await this.friendService.addFriend(requesterId, recipientId);
    }
  }
}
