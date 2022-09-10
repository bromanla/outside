import { User } from '../entities/user.entity';

export class UpdateUserOutputDTO {
  email: string;
  nickname: string;

  constructor(user: User) {
    this.email = user.email;
    this.nickname = user.nickname;
  }
}
