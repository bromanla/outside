import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import { FindAllTagDTO } from './dto/findAll-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async checkTagCreator(creatorUid, tagId) {
    const tag = await this.tagRepository.findOne({ where: { id: tagId } });
    return tag && tag.creatorUid === creatorUid;
  }

  async create(creatorUid: string, createTagDto: CreateTagDTO) {
    const tag = this.tagRepository.create({
      ...createTagDto,
      creatorUid,
    });

    return this.tagRepository.save(tag).catch((err) => {
      throw err.code === '23505'
        ? new BadRequestException('name already in use')
        : err;
    });
  }

  async getCount() {
    return this.tagRepository.count();
  }

  async findOne(id: number) {
    return this.tagRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        sortOrder: true,
        creator: {
          uid: true,
          nickname: true,
        },
      },
      relations: {
        creator: true,
      },
    });
  }

  async findAll(findAllTagDto: FindAllTagDTO) {
    // default query options
    const options: FindManyOptions<Tag> = {
      select: {
        id: true,
        name: true,
        sortOrder: true,
        creator: {
          nickname: true,
          uid: true,
        },
      },
      relations: {
        creator: true,
      },
      skip: findAllTagDto.offset,
      take: findAllTagDto.length,
      order:
        findAllTagDto.sortByName || findAllTagDto.sortByOrder
          ? {}
          : { id: 'asc' },
    };

    if (findAllTagDto.sortByName) options.order.name = 'asc';
    if (findAllTagDto.sortByOrder) options.order.sortOrder = 'asc';

    return this.tagRepository.find(options);
  }

  async update(tagId: number, updateTagDto: UpdateTagDTO) {
    const tag = await this.tagRepository.findOne({
      select: {
        id: true,
        name: true,
        sortOrder: true,
        creator: {
          uid: true,
          nickname: true,
        },
      },
      where: { id: tagId },
      relations: { creator: true },
    });

    // check for creator includes check for tag existence
    // so let's assume the tag already exists
    return this.tagRepository
      .save({
        ...tag,
        ...updateTagDto,
      })
      .catch((err) => {
        throw err.code === '23505'
          ? new BadRequestException('name already in use')
          : err;
      });
  }

  async deleteById(id: number) {
    return this.tagRepository.delete({ id });
  }
}
