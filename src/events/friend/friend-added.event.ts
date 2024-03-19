export const USER_FRIEND_ADDED_EVENT = 'user.friend.added';
export class UserFriendAddedEvent {
    firstUserId: string;
    secondUserId: string;
}