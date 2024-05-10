import { ApiHideProperty } from '@nestjs/swagger';

// export class QueryConversationDto extends IntersectionType(
//   PaginationDto
// ) {
export class QueryConversationDto {
  @ApiHideProperty()
  userId: string;
}