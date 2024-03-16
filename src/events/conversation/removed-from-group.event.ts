import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export const USER_REMOVED_FROM_GROUP_EVENT = 'group.user.removed';
export class UserRemovedFromGroupEvent {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsBoolean()
    @IsNotEmpty()
    isKicked: boolean;
}