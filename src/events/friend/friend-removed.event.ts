export const USER_FRIEND_REMOVED_EVENT = 'user.friend.removed';
export class UserFriendRemovedEvent {
    firstUserId: string;
    secondUserId: string;
}