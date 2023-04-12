import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
export class FindOneParams {
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    id: number;
}
