import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MarkMessageAsReadDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;
  
  @ApiHideProperty()
  userId: string;
}
