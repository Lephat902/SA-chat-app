import {
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  TableInheritance,
  Entity,
} from 'typeorm';
import { User } from 'src/user/entities';
import { Message } from 'src/message/entities/message.entity';
import { UserConversation } from 'src/message/entities';

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, user => user.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message: Message) => message.conversation)
  messages: Array<Message>;

  @OneToMany(() => UserConversation, userConversation => userConversation.conversation)
  userConversations: UserConversation[];
}
