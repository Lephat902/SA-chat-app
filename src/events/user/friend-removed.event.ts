import { IsNotEmpty, IsString } from "class-validator";

export const USER_FRIEND_REMOVED_EVENT = 'user.friend.removed';
export class UserFriendRemovedEvent {
    @IsString()
    @IsNotEmpty()
    firstUserId: string;

    @IsString()
    @IsNotEmpty()
    secondUserId: string;
}