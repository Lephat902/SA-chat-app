import { Controller, Req, UseGuards, Post, Param, Put, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/interfaces';
import { FriendRequestService } from '../services';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('/users')
@ApiBearerAuth()
@ApiTags('Friend Request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/received-requests')
  @ApiOperation({ summary: 'Get all received friend requests', description: 'Retrieves all friend requests that the current user has received.' })
  @ApiResponse({ status: 200, description: 'Requests retrieved successfully' })
  async getAllReceivedRequests(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.friendRequestService.getMyReceivedRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/sent-requests')
  @ApiOperation({ summary: 'Get all sent friend requests', description: 'Retrieves all friend requests that the current user has sent.' })
  @ApiResponse({ status: 200, description: 'Requests retrieved successfully' })
  async getAllSentRequests(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.friendRequestService.getMySentRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/friend-requests/:recipientId')
  @ApiOperation({ summary: 'Send a friend request', description: 'Sends a friend request to another user.' })
  @ApiParam({ name: 'recipientId', description: 'The ID of the recipient user' })
  @ApiResponse({ status: 201, description: 'Friend request sent successfully' })
  async makeFriendRequest(
    @Req() req: RequestWithUser,
    @Param('recipientId') recipientId: string,
  ) {
    const requestorId = req.user.id;
    return this.friendRequestService.makeFriendRequest(requestorId, recipientId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/received-requests/:requestId/accept')
  @ApiOperation({ summary: 'Accept a friend request', description: 'Accepts a received friend request.' })
  @ApiParam({ name: 'requestId', description: 'The ID of the friend request to accept' })
  @ApiResponse({ status: 200, description: 'Friend request accepted successfully' })
  async acceptFriendRequest(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.acceptFriendRequest(userId, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/received-requests/:requestId/reject')
  @ApiOperation({ summary: 'Reject a friend request', description: 'Rejects a received friend request.' })
  @ApiParam({ name: 'requestId', description: 'The ID of the friend request to reject' })
  @ApiResponse({ status: 200, description: 'Friend request rejected successfully' })
  async rejectFriendRequest(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.rejectFriendRequest(userId, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/sent-requests/:requestId/cancel')
  @ApiOperation({ summary: 'Cancel a sent friend request', description: 'Cancels a friend request that the current user has sent.' })
  @ApiParam({ name: 'requestId', description: 'The ID of the friend request to cancel' })
  @ApiResponse({ status: 200, description: 'Friend request cancelled successfully' })
  async cancelFriendRequest(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.cancelFriendRequest(userId, requestId);
  }
}