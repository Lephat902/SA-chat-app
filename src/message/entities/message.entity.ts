import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 2000 })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @JoinTable()
  @ManyToOne(() => Conversation, (conversation: Conversation) => conversation.messages)
  conversation: Conversation;

  @JoinTable()
  @ManyToOne(() => User, (user: User) => user.messages)
  user: User;
}
