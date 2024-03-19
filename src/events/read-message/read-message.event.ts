import { ApiProperty } from "@nestjs/swagger";

export const LAST_READ_MESSAGE_UPDATED_EVENT = 'conversation.last-message.read';
export class LastReadMessageUpdatedEvent {
    @ApiProperty({
        description: "The ID of the conversation where the last read message was updated",
        example: "7291a5df-81d9-4a8c-a1a2-4a502d5e8e34"
    })
    conversationId: string;

    @ApiProperty({
        description: "The ID of the user whose last read message was updated",
        example: "a1b2c3d4"
    })
    userId: string;

    @ApiProperty({
        description: "The ID of the last read message",
        example: "60a4c4de-f6ec-4a67-a1c5-8a62a6fe9c1a"
    })
    lastReadMessageId: string;
}