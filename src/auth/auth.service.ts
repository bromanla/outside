import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { JwtPayloadDTO } from './dto/jwt.payload.dto';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  expire: number;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.expire = parseInt(this.configService.get<string>('JWT_EXPIRES'));
  }

  // tokenId is needed to facilitate search by cacheManager (it is shorter than JWT)
  async issueToken(userId: string) {
    const payload: JwtPayloadDTO = {
      tokenId: uuid(),
      userId: userId,
    };

    return this.jwtService.sign(payload);
  }

  async comparePassword(password: string, hash: string) {
    return compare(password, hash);
  }

  async revokeToken(tokenId: string) {
    return this.cacheManager.set(tokenId, true, { ttl: this.expire });
  }

  async checkToken(tokenId: string) {
    return Boolean(await this.cacheManager.get(tokenId));
  }
}
