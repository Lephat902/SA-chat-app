import { Controller, ForbiddenException, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../common';
import { ConversationService } from '../services/conversation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiParam, ApiExtraModels, refs } from '@nestjs/swagger';
import { Conversation } from '../entities';
import { DirectConversationItemQueryResponse, GroupConversationItemQueryResponse, QueryConversationDto } from '../dtos';

@Controller('conversations')
@ApiTags('Conversation')
@ApiBearerAuth()
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all user conversations', description: 'Retrieves all conversations belonging to the authenticated user.' })
  @ApiExtraModels(DirectConversationItemQueryResponse, GroupConversationItemQueryResponse)
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
    schema: { oneOf: refs(DirectConversationItemQueryResponse, GroupConversationItemQueryResponse) },
  })
  async findMyConversations(@Req() req: RequestWithUser, @Query() queryConversationDto: QueryConversationDto): Promise<
    (DirectConversationItemQueryResponse | GroupConversationItemQueryResponse)[]> {
    queryConversationDto.userId = req.user.id;
    return this.conversationService.findAllConversationsWithRelationsByUserId(queryConversationDto);
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