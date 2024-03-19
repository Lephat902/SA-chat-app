import { ApiProperty } from "@nestjs/swagger";

export const LAST_READ_MESSAGE_UPDATED_EVENT = 'conversation.last-message.read';
export class LastReadMessageUpdatedEvent {
    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    lastReadMessageId: string;
}