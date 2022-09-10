import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayloadDTO } from 'src/auth/dto/jwt.payload.dto';
import { RequestUser } from 'src/common/decorators/user.request.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDTO } from './dto/create-user.output.dto';
import { UserService } from './user.service';
import { UpdateUserOutputDTO } from './dto/update-user.output.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async user(@RequestUser() jwtPayload: JwtPayloadDTO) {
    const user = await this.userService.findById(jwtPayload.userId);
    return new GetUserDTO(user);
  }

  @Put()
  async update(
    @RequestUser() jwtPayload: JwtPayloadDTO,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateById(
      jwtPayload.userId,
      updateUserDto,
    );
    return new UpdateUserOutputDTO(user);
  }

  @Delete()
  async delete(@RequestUser() jwtPayload: JwtPayloadDTO) {
    await this.userService.deleteById(jwtPayload.userId);
    await this.authService.revokeToken(jwtPayload.tokenId);
  }
}
