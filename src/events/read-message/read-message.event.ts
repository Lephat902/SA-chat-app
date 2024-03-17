import { IsNotEmpty, IsString } from "class-validator";

export const LAST_READ_MESSAGE_EVENT = 'conversation.last-message.read';
export class LastReadMessageEvent {
    @IsNotEmpty()
    @IsString()
    conversationId: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    lastReadMessageId: string;
}