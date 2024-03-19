import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AddMessageDto {
  @ApiProperty({
    description: 'Text content of the message',
    example: 'Hello, how are you?',
    required: true,
  })
  @IsString()
  @Length(1, 2000)
  text: string;

  @ApiProperty({
    description: 'ID of the conversation where the message will be added',
    example: '7291a5df-81d9-4a8c-a1a2-4a502d5e8e34',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiHideProperty()
  userId: string;
}