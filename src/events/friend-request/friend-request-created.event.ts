import { ApiProperty } from '@nestjs/swagger';

export const FRIEND_REQUEST_CREATED_EVENT = 'friendRequest.created';
export class FriendRequestCreatedEvent {
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
        description: 'The timestamp indicating when the friend request was created',
        example: '2024-03-19T12:30:45.000Z',
    })
    createdAt: Date;
}