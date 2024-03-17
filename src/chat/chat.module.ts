import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConversationModule,
    FriendModule,
  ],
  providers: [ChatGateway],
})
export class ChatModule { }
