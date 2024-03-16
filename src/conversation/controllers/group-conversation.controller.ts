import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateGroupConversationDto, UpdateGroupConversationDto } from '../dtos';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GroupConversationService } from '../services/group-conversation.service';

@Controller('/conversations/groups')
@ApiTags('Group Conversation')
@ApiBearerAuth()
export class GroupConversationController {
  constructor(private readonly groupConversationService: GroupConversationService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGroupConversation(
    @Req() req: RequestWithUser,
    @Body() createGroupConversationDto: CreateGroupConversationDto,
  ) {
    createGroupConversationDto.adminId = req.user.id;
    return this.groupConversationService.createGroupConversation(createGroupConversationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateGroupConversation(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() updateGroupConversationDto: UpdateGroupConversationDto,
  ) {
    const adminId = req.user.id;
    return this.groupConversationService.updateGroupConversation(id, adminId, updateGroupConversationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:conversationId/members/:memberId')
  async addMember(
    @Param('conversationId') conversationId: string,
    @Param('memberId') memberId: string,
    @Req() req: RequestWithUser,
  ) {
    const adminId = req.user.id;
    return this.groupConversationService.addToGroup(adminId, memberId, conversationId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:conversationId/members/:memberId')
  async removeMember(
    @Param('conversationId') conversationId: string,
    @Param('memberId') memberId: string,
    @Req() req: RequestWithUser,
  ) {
    const adminId = req.user.id;
    return this.groupConversationService.deleteFromGroup(adminId, memberId, conversationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:conversationId/leave')
  async leaveGroup(
    @Param('conversationId') conversationId: string,
    @Req() req: RequestWithUser,
  ) {
    const userIdMakeRequest = req.user.id;
    return this.groupConversationService.leaveGroup(userIdMakeRequest, conversationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:conversationId/members')
  async getMembers(
    @Param('conversationId') conversationId: string,
    @Req() req: RequestWithUser,
  ) {
    const userIdMakeRequest = req.user.id;
    return this.groupConversationService.getMembers(userIdMakeRequest, conversationId);
  }
}
