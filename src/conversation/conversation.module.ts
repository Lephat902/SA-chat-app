import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Conversation, DirectConversation, GroupConversation } from './entities';
import { ConversationController, GroupConversationController } from './controllers';
import { ConversationService } from './services';
import { ConversationListener } from './listeners';
import { GroupConversationService } from './services/group-conversation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      DirectConversation,
      GroupConversation,
    ]),
    UserModule,
  ],
  controllers: [
    ConversationController,
    GroupConversationController,
  ],
  providers: [
    ConversationService,
    GroupConversationService,
    ConversationListener,
  ],
  exports: [ConversationService],
})
export class ConversationModule { }
