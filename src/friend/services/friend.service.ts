import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities';
import { Friend } from '../entities/friend.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_FRIEND_ADDED_EVENT, USER_FRIEND_REMOVED_EVENT, UserFriendAddedEvent, UserFriendRemovedEvent } from 'src/events';
import { Builder } from 'builder-pattern';

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(Friend) private readonly friendRepository: Repository<Friend>,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async getFriends(userId: string): Promise<User[]> {
        const friends = await this.friendRepository.find({
            where: [
                { user1: { id: userId } },
                { user2: { id: userId } }
            ],
            relations: ['user1', 'user2'],
        });

        // Map and return the corresponding friend User entities
        return friends.map(friend => friend.user1.id === userId ? friend.user2 : friend.user1);
    }

    async addFriend(firstUserId: string, secondUserId: string): Promise<void> {
        // Check if the friendship already exists
        const existingFriendship = await this.friendRepository.findOne({
            where: [
                { user1: { id: firstUserId }, user2: { id: secondUserId } },
                { user1: { id: secondUserId }, user2: { id: firstUserId } },
            ],
        });

        if (existingFriendship) {
            throw new BadRequestException('Friend already added');
        }

        // Create new friendship
        const newFriendship = this.friendRepository.create({
            user1: { id: firstUserId },
            user2: { id: secondUserId },
        });

        await this.friendRepository.save(newFriendship);

        // Emit friend added event
        this.eventEmitter.emit(
            USER_FRIEND_ADDED_EVENT,
            Builder<UserFriendAddedEvent>()
                .firstUserId(firstUserId)
                .secondUserId(secondUserId)
                .build()
        );
    }

    async removeFriend(firstUserId: string, secondUserId: string): Promise<void> {
        const friendship = await this.friendRepository.findOne({
            where: [
                { user1: { id: firstUserId }, user2: { id: secondUserId } },
                { user1: { id: secondUserId }, user2: { id: firstUserId } },
            ],
        });

        if (!friendship) {
            throw new NotFoundException('Friendship not found');
        }

        await this.friendRepository.remove(friendship);

        // Emit friend removed event
        this.eventEmitter.emit(
            USER_FRIEND_REMOVED_EVENT,
            Builder<UserFriendRemovedEvent>()
                .firstUserId(firstUserId)
                .secondUserId(secondUserId)
                .build()
        );
    }
}
