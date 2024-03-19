import { Controller, Param, Get } from '@nestjs/common';
import { UserService } from '../services';
import { ApiTags, ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/id/:userId/profile')
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiOperation({ summary: 'Get user profile by ID', description: 'Returns the profile of a user based on their ID.' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('userId') userId: string) {
    return this.userService.findOneById(userId);
  }

  @Get('/username/:username/profile')
  @ApiParam({ name: 'username', description: 'The username of the user' })
  @ApiOperation({ summary: 'Get user profile by username', description: 'Returns the profile of a user based on their username.' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Get('/exists/username/:username')
  @ApiParam({ name: 'username', description: 'The username to check for existence' })
  @ApiOperation({ summary: 'Check if username exists', description: 'Checks if a username is already in use.' })
  @ApiResponse({ status: 200, description: 'Username existence check' })
  async checkUsernameExistence(@Param('username') username: string): Promise<boolean> {
    const existingUser = await this.userService.findOneByUsername(username);
    return !!existingUser;
  }
}