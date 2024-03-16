import {
  ChildEntity,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@ChildEntity()
export class DirectConversation extends Conversation { }