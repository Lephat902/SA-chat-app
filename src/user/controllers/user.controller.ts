import {
  Controller,
  Param,
  Get,
} from '@nestjs/common';
import { UserService } from '../services';
import { ApiTags } from '@nestjs/swagger';

@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/id/:userId/profile')
  async getUserById(@Param('userId') userId: string) {
    return this.userService.findOneById(userId);
  }

  @Get('/username/:username/profile')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }
}