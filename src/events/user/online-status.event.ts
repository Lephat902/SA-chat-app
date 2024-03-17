import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export const ONLINE_STATUS_UPDATED_EVENT = 'user.online-status.updated';
export class OnlineStatusUpdatedEvent {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsBoolean()
    @IsNotEmpty()
    isOnline: boolean;
}