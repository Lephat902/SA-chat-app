import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Builder } from 'builder-pattern';
import { ONLINE_STATUS_UPDATED_EVENT, OnlineStatusUpdatedEvent } from 'src/events';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async findOneById(id: string, withConversations: boolean = false): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      ...(withConversations && { relations: ['conversations'] }),
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return user;
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return this.userRepository.save(user);
  }

  async updateOnlineStatus(id: string, isOnline: boolean) {
    const res = await this.userRepository.update(id, { isOnline });
    this.emitOnlineStatusUpdatedEvent(id, isOnline);
    return res;
  }

  private emitOnlineStatusUpdatedEvent(id: string, isOnline: boolean) {
    const eventPayload = Builder<OnlineStatusUpdatedEvent>()
      .userId(id)
      .isOnline(isOnline)
      .build();
    this.eventEmitter.emit(
      ONLINE_STATUS_UPDATED_EVENT,
      eventPayload
    );
  }
}
