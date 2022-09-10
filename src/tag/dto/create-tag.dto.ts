import { Length, IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class CreateTagDTO {
  @IsString()
  @Length(1, 40)
  name: string;

  @IsNumber()
  @IsInt()
  @IsOptional()
  sortOrder: number;
}
