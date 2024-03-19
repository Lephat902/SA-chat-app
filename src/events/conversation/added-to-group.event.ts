import { ApiProperty } from "@nestjs/swagger";

export const USER_ADDED_TO_GROUP_EVENT = 'group.user.added';
export class UserAddedToGroupEvent {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    conversationId: string;
}