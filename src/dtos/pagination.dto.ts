import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class Pagination {
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    offset?: number;
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    limit?: number;
}
