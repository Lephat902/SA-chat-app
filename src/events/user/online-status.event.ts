import { ApiProperty } from "@nestjs/swagger";

export const ONLINE_STATUS_UPDATED_EVENT = 'user.online-status.updated';
export class OnlineStatusUpdatedEvent {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    isOnline: boolean;
}