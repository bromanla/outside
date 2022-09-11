import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class BindTagDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  tags: number[];
}
