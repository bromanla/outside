import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BindTagDTO } from './dto/bind-tag.dto';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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

  async bindTag(uid: string, bindTagDto: BindTagDTO) {
    // fetch in one query
    const tags = await this.tagRepository.find({
      where: {
        id: In(bindTagDto.tags),
      },
      select: {
        id: true,
        name: true,
        sortOrder: true,
      },
    });

    // if the length of the arrays does not match
    // it means that a non-existent id was entered
    if (tags.length !== bindTagDto.tags.length) {
      // search for it
      const tagsId = tags.map((tag) => tag.id);
      const errTagsId = bindTagDto.tags.filter((id) => !tagsId.includes(id));
      const message = `unavailable tag${
        errTagsId.length === 1 ? '' : 's'
      }: ${errTagsId.join(', ')}`;

      throw new BadRequestException(message);
    }

    const user = await this.usersRepository.findOne({
      where: { uid },
      relations: {
        tags: true,
      },
    });

    // now we are overwriting all tags
    // not optimal, but can be corrected through filters
    user.tags = [...user.tags, ...tags];
    await this.usersRepository.save(user);

    return tags;
  }

  async unbindTag(userId, tagId) {
    const user = await this.usersRepository.findOne({
      where: { uid: userId },
      relations: {
        tags: true,
      },
    });

    user.tags = user.tags.filter((tag) => tag.id != tagId);
    await this.usersRepository.save(user);

    return user.tags;
  }

  async getCreatedTag(userUid) {
    return this.tagRepository.find({
      where: {
        creatorUid: userUid,
      },
      select: {
        id: true,
        name: true,
        sortOrder: true,
      },
    });
  }
}
