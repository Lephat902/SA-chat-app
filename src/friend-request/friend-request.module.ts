import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities';
import { FriendRequestController } from './controllers';
import { FriendRequestService } from './services';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest]),
    FriendModule,
  ],
  providers: [FriendRequestService],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
