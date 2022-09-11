import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { CacheModule, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TagModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    CacheModule.registerAsync<ClientOpts>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
