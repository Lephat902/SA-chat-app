import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/services';
import { AuthService } from 'src/auth/auth.service';
import { UserSocketsMap } from './user-sockets.map';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_ADDED_TO_GROUP_EVENT,
  USER_REMOVED_FROM_GROUP_EVENT,
  UserAddedToGroupEvent,
  UserRemovedFromGroupEvent,
  CONVERSATION_CREATED_EVENT,
  ConversationCreatedEvent,
  CONVERSATION_DELETED_EVENT,
  ConversationDeletedEvent,
  LAST_READ_MESSAGE_UPDATED_EVENT,
  LastReadMessageUpdatedEvent,
  ONLINE_STATUS_UPDATED_EVENT,
  OnlineStatusUpdatedEvent,
  ConversationMessageAddedEvent,
  CONVERSATION_MESSAGE_ADDED,
  FRIEND_REQUEST_CREATED_EVENT,
  FriendRequestCreatedEvent,
  FRIEND_REQUEST_UPDATED_EVENT,
  FriendRequestUpdatedEvent,
} from 'src/events';
import { FriendService } from 'src/friend/services';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { AddMessageDto, MarkMessageAsReadDto } from 'src/message/dtos';
import { MessageService } from 'src/message/services';
import { RequestStatus } from 'src/friend-request/entities';
import { ConversationService } from 'src/conversation/services';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: ["null", null, "https://html-classic.itch.zone"],
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  // system-user-id <-> [socket-client-id]
  private readonly userSocketsMap: UserSocketsMap = new UserSocketsMap();

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly friendService: FriendService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) { }

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake?.query.token.toString();
    const payload = this.authService.verifyAccessToken(token);

    const userId: string = payload.id;
    const conversations = await this.conversationService.findAllConversationsByUserId(userId);

    this.userSocketsMap.addConnection(client.id, userId);

    if (conversations) {
      await client.join(conversations.map(conversation => conversation.id));
    }
    const newNumberOfSocketConnections = this.userSocketsMap.getNumOfClientsByUserId(userId);
    if (newNumberOfSocketConnections === 1)
      await this.userService.updateOnlineStatus(userId, true);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.userSocketsMap.getUserIdByClientId(client.id);
    this.userSocketsMap.removeConnection(client.id);
    const newNumberOfSocketConnections = this.userSocketsMap.getNumOfClientsByUserId(userId);
    if (newNumberOfSocketConnections === 0)
      await this.userService.updateOnlineStatus(userId, false);
  }

  @AsyncApiPub({
    channel: 'ping',
    message: {
      payload: String
    },
    description: 'Used to check socket connection. Receive the same thing you sent to the server'
  })
  @SubscribeMessage('ping')
  async ping(@MessageBody() data: unknown) {
    return data;
  }

  @AsyncApiPub({
    channel: 'send-message',
    message: {
      payload: AddMessageDto
    },
    description: 'Publishes a message to be sent to a conversation.'
  })
  @SubscribeMessage('send-message')
  async addMessage(client: Socket, addMessageDto: AddMessageDto) {
    const userId = this.userSocketsMap.getUserIdByClientId(client.id);
    addMessageDto.userId = userId;
    await this.messageService.addMessage(addMessageDto);
  }

  @AsyncApiSub({
    channel: 'receive-message',
    message: {
      payload: ConversationMessageAddedEvent
    },
    description: 'Subscribes to receive messages sent to a conversation involving YOU.'
  })
  @OnEvent(CONVERSATION_MESSAGE_ADDED)
  async handleConversationMessageAddedEvent(event: ConversationMessageAddedEvent) {
    const { conversationId } = event;
    this.server.to(conversationId).emit('receive-message', event);
  }

  @AsyncApiPub({
    channel: 'mark-as-read',
    message: {
      payload: MarkMessageAsReadDto
    },
    description: 'Publishes an event to notify everyone in the conversation that you have read a message.'
  })
  @SubscribeMessage('mark-as-read')
  async markMessageAsRead(client: Socket, markMessageAsReadDto: MarkMessageAsReadDto) {
    // Prepare
    const userId = this.userSocketsMap.getUserIdByClientId(client.id);
    markMessageAsReadDto.userId = userId;
    // Save changes
    await this.messageService.markAsLastRead(markMessageAsReadDto);
  }

  @AsyncApiSub({
    channel: 'last-read-message-updated',
    message: {
      payload: LastReadMessageUpdatedEvent
    },
    description: 'Subscribes to receive events when the last read message of a person in YOUR conversation is updated.'
  })
  @OnEvent(LAST_READ_MESSAGE_UPDATED_EVENT)
  async handleLastReadMessageUpdatedEvent(event: LastReadMessageUpdatedEvent) {
    const { conversationId } = event;
    this.server.to(conversationId).emit('last-read-message-updated', event);
  }

  @AsyncApiSub({
    channel: 'is-online',
    message: {
      payload: OnlineStatusUpdatedEvent
    },
    description: 'Subscribes to receive events when a FRIEND\'s online status is updated.'
  })
  @OnEvent(ONLINE_STATUS_UPDATED_EVENT)
  async handleOnlineStatusUpdatedEvent(event: OnlineStatusUpdatedEvent) {
    const { userId } = event;
    const friendsList = await this.friendService.getFriends(userId);
    friendsList.forEach(friend => {
      const clients = this.userSocketsMap.getSocketClientsByUserId(this.server, friend.id);
      clients.forEach(client => client.emit('is-online', event));
    })
  }

  @AsyncApiSub({
    channel: 'join',
    message: {
      payload: UserAddedToGroupEvent
    },
    description: 'Subscribes to receive events when a user joins a group conversation involving YOU.'
  })
  @OnEvent(USER_ADDED_TO_GROUP_EVENT)
  async handleUserAddedToGroupEvent(event: UserAddedToGroupEvent) {
    const { userId, conversationId } = event;
    const clients = this.userSocketsMap.getSocketClientsByUserId(this.server, userId);
    await Promise.allSettled(clients.map(client => client.join(conversationId)));
    this.server.to(conversationId).emit('join', event);
  }

  @AsyncApiSub({
    channel: 'leave',
    message: {
      payload: UserRemovedFromGroupEvent
    },
    description: 'Subscribes to receive events when a user leaves a group conversation involving YOU.'
  })
  @OnEvent(USER_REMOVED_FROM_GROUP_EVENT)
  async handleUserRemovedFromGroupEvent(event: UserRemovedFromGroupEvent) {
    const { conversationId, userId } = event;
    const clients = this.userSocketsMap.getSocketClientsByUserId(this.server, userId);
    await Promise.allSettled(clients.map(client => client.leave(conversationId)));
    this.server.to(conversationId).emit('leave', event);
  }

  @AsyncApiSub({
    channel: 'conversation-created',
    message: {
      payload: ConversationCreatedEvent
    },
    description: 'Subscribes to receive events when a conversation involving YOU is created.'
  })
  @OnEvent(CONVERSATION_CREATED_EVENT)
  async handleConversationCreatedEvent(event: ConversationCreatedEvent) {
    const { conversationId, membersIdsList } = event;
    const usersClients = membersIdsList.map(memberId =>
      this.userSocketsMap.getSocketClientsByUserId(this.server, memberId)
    );

    await Promise.allSettled(usersClients.map(clients =>
      Promise.allSettled(clients.map(client => client.join(conversationId)))
    ));

    this.server.to(conversationId).emit('conversation-created', event);
  }

  @AsyncApiSub({
    channel: 'conversation-deleted',
    message: {
      payload: ConversationDeletedEvent
    },
    description: 'Subscribes to receive events when one of YOUR conversation is deleted.'
  })
  @OnEvent(CONVERSATION_DELETED_EVENT)
  async handleConversationDeletedEvent(event: ConversationDeletedEvent) {
    const { conversationId, membersIdsList } = event;
    const usersClients = membersIdsList.map(memberId =>
      this.userSocketsMap.getSocketClientsByUserId(this.server, memberId)
    );

    // Emit event before leaving conversation
    this.server.to(conversationId).emit('conversation-deleted', event);

    await Promise.allSettled(usersClients.map(clients =>
      Promise.allSettled(clients.map(client => client.leave(conversationId)))
    ));
  }

  @AsyncApiSub({
    channel: 'friend-request-sent',
    message: {
      payload: FriendRequestCreatedEvent
    },
    description: 'Subscribes to receive events when a friend request is sent.'
  })
  @OnEvent(FRIEND_REQUEST_CREATED_EVENT)
  async handleFriendRequestCreatedEvent(event: FriendRequestCreatedEvent) {
    const { recipientId } = event;
    const recipientClient = this.userSocketsMap.getSocketClientsByUserId(this.server, recipientId);
    recipientClient.forEach(client => client.emit('friend-request-sent', event));
  }

  @AsyncApiSub({
    channel: 'friend-request-updated',
    message: {
      payload: FriendRequestUpdatedEvent
    },
    description: 'Subscribes to receive events when the status of a friend request is updated.'
  })
  @OnEvent(FRIEND_REQUEST_UPDATED_EVENT)
  async handleFriendRequestUpdatedEvent(event: FriendRequestUpdatedEvent) {
    const { requesterId, recipientId, newStatus } = event;
    const userIdToNotify = newStatus === RequestStatus.CANCELLED ? recipientId : requesterId;
    const clients = this.userSocketsMap.getSocketClientsByUserId(this.server, userIdToNotify);
    clients.forEach(client => client.emit('friend-request-updated', event));
  }
}
