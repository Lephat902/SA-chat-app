import { ApiProperty } from "@nestjs/swagger";

export const USER_REMOVED_FROM_GROUP_EVENT = 'group.user.removed';
export class UserRemovedFromGroupEvent {
    @ApiProperty({
        description: "The unique identifier of the user who was removed from the group",
        example: "a1b2c3d4"
    })
    userId: string;

    @ApiProperty({
        description: "The unique identifier of the conversation (group) from which the user was removed",
        example: "7291a5df-81d9-4a8c-a1a2-4a502d5e8e34"
    })
    conversationId: string;

    @ApiProperty({
        description: "Indicates whether the user was kicked from the group (true) or left voluntarily (false)",
        example: true
    })
    isKicked: boolean;
}