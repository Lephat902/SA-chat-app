import { ApiProperty } from "@nestjs/swagger";

export const USER_ADDED_TO_GROUP_EVENT = 'group.user.added';
export class UserAddedToGroupEvent {
    @ApiProperty({
        description: "The unique identifier of the user who was added to the group",
        example: "a1b2c3d4"
    })
    userId: string;

    @ApiProperty({
        description: "The unique identifier of the conversation (group) where the user was added",
        example: "7291a5df-81d9-4a8c-a1a2-4a502d5e8e34"
    })
    conversationId: string;
}