import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayloadDTO } from 'src/auth/dto/jwt.payload.dto';
import { RequestUser } from 'src/common/decorators/user.request.decorator';
import { IdParamInputDTO } from 'src/common/dto/id.param.input.dto';
import { CreateTagDTO } from './dto/create-tag.dto';
import { CreateTagOutputDTO } from './dto/create-tag.output.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { UpdateTagOutdutDTO } from './dto/update-tag.output.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(
    @RequestUser() jwtPayload: JwtPayloadDTO,
    @Body() createTagDto: CreateTagDTO,
  ) {
    const tag = await this.tagService.create(jwtPayload.userId, createTagDto);
    return new CreateTagOutputDTO(tag);
  }

  @Get(':id')
  async findOne(@Param() param: IdParamInputDTO) {
    return this.tagService.findOne(param.id);
  }

  @Put(':id')
  async update(
    @RequestUser() jwtPayload: JwtPayloadDTO,
    @Param() param: IdParamInputDTO,
    @Body() updateTagDTO: UpdateTagDTO,
  ) {
    const isCreatorTag = await this.tagService.checkTagCreator(
      jwtPayload.userId,
      param.id,
    );

    if (!isCreatorTag)
      throw new ForbiddenException('available only to the creator');

    const tag = await this.tagService.update(param.id, updateTagDTO);
    return new UpdateTagOutdutDTO(tag);
  }

  @Delete(':id')
  async delete(
    @RequestUser() jwtPayload: JwtPayloadDTO,
    @Param() param: IdParamInputDTO,
  ) {
    const isCreatorTag = await this.tagService.checkTagCreator(
      jwtPayload.userId,
      param.id,
    );

    if (!isCreatorTag)
      throw new ForbiddenException('available only to the creator');

    await this.tagService.deleteById(param.id);
  }
}
