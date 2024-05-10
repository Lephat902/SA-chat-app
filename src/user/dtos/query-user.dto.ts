import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// export class QueryUserDto extends IntersectionType(
//   PaginationDto
// ) {
export class QueryUserDto {
  @ApiProperty({
    description: 'Query string to narrow results by username',
    example: 'joh',
    required: false,
  })
  @IsOptional()
  @IsString()
  q: string;
}