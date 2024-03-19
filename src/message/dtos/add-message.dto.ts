import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AddMessageDto {
  @IsString()
  @Length(1, 2000)
  text: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiHideProperty()
  userId: string;
}
