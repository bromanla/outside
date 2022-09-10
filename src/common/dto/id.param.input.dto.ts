import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class IdParamInputDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
