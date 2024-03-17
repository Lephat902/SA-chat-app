import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities';
import { FriendService } from './services';
import { FriendController } from './controllers';
import { FriendListener } from './listeners';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  providers: [FriendService, FriendListener],
  controllers: [FriendController],
  exports: [FriendService],
})
export class FriendModule { }
