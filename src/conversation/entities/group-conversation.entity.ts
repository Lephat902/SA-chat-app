import {
  Column,
  ChildEntity,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@ChildEntity()
export class GroupConversation extends Conversation {
  @Column({ length: 50, default: '' })
  name: string;

  @Column({ length: 200, default: '' })
  description: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('uuid')
  adminId: string;
}
