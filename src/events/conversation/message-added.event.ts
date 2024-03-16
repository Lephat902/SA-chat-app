import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";

export const CONVERSATION_MESSAGE_ADDED = 'conversation.message.added';
export class ConversationMessageAddedEvent {
    @IsString()
    @Length(1, 2000)
    text: string;
  
    @IsNotEmpty()
    @IsString()
    conversationId: string;
  
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;
}