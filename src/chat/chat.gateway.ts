import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/services';
import { AuthService } from 'src/auth/auth.service';
import { SocketUserMap } from './user-socket.map';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_ADDED_TO_GROUP_EVENT,
  USER_REMOVED_FROM_GROUP_EVENT,
  UserAddedToGroupEvent,
  UserRemovedFromGroupEvent,
  CONVERSATION_MESSAGE_ADDED,
  ConversationMessageAddedEvent,
  CONVERSATION_CREATED_EVENT,
  ConversationCreatedEvent,
  CONVERSATION_DELETED_EVENT,
  ConversationDeletedEvent,
  LAST_READ_MESSAGE_EVENT,
  LastReadMessageEvent,
  ONLINE_STATUS_UPDATED_EVENT,
  OnlineStatusUpdatedEvent,
} from 'src/events';
import { FriendService } from 'src/friend/services';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: ["null"],
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  // socket-client-id <-> system-user-id
  private readonly socketUserMap: SocketUserMap = new SocketUserMap();

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly friendService: FriendService,
  ) { }

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake?.query.token.toString();
    const payload = this.authService.verifyAccessToken(token);

    const user = payload && (await this.userService.findOneById(payload.id, true));

    // User not exist then destroy the connection
    if (!user) {
      client.disconnect(true);
      return;
    }

    this.socketUserMap.addConnection(client.id, user.id);

    const conversations = user?.conversations;
    if (conversations) {
      await client.join(conversations.map(conversation => conversation.id));
    }
    const newNumberOfSocketConnections = this.socketUserMap.getNumOfClientsByUserId(user.id);
    if (newNumberOfSocketConnections === 1)
      await this.userService.updateOnlineStatus(user.id, true);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.socketUserMap.getUserIdByClientId(client.id);
    this.socketUserMap.removeConnection(client.id);
    const newNumberOfSocketConnections = this.socketUserMap.getNumOfClientsByUserId(userId);
    if (newNumberOfSocketConnections === 0)
      await this.userService.updateOnlineStatus(userId, false);
  }

  @SubscribeMessage('friendsOnlineStatus')
  async getFriendsOnlineStatus(client: Socket, data: unknown) {
    const userId = this.socketUserMap.getUserIdByClientId(client.id);
    client.emit('friendsOnlineStatus', await this.friendService.findFriendsOnlineStatus(userId));
  }

  @OnEvent(ONLINE_STATUS_UPDATED_EVENT)
  async handleOnlineStatusUpdatedEvent(event: OnlineStatusUpdatedEvent) {
    const { userId } = event;
    const friendsList = await this.friendService.getFriends(userId);
    friendsList.forEach(friend => {
      const clients = this.socketUserMap.getSocketClientsByUserId(this.server, friend.id);
      clients.forEach(client => client.emit('isOnline', event));
    })
  }

  @OnEvent(CONVERSATION_MESSAGE_ADDED)
  async handleConversationMessageAddedEvent(event: ConversationMessageAddedEvent) {
    const { conversationId, text, userId, createdAt } = event;
    this.server.to(conversationId).emit('message', { userId, text, createdAt });
  }

  @OnEvent(USER_ADDED_TO_GROUP_EVENT)
  async handleUserAddedToGroupEvent(event: UserAddedToGroupEvent) {
    const { userId, conversationId } = event;
    const clients = this.socketUserMap.getSocketClientsByUserId(this.server, userId);
    await Promise.allSettled(clients.map(client => client.join(conversationId)));
    this.server.to(conversationId).emit('join', { userId });
  }

  @OnEvent(USER_REMOVED_FROM_GROUP_EVENT)
  async handleUserRemovedFromGroupEvent(event: UserRemovedFromGroupEvent) {
    const { conversationId, userId, isKicked } = event;
    const clients = this.socketUserMap.getSocketClientsByUserId(this.server, userId);
    await Promise.allSettled(clients.map(client => client.leave(conversationId)));
    this.server.to(conversationId).emit('leave', { userId, isKicked });
  }

  @OnEvent(CONVERSATION_CREATED_EVENT)
  async handleConversationCreatedEvent(event: ConversationCreatedEvent) {
    const { conversationId, membersIdsList } = event;
    const usersClients = membersIdsList.map(memberId =>
      this.socketUserMap.getSocketClientsByUserId(this.server, memberId)
    );

    await Promise.allSettled(usersClients.map(clients =>
      Promise.allSettled(clients.map(client => client.join(conversationId)))
    ));
  }

  @OnEvent(CONVERSATION_DELETED_EVENT)
  async handleConversationDeletedEvent(event: ConversationDeletedEvent) {
    const { conversationId, membersIdsList } = event;
    const usersClients = membersIdsList.map(memberId =>
      this.socketUserMap.getSocketClientsByUserId(this.server, memberId)
    );

    await Promise.allSettled(usersClients.map(clients =>
      Promise.allSettled(clients.map(client => client.leave(conversationId)))
    ));
  }

  @OnEvent(LAST_READ_MESSAGE_EVENT)
  async handleLastReadMessageEvent(event: LastReadMessageEvent) {
    const { conversationId, userId, lastReadMessageId } = event;
    this.server.to(conversationId).emit('lastReadMessage', { userId, lastReadMessageId });
  }
}
