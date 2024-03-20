import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Max, IsOptional } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({
        description: 'Page number to retrieve, starting from 1',
        required: false,
    })
    readonly page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @Max(20)
    @ApiProperty({
        description: 'Number of items per page, with a maximum of 20',
        required: false,
    })
    readonly limit: number = 10;
}
