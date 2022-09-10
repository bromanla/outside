import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, Tag])],
  exports: [],
})
export class UserModule {}
