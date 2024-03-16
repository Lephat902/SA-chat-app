import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString, Max } from "class-validator";
import { SortingDirection } from "src/common";

export class MessageQueryDto {
  @ApiHideProperty()
  conversationId: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(20)
  @Type(() => Number)
  @ApiProperty({
    description: 'Limit, default is 10',
    required: false,
  })
  readonly limit: number = 10;

  @IsOptional()
  @ApiProperty({
    description: 'The sorting direction, default is DESC',
    enum: SortingDirection,
    required: false,
  })
  readonly dir?: SortingDirection = SortingDirection.DESC;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Mark message',
    required: false,
  })
  readonly markMessageId?: string;
}
