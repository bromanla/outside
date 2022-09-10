import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  providers: [
    AuthService,
    UserService,
    {
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
  ],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User, Tag]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES'),
        },
      }),
    }),
  ],
  exports: [],
})
export class AuthModule {}
