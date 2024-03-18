import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";

export const CONVERSATION_MESSAGE_ADDED = 'conversation.message.added';
export class ConversationMessageAddedEvent {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    id: string;

    @IsString()
    @Length(1, 2000)
    @ApiProperty()
    text: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    conversationId: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId: string;

    @IsNotEmpty()
    @IsDate()
    @ApiProperty()
    createdAt: Date;
}