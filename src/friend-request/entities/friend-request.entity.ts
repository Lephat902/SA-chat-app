import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Column,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities';

export enum RequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.sentFriendRequests)
    @JoinColumn({ name: 'requesterId' })
    requester: User;

    @ManyToOne(() => User, user => user.receivedFriendRequests)
    @JoinColumn({ name: 'recipientId' })
    recipient: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
    status: RequestStatus;

    @UpdateDateColumn()
    updatedAt: Date;
}
