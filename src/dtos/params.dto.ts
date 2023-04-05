import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

class FindOneParams {
    @IsNumber()
    @IsOptional(null)
    @Transform(({ value }) => Number(value))
    id: number;
}

export default FindOneParams;
