import { CreateTagOutputDTO } from 'src/tag/dto/create-tag.output.dto';
import { User } from '../entities/user.entity';

export class GetUserOutputDTO {
  email: string;

  nickname: string;

  tags: CreateTagOutputDTO[];

  constructor(user: User) {
    this.email = user.email;
    this.nickname = user.nickname;
    this.tags = user.tags.map((tag) => new CreateTagOutputDTO(tag));
  }
}
