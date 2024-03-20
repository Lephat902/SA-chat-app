import { Controller, Param, Get, Query } from '@nestjs/common';
import { UserService } from '../services';
import { ApiTags, ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { QueryUserDto } from '../dtos';
import { User } from '../entities';
import { PaginatedResults } from 'src/common';

@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOperation({
    summary: 'Retrieve Paginated List of Users with Total Count',
    description: 'Fetches a paginated list of users along with the total number of users available. You can filter the results using query parameters such as username (`q`), specify the page number (`page`), and set the number of results per page (`limit`). This is useful for implementing data tables or lists with pagination on the frontend.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users along with the total number of users returned successfully. The response includes an array of user objects for the current page and the total count of users that match the query criteria.',
    // type: PaginatedResults<User>
  })
  async getAllUsersAndTotalCount(@Query() queryUserDto: QueryUserDto): Promise<PaginatedResults<User>> {
    return this.userService.getAllUsersAndTotalCount(queryUserDto);
  }

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