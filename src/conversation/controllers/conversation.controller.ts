import { Controller, ForbiddenException, Get, Param, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../common';
import { ConversationService } from '../services/conversation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Conversation } from '../entities';

@Controller('conversations')
@ApiTags('Conversation')
@ApiBearerAuth()
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all user conversations', description: 'Retrieves all conversations belonging to the authenticated user.' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully', type: [Conversation] })
  async findMyConversations(@Req() req: RequestWithUser) {
    const userIdMakeRequest = req.user.id;
    return this.conversationService.findAllConversations(userIdMakeRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a conversation', description: 'Retrieves details of a conversation by its ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the conversation' })
  @ApiResponse({ status: 200, description: 'Conversation details retrieved successfully', type: Conversation })
  @ApiResponse({ status: 403, description: 'Forbidden access. User is not a member of the conversation.' })
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Conversation> {
    const userIdMakeRequest = req.user.id;
    const conversation = await this.conversationService.findOneWithUsersById(id);
    if (!this.conversationService.isMemberOfConversation(conversation, userIdMakeRequest)) {
      throw new ForbiddenException("You aren't allowed to access this conversation");
    }

    return conversation;
  }
}