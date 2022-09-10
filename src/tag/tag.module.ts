import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  providers: [TagService],
  controllers: [TagController],
  imports: [TypeOrmModule.forFeature([Tag, User])],
  exports: [],
})
export class TagModule {}
