import { ApiProperty } from "@nestjs/swagger";

export const CONVERSATION_DELETED_EVENT = 'conversation.deleted';
export class ConversationDeletedEvent {
    @ApiProperty({
        description: "The unique identifier of the conversation that was deleted",
        example: "7291a5df-81d9-4a8c-a1a2-4a502d5e8e34"
    })
    conversationId: string;

    @ApiProperty({
        description: "A list containing the unique identifiers of the members who were part of the deleted conversation",
        example: ["a1b2c3d4", "e5f6g7h8"]
    })
    membersIdsList: string[];
}