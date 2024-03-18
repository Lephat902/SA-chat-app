import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export const CONVERSATION_CREATED_EVENT = 'conversation.created';
export class ConversationCreatedEvent {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    conversationId: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ApiProperty()
    membersIdsList: string[];
}