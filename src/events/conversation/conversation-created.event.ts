import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export const CONVERSATION_CREATED_EVENT = 'conversation.created';
export class ConversationCreatedEvent {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    membersIdsList: string[];
}