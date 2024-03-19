import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from "src/friend-request/entities";

export const FRIEND_REQUEST_UPDATED_EVENT = 'friendRequest.updated';
export class FriendRequestUpdatedEvent {
    @ApiProperty({
        description: 'The unique identifier of the friend request',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    requestId: string;

    @ApiProperty({
        description: 'The ID of the user who sent the friend request',
        example: 'a1b2c3d4',
    })
    requesterId: string;

    @ApiProperty({
        description: 'The ID of the user who received the friend request',
        example: 'e5f6g7h8',
    })
    recipientId: string;

    @ApiProperty({
        description: 'The timestamp indicating when the friend request status was last updated',
        example: '2024-03-20T15:00:00.000Z',
    })
    updatedAt: Date;

    @ApiProperty({
        enum: Object.values(RequestStatus),
        description: 'The new status of the friend request',
    })
    newStatus: RequestStatus;
}