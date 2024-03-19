import { ApiProperty } from '@nestjs/swagger';

export const USER_FRIEND_ADDED_EVENT = 'user.friend.added';
export class UserFriendAddedEvent {
    @ApiProperty({
        description: 'The ID of one user in the friendship',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    firstUserId: string;

    @ApiProperty({
        description: 'The ID of the other user in the friendship',
        example: 'e89b12d3-4567-4266-1417-400123e45678',
    })
    secondUserId: string;
}