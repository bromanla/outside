import {
  Post,
  Body,
  Controller,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RequestUser } from 'src/common/decorators/user.request.decorator';
import { JwtPayloadDTO } from './dto/jwt.payload.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { TokenOutputDTO } from './dto/token.output.dto';

@Controller()
export class AuthController {
  expire: number;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('signin')
  async signin(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.create(createUserDTO);
    const token = await this.authService.issueToken(user.uid);

    return new TokenOutputDTO(token, this.authService.expire);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const { email, password } = loginDTO;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('user is not found');

    const isPasswordCorrect = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordCorrect) throw new UnauthorizedException('invalid password');

    const token = await this.authService.issueToken(user.uid);

    return new TokenOutputDTO(token, this.authService.expire);
  }

  @Post('logout')
  async logout(@RequestUser() jwtPayload: JwtPayloadDTO) {
    await this.authService.revokeToken(jwtPayload.tokenId);
  }
}
