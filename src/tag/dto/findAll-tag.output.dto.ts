import { FindAllTagDTO } from './findAll-tag.dto';
import { FindTagOutputDTO } from './findTag.output.dto';

export class FindAllTagOutputDTO {
  data: FindTagOutputDTO[];

  meta: {
    offset: number;
    length: number;
    quantity: number;
  };

  constructor(data: FindTagOutputDTO[], meta: FindAllTagDTO, quantity: number) {
    this.data = data;
    this.meta = {
      offset: meta.offset,
      length: meta.length,
      quantity,
    };
  }
}
