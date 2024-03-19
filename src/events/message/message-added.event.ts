import { ApiProperty } from "@nestjs/swagger";

export const CONVERSATION_MESSAGE_ADDED = 'conversation.message.added';
export class ConversationMessageAddedEvent {
    @ApiProperty()
    id: string;

    @ApiProperty()
    text: string;
  
    @ApiProperty()
    conversationId: string;
  
    @ApiProperty()
    userId: string;

    @ApiProperty()
    createdAt: Date;
}