import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';

@Entity()
export class UserConversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.userConversations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Conversation, conversation => conversation.userConversations)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @ManyToOne(() => Message, { nullable: true })
    @JoinColumn({ name: 'lastReadMessageId' })
    lastReadMessage: Message;
}
