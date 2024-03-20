import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common';

export class QueryUserDto extends IntersectionType(
  PaginationDto
) {
  @ApiProperty({
    description: 'Query string to narrow results by username',
    example: 'joh',
    required: false,
  })
  @IsOptional()
  @IsString()
  q: string;
}