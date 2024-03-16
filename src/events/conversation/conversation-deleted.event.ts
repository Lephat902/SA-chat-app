import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export const CONVERSATION_DELETED_EVENT = 'conversation.deleted';
export class ConversationDeletedEvent {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    membersIdsList: string[];
}