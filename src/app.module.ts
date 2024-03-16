import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConversationModule } from './conversation/conversation.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FriendModule } from './friend/friend.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('DATABASE_TYPE'),
        url: configService.get('DATABASE_URI'),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    ChatModule,
    AuthModule,
    ConversationModule,
    FriendModule,
    FriendRequestModule,
    MessageModule,
    UserModule,
  ],
})
export class AppModule { }
