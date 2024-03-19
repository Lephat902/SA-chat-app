import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateGroupConversationDto {
  @ApiProperty({
    description: 'Name of the group conversation (optional)',
    example: 'Team Meeting',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Description of the group conversation (optional)',
    example: 'Weekly team meeting to discuss project updates',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    description: 'URL of the group conversation avatar (optional)',
    example: 'https://i.pravatar.cc/300',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly avatar: string;

  @ApiProperty({
    description: 'List of initial members\' IDs for the group conversation',
    example: ['a1b2c3d4', 'e5f6g7h8'],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly initialMembers: string[];

  @ApiHideProperty()
  adminId: string;
}