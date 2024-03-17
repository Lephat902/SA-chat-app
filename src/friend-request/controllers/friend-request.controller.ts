import {
  Controller,
  Req,
  UseGuards,
  Post,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/interfaces';
import { FriendRequestService } from '../services';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/users')
@ApiBearerAuth()
@ApiTags('Friend Request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/received-requests')
  async getAllReceivedRequests(
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.getMyReceivedRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/sent-requests')
  async getAllSentRequests(
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.getMySentRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/friend-requests/:recipientId')
  async makeFriendRequest(
    @Req() req: RequestWithUser,
    @Param('recipientId') recipientId: string,
  ) {
    const requestorId = req.user.id;
    return this.friendRequestService.makeFriendRequest(requestorId, recipientId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/received-requests/:requestId/accept')
  async acceptFriendRequest(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.acceptFriendRequest(userId, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/received-requests/:requestId/reject')
  async rejectFriendRequest(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.rejectFriendRequest(userId, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/sent-requests/:requestId/cancel')
  async cancelFriendRequest(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.cancelFriendRequest(userId, requestId);
  }
}
