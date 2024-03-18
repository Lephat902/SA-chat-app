import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export const LAST_READ_MESSAGE_UPDATED_EVENT = 'conversation.last-message.read';
export class LastReadMessageUpdatedEvent {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    conversationId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    lastReadMessageId: string;
}