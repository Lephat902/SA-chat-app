import { ApiProperty } from "@nestjs/swagger";

export const CONVERSATION_DELETED_EVENT = 'conversation.deleted';
export class ConversationDeletedEvent {
    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    membersIdsList: string[];
}