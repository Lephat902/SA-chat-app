import { Controller, Req, UseGuards, Delete, Param, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { FriendService } from '../services';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
@ApiTags('Friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users/friends')
  @ApiOperation({ summary: 'Get friends list', description: 'Retrieves the list of friends for the logged-in user.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the friends list.' })
  @ApiResponse({ status: 403, description: 'Forbidden access. User is not authenticated.' })
  async getFriends(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.friendService.getFriends(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/users/friends/:friendId')
  @ApiOperation({ summary: 'Remove a friend', description: 'Removes a friend from the logged-in user\'s friend list.' })
  @ApiParam({ name: 'friendId', description: 'The ID of the friend to remove' })
  @ApiResponse({ status: 200, description: 'Friend successfully removed.' })
  @ApiResponse({ status: 403, description: 'Forbidden access. User is not authenticated.' })
  @ApiResponse({ status: 404, description: 'The specified friend could not be found.' })
  async removeFriend(@Req() req: RequestWithUser, @Param('friendId') friendId: string) {
    const userId = req.user.id;
    return this.friendService.removeFriend(userId, friendId);
  }
}