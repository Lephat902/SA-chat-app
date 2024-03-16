import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Message } from './entities';
import { MessageController } from './controllers';
import { MessageService } from './services';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    UserModule,
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule { }
