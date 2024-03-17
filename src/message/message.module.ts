import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Message, UserConversation } from './entities';
import { MessageController } from './controllers';
import { MessageService } from './services';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UserConversationListener } from './listeners';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, UserConversation]),
    UserModule,
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, UserConversationListener],
})
export class MessageModule { }
