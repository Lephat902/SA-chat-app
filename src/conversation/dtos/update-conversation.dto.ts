import { PartialType } from '@nestjs/swagger';
import { CreateGroupConversationDto } from './create-group-conversation.dto';

export class UpdateGroupConversationDto extends PartialType(CreateGroupConversationDto) { }
