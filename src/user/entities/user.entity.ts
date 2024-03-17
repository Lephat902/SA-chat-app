import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/message/entities';
import { Exclude } from 'class-transformer';
import { FriendRequest } from 'src/friend-request/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  username: string;

  @Column({ length: 60 })
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column({ default: false })
  isOnline: boolean;

  @ManyToMany(() => Conversation, conversation => conversation.users)
  conversations: Conversation[];

  @OneToMany(() => Message, (message: Message) => message.user)
  messages: Array<Message>;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.requester)
  sentFriendRequests: FriendRequest[];
  
  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.recipient)
  receivedFriendRequests: FriendRequest[];  
}
