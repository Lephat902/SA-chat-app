import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MarkMessageAsReadDto {
  @ApiProperty({
    description: 'The unique identifier of the message to be marked as read',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;
  
  @ApiHideProperty()
  userId: string;
}