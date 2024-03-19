import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageQueryDto } from '../dtos';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services';
import { ConversationService } from 'src/conversation/services';
import { RequestWithUser } from 'src/common/interfaces';

@Controller('conversations')
@ApiTags("Conversation's Message")
@ApiBearerAuth()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/messages')
  async getMessages(
    @Param('id') id: string,
    @Query() messageQueryDto: MessageQueryDto,
    @Req() req: RequestWithUser,
  ) {
    const conversation = await this.conversationService.findOne(id, true);
    const userIdMakeRequest = req.user.id;
    if (!this.conversationService.isMemberOfConversation(conversation, userIdMakeRequest)) {
      throw new ForbiddenException();
    }

    messageQueryDto.conversationId = id;
    return this.messageService.getMessages(messageQueryDto);
  }
}