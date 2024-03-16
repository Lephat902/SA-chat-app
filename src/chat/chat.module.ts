import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';

import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [UserModule, AuthModule, ConversationModule],
  providers: [ChatGateway],
})
export class ChatModule {}
