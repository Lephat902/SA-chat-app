import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from '../dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Builder } from 'builder-pattern';
import { ONLINE_STATUS_UPDATED_EVENT, OnlineStatusUpdatedEvent } from 'src/events';
import { PaginatedResults } from 'src/common';
import { comparePassword, hashPassword } from 'src/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async getAllUsersAndTotalCount(queryUserDto: QueryUserDto): Promise<PaginatedResults<User>> {
    const { q, page = 1, limit = 10 } = queryUserDto;

    // Create a query builder
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Filter by username if q is provided
    if (q) {
      queryBuilder.where('user.username LIKE :q', { q: `%${q}%` });
    }

    // Calculate offsets for pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return { results, totalCount };
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return user;
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async create(createUserDto: Readonly<CreateUserDto>) {
    const user = this.userRepository.create({
      ...createUserDto,
      ...(!createUserDto.avatar && { avatar: `https://robohash.org/${createUserDto.username}.png` })
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: Readonly<UpdateUserDto>) {
    const validatedUpdateUserDto = await this.validateUpdateUserDto(id, updateUserDto);
    const dataToUpdate = this.userRepository.create(validatedUpdateUserDto);
    return this.userRepository.update(id, dataToUpdate);
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

  private async validateUpdateUserDto(id: string, updateUserDto: Readonly<UpdateUserDto>) {
    const clonedUpdateUserDto = { ...updateUserDto };
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    if (clonedUpdateUserDto.username) {
      const existingUser = await this.findOneByUsername(clonedUpdateUserDto.username);
      if (existingUser) {
        throw new BadRequestException('Username exists');
      }
    }

    if (clonedUpdateUserDto.newPassword) {
      const passwordMatches = await comparePassword(clonedUpdateUserDto.oldPassword, user.password);
      if (!passwordMatches) {
        throw new BadRequestException('Password mismatches');
      }
      clonedUpdateUserDto.password = await hashPassword(clonedUpdateUserDto.newPassword);
    }

    return clonedUpdateUserDto;
  }
}
