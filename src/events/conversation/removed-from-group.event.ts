import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export const USER_REMOVED_FROM_GROUP_EVENT = 'group.user.removed';
export class UserRemovedFromGroupEvent {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    conversationId: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    isKicked: boolean;
}