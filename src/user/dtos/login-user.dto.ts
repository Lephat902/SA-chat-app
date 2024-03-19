import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Username of the user logging in',
    example: 'john_doe',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password of the user logging in',
    example: 'password123',
    required: true,
  })
  @IsString()
  password: string;
}