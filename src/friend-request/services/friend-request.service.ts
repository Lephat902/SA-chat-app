import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FriendRequest, RequestStatus } from '../entities/friend-request.entity';
import { FRIEND_REQUEST_CREATED_EVENT, FRIEND_REQUEST_UPDATED_EVENT, FriendRequestCreatedEvent, FriendRequestUpdatedEvent } from 'src/events/friend-request';
import { Builder } from 'builder-pattern';

const ERROR_SELF_REQUEST = 'You cannot send a friend request to yourself.';
const ERROR_EXISTING_REQUEST = 'A friend request already exists between these users.';
const ERROR_REQUEST_NOT_FOUND = 'Friend request not found.';

@Injectable()
export class FriendRequestService {
    constructor(
        @InjectRepository(FriendRequest) private readonly friendRequestRepository: Repository<FriendRequest>,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async getMySentRequests(userId: string) {
        return this.friendRequestRepository.find({
            where: { requester: { id: userId }, status: RequestStatus.PENDING },
        });
    }

    async getMyReceivedRequests(userId: string) {
        return this.friendRequestRepository.find({
            where: { recipient: { id: userId }, status: RequestStatus.PENDING },
        });
    }

    async makeFriendRequest(requesterId: string, recipientId: string) {
        if (requesterId === recipientId) {
            throw new BadRequestException(ERROR_SELF_REQUEST);
        }

        const existingRequest = await this.friendRequestRepository.findOne({
            where: [
                { requester: { id: requesterId }, recipient: { id: recipientId }, status: RequestStatus.PENDING },
                { requester: { id: recipientId }, recipient: { id: requesterId }, status: RequestStatus.PENDING },
            ],
        });

        if (existingRequest) {
            throw new BadRequestException(ERROR_EXISTING_REQUEST);
        }

        const newRequestData = this.friendRequestRepository.create({
            requester: { id: requesterId },
            recipient: { id: recipientId },
        });

        const newRequest = await this.friendRequestRepository.save(newRequestData);
        this.eventEmitter.emit(
            FRIEND_REQUEST_CREATED_EVENT,
            Builder<FriendRequestCreatedEvent>()
                .requestId(newRequest.id)
                .requesterId(requesterId)
                .recipientId(recipientId)
                .createdAt(newRequest.createdAt)
                .build()
        );

        return newRequest;
    }

    async acceptFriendRequest(userId: string, requestId: string) {
        return this.updateFriendRequestStatusByRecipient(userId, 'recipient', requestId, RequestStatus.ACCEPTED);
    }

    async rejectFriendRequest(userId: string, requestId: string) {
        return this.updateFriendRequestStatusByRecipient(userId, 'recipient', requestId, RequestStatus.REJECTED);
    }

    async cancelFriendRequest(userId: string, requestId: string) {
        return this.updateFriendRequestStatusByRecipient(userId, 'requester', requestId, RequestStatus.CANCELLED);
    }

    private async updateFriendRequestStatusByRecipient(
        userId: string,
        actorType: 'requester' | 'recipient',
        requestId: string,
        status: RequestStatus
    ) {
        const request = await this.friendRequestRepository.findOne({
            where: {
                id: requestId,
                [actorType]: { id: userId }, // Ensuring that only the <actorType> can manipulate with the request
                status: RequestStatus.PENDING,
            },
        });

        if (!request) {
            throw new NotFoundException(ERROR_REQUEST_NOT_FOUND);
        }

        request.status = status;
        const updatedRequest = await this.friendRequestRepository.save(request);

        this.eventEmitter.emit(
            FRIEND_REQUEST_UPDATED_EVENT,
            Builder<FriendRequestUpdatedEvent>()
                .requestId(requestId)
                .requesterId(updatedRequest.requester.id)
                .recipientId(updatedRequest.recipient.id)
                .updatedAt(updatedRequest.updatedAt)
                .newStatus(updatedRequest.status)
                .build()
        );

        return updatedRequest;
    }
}