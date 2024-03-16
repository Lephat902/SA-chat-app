import { ApiHideProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AddMessageDto {
  @IsString()
  @Length(1, 2000)
  text: string;

  @ApiHideProperty()
  conversationId: string;

  @ApiHideProperty()
  userId: string;
}
