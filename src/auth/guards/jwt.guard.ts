import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // if the route is marked public, we do not use guard
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // get, check and validate the token
    const req = context.switchToHttp().getRequest();
    const authHeaderAsBearerToken = req.headers.authorization;

    if (!/^Bearer .*$/.test(authHeaderAsBearerToken)) return false;

    const token = authHeaderAsBearerToken.split(' ')[1];

    try {
      const user = this.jwtService.verify(token);
      req.user = user;

      // check cache of revoked tokens
      const isTokenRevoked = await this.authService.checkToken(user.tokenId);
      return !isTokenRevoked;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }
}
