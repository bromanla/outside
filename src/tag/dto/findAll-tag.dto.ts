import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindAllTagDTO {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? true : value))
  sortByOrder = false;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? true : value))
  sortByName = false;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @IsOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  length = 100;
}
