import { IsNotEmpty, IsString } from "class-validator";

export const USER_ADDED_TO_GROUP_EVENT = 'group.user.added';
export class UserAddedToGroupEvent {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    conversationId: string;
}