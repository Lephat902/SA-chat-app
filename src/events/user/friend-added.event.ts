import { IsNotEmpty, IsString } from "class-validator";

export const USER_FRIEND_ADDED_EVENT = 'user.friend.added';
export class UserFriendAddedEvent {
    @IsString()
    @IsNotEmpty()
    firstUserId: string;

    @IsString()
    @IsNotEmpty()
    secondUserId: string;
}