import { ApiProperty } from "@nestjs/swagger";

export const CONVERSATION_CREATED_EVENT = 'conversation.created';
export class ConversationCreatedEvent {
    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    membersIdsList: string[];
}