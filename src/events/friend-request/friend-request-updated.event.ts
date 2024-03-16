import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { RequestStatus } from "src/friend-request/entities";

export const FRIEND_REQUEST_UPDATED_EVENT = 'friendRequest.updated';
export class FriendRequestUpdatedEvent {
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
    updatedAt: Date;

    @IsEnum(RequestStatus)
    newStatus: RequestStatus;
}