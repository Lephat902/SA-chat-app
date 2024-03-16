import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities';
import { FriendService } from './services';
import { FriendController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule { }
