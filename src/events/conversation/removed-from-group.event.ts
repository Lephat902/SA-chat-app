import { ApiProperty } from "@nestjs/swagger";

export const USER_REMOVED_FROM_GROUP_EVENT = 'group.user.removed';
export class UserRemovedFromGroupEvent {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    isKicked: boolean;
}