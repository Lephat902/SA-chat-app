import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { FriendModule } from 'src/friend/friend.module';
import { MessageModule } from 'src/message/message.module';
import { ConversationSocketsMap } from './conversation-sockets.map';
import { UserSocketsMap } from './user-sockets.map';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConversationModule,
    FriendModule,
    MessageModule,
  ],
  providers: [
    ChatGateway,
    UserSocketsMap,
    ConversationSocketsMap,
  ],
})
export class ChatModule { }
