import { Tag } from '../entities/tag.entity';

export class CreateTagOutputDTO {
  id: number;
  name: string;
  sortOrder: number;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.name = tag.name;
    this.sortOrder = tag.sortOrder;
  }
}
