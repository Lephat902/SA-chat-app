import { ApiProperty } from "@nestjs/swagger";

export const CONVERSATION_MESSAGE_ADDED = 'conversation.message.added';
export class ConversationMessageAddedEvent {
    @ApiProperty({
        description: "The unique identifier of the new message",
        example: "60a4c4de-f6ec-4a67-a1c5-8a62a6fe9c1a"
    })
    id: string;

    @ApiProperty({
        description: "The content of the message",
        example: "Hello there! How are you?"
    })
    text: string;
  
    @ApiProperty({
        description: "The ID of the conversation to which this message belongs",
        example: "7291a5df-81d9-4a8c-a1a2-4a502d5e8e34"
    })
    conversationId: string;
  
    @ApiProperty({
        description: "The ID of the user who sent this message",
        example: "7291a5df-81d9-4a8c-hdjd-4a502d5e8e34"
    })
    userId: string;

    @ApiProperty({
        description: "The timestamp indicating when the message was created",
        example: new Date()
    })
    createdAt: Date;
}