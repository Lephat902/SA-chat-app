import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export const ONLINE_STATUS_UPDATED_EVENT = 'user.online-status.updated';
export class OnlineStatusUpdatedEvent {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    isOnline: boolean;
}