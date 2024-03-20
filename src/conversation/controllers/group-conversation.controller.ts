import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../common';
import { CreateGroupConversationDto, UpdateGroupConversationDto } from '../dtos';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags, ApiResponse } from '@nestjs/swagger';
import { GroupConversationService } from '../services/group-conversation.service';

@Controller('/conversations/groups')
@ApiTags('Group Conversation')
@ApiBearerAuth()
export class GroupConversationController {
  constructor(private readonly groupConversationService: GroupConversationService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a group conversation', description: 'Creates a new group conversation.' })
  @ApiResponse({ status: 201, description: 'Group conversation created successfully' })
  async createGroupConversation(
    @Req() req: RequestWithUser,
    @Body() createGroupConversationDto: CreateGroupConversationDto,
  ) {
    createGroupConversationDto.adminId = req.user.id;
    return this.groupConversationService.createGroupConversation(createGroupConversationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a group conversation', description: 'Updates an existing group conversation.' })
  @ApiParam({ name: 'id', description: 'The ID of the group conversation to update' })
  @ApiResponse({ status: 200, description: 'Group conversation updated successfully' })
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
  @ApiOperation({ summary: 'Add a member to a group conversation', description: 'Adds a user to an existing group conversation.' })
  @ApiParam({ name: 'conversationId', description: 'The ID of the group conversation' })
  @ApiParam({ name: 'memberId', description: 'The ID of the user to add as a member' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
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
  @ApiOperation({ summary: 'Remove a member from a group conversation', description: 'Removes a user from an existing group conversation.' })
  @ApiParam({ name: 'conversationId', description: 'The ID of the group conversation' })
  @ApiParam({ name: 'memberId', description: 'The ID of the user to remove as a member' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
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
  @ApiOperation({ summary: 'Leave a group conversation', description: 'Allows a user to leave an existing group conversation.' })
  @ApiParam({ name: 'conversationId', description: 'The ID of the group conversation to leave' })
  @ApiResponse({ status: 200, description: 'User left the conversation successfully' })
  async leaveGroup(
    @Param('conversationId') conversationId: string,
    @Req() req: RequestWithUser,
  ) {
    const userIdMakeRequest = req.user.id;
    return this.groupConversationService.leaveGroup(userIdMakeRequest, conversationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:conversationId/members')
  @ApiOperation({ summary: 'Get members of a group conversation', description: 'Retrieves the members of an existing group conversation.' })
  @ApiParam({ name: 'conversationId', description: 'The ID of the group conversation' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  async getMembers(
    @Param('conversationId') conversationId: string,
    @Req() req: RequestWithUser,
  ) {
    const userIdMakeRequest = req.user.id;
    return this.groupConversationService.getMembers(userIdMakeRequest, conversationId);
  }
}