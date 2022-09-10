import { Tag } from '../entities/tag.entity';

export class UpdateTagOutdutDTO {
  creator: {
    uid: string;
    nickname: string;
  };
  name: string;
  sortOrder: number;

  constructor(tag: Tag) {
    this.creator = {
      uid: tag.creator.uid,
      nickname: tag.creator.nickname,
    };
    this.name = tag.name;
    this.sortOrder = tag.sortOrder;
  }
}
