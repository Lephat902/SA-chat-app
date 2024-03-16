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
    example: 'password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  readonly avatar: string;
}