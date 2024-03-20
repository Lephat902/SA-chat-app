import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
    required: true,
  })
  @IsString()
  @Length(5, 20, {
    message: 'Username must be between 5 and 20 characters long',
  })
  @Matches(/^\w+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  readonly username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5, {
    message: 'Password must be at least 5 characters long',
  })
  readonly password: string;

  @ApiProperty({
    description: 'URL of the user avatar image',
    example: 'https://robohash.org/example.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  readonly avatar?: string;
}