import { RequestStatus } from "src/friend-request/entities";

export const FRIEND_REQUEST_UPDATED_EVENT = 'friendRequest.updated';
export class FriendRequestUpdatedEvent {
    requestId: string;
    requesterId: string;
    recipientId: string;
    updatedAt: Date;
    newStatus: RequestStatus;
}