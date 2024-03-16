import { IsDate, IsNotEmpty, IsString } from "class-validator";

export const FRIEND_REQUEST_CREATED_EVENT = 'friendRequest.created';
export class FriendRequestCreatedEvent {
    @IsString()
    @IsNotEmpty()
    requestId: string;

    @IsString()
    @IsNotEmpty()
    requesterId: string;

    @IsString()
    @IsNotEmpty()
    recipientId: string;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;
}