import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ConversationService } from '../services/conversation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Conversation } from '../entities';

@Controller('conversations')
@ApiTags('Conversation')
@ApiBearerAuth()
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ description: "User gets all his/her conversations if any." })
  async findMyConversations(@Req() req: RequestWithUser) {
    const userIdMakeRequest = req.user.id;
    return this.conversationService.findAllConversations(userIdMakeRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ description: "User gets details of a conversation." })
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Conversation> {
    const userIdMakeRequest = req.user.id;
    const conversation = await this.conversationService.findOne(id, true);
    if (!this.conversationService.isMemberOfConversation(conversation, userIdMakeRequest)) {
      throw new ForbiddenException("You aren't allowed to access this conversation");
    }

    return conversation;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const userIdMakeRequest = req.user.id;
    return this.conversationService.remove(id, userIdMakeRequest);
  }
}
