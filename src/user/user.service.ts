import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // private function for password hashing
  private async hashPassword(password: string) {
    return hash(password, 10);
  }

  async create(createUserDTO: CreateUserDTO) {
    const hashPassword = await this.hashPassword(createUserDTO.password);

    const user = this.usersRepository.create({
      email: createUserDTO.email,
      nickname: createUserDTO.nickname,
      password: hashPassword,
    });

    return this.usersRepository.save(user).catch((err) => {
      throw err.code === '23505'
        ? new BadRequestException('nickname or email already in use')
        : err;
    });
  }

  async findById(uid: string) {
    return this.usersRepository.findOne({
      where: { uid },
      select: {
        uid: true,
        email: true,
        nickname: true,
        tags: {
          id: true,
          name: true,
          sortOrder: true,
        },
      },
      relations: {
        tags: true,
      },
    });
  }

  async updateById(uid: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { uid },
      select: {
        uid: true,
        email: true,
        nickname: true,
        password: true,
      },
    });

    if (updateUserDto.password)
      updateUserDto.password = await this.hashPassword(updateUserDto.password);

    return this.usersRepository
      .save({
        ...user,
        ...updateUserDto,
      })
      .catch((err) => {
        throw err.code === '23505'
          ? new BadRequestException('nickname or email already in use')
          : err;
      });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async deleteById(uid: string) {
    await this.usersRepository.delete({ uid });
  }
}
