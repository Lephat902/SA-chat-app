export const FRIEND_REQUEST_CREATED_EVENT = 'friendRequest.created';
export class FriendRequestCreatedEvent {
    requestId: string;
    requesterId: string;
    recipientId: string;
    createdAt: Date;
}