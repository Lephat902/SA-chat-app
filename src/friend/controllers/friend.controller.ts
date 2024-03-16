import {
  Controller,
  Req,
  UseGuards,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { FriendService } from '../services';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
@ApiTags('Friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users/friends')
  async getFriends(
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.friendService.getFriends(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/users/friends/:friendId')
  async removeFriend(
    @Req() req: RequestWithUser,
    @Param('friendId') friendId: string,
  ) {
    const userId = req.user.id;
    return this.friendService.removeFriend(userId, friendId);
  }
}
