import { Controller, ForbiddenException, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { MessageQueryDto } from '../dtos';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MessageService } from '../services';
import { ConversationService } from 'src/conversation/services';
import { RequestWithUser } from 'src/common/';

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
  @ApiOperation({ summary: 'Get messages in a conversation', description: 'Retrieves messages in a conversation by conversation ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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