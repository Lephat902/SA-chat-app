import { ApiHideProperty, IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common';

export class QueryConversationDto extends IntersectionType(
  PaginationDto
) {
  @ApiHideProperty()
  userId: string;
}