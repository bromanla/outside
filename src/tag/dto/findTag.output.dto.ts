import { Tag } from '../entities/tag.entity';

export class FindTagOutputDTO {
  name: string;
  sortOrder: number;
  creator: {
    uid: string;
    nickname: string;
  };

  constructor(tag: Tag) {
    this.name = tag.name;
    this.sortOrder = tag.sortOrder;
    this.creator = {
      uid: tag.creator.uid,
      nickname: tag.creator.nickname,
    };
  }
}
