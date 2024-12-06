import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTHENTICATE_PATTERN, UserDto } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class AuthPattern {
  @UseGuards(JwtAuthGuard)
  @MessagePattern(AUTHENTICATE_PATTERN)
  async authenticate(@Payload() data: { user: UserDto }) {
    return data.user;
  }
}
