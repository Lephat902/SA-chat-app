import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';

export class UpdateUserDto extends PickType(
    CreateUserDto,
    // Reuse avatar attribute
    ['avatar'] as const
) {
    @ApiProperty({
        description: 'Username',
        example: 'john_doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Length(5, 20, {
        message: 'Username must be between 5 and 20 characters long',
    })
    @Matches(/^\w+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
    })
    readonly username: string;

    @ApiProperty({
        description: 'Old user password, required when resetting password',
        example: 'old_password',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly oldPassword: string;

    @ApiProperty({
        description: 'New user password',
        example: 'new_password',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(5, {
        message: 'Password must be at least 5 characters long',
    })
    readonly newPassword: string;

    @ApiHideProperty()
    password: string;
}
