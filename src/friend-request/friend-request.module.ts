import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities';
import { FriendRequestController } from './controllers';
import { FriendRequestService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  providers: [FriendRequestService],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
