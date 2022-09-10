import { User } from '../entities/user.entity';

export class GetUserDTO {
  email: string;

  nickname: string;

  tags: Array<{
    id: number;
    name: string;
    sortOrder: number;
  }>;

  constructor(user: User) {
    this.email = user.email;
    this.nickname = user.nickname;
    this.tags = user.tags.map((tag) => {
      return {
        id: tag.id,
        name: tag.name,
        sortOrder: tag.sortOrder,
      };
    });
  }
}
