import { ApiProperty } from "@nestjs/swagger";

export const ONLINE_STATUS_UPDATED_EVENT = 'user.online-status.updated';
export class OnlineStatusUpdatedEvent {
    @ApiProperty({
        description: "The unique identifier of the user whose online status was updated",
        example: "a1b2c3d4"
    })
    userId: string;

    @ApiProperty({
        description: "Indicates whether the user is currently online or offline",
        example: true
    })
    isOnline: boolean;
}