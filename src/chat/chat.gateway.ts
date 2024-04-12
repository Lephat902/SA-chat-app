import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
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
import { ConversationSocketsMap } from './conversation-sockets.map';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { getTokenFromIncomingMessage, sendSocketEvent } from './helpers';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: ["null", null, "https://html-classic.itch.zone"],
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly friendService: FriendService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    // user-id <-> [socket-client]
    private readonly userSocketsMap: UserSocketsMap,
    // conversation <-> [socket-client]
    private readonly conversationSocketsMap: ConversationSocketsMap,
  ) { }

  async handleConnection(client: WebSocket, args: IncomingMessage) {
    const token = getTokenFromIncomingMessage(args);
    await this.handleConnect(client, token);
  }

  private async handleConnect(client: WebSocket, token: string) {
    const payload = this.authService.verifyAccessToken(token);

    const userId: string = payload?.id;
    if (!userId) {
      console.log("This guy is not logged in, rejected");
      return;
    }
    // This user is authenticated
    this.userSocketsMap.addConnection(client, userId);
    const conversations = await this.conversationService.findAllConversationsByUserId(userId);
    if (conversations) {
      console.log(`This guy ${userId} has ${conversations.length} conversations`);
      conversations.map(conversation => {
        this.conversationSocketsMap.addClientsToConversation(conversation.id, client);
      })
    }
    const newNumberOfSocketConnections = this.userSocketsMap.getNumOfClientsByUserId(userId);
    if (newNumberOfSocketConnections === 1)
      await this.userService.updateOnlineStatus(userId, true);
  }

  async handleDisconnect(client: WebSocket) {
    // Get userId BEFORE removing
    const userId = this.userSocketsMap.getUserIdByClient(client);

    this.userSocketsMap.removeConnection(client);
    this.conversationSocketsMap.removeClient(client);

    if (userId) {
      const newNumberOfSocketConnections = this.userSocketsMap.getNumOfClientsByUserId(userId);
      if (newNumberOfSocketConnections === 0)
        await this.userService.updateOnlineStatus(userId, false);
    }
  }

  @AsyncApiPub({
    channel: 'ping',
    message: {
      payload: String
    },
    description: 'Used to check socket connection. Receive the same thing you sent to the server'
  })
  @SubscribeMessage('ping')
  handlePing(client: WebSocket, payload: unknown): void {
    console.log("I received the ping message", payload);
    client.send(JSON.stringify(payload));
  }

  @AsyncApiPub({
    channel: 'send-message',
    message: {
      payload: AddMessageDto
    },
    description: 'Publishes a message to be sent to a conversation.'
  })
  @SubscribeMessage('send-message')
  async addMessage(client: WebSocket, addMessageDto: AddMessageDto) {
    const userId = this.userSocketsMap.getUserIdByClient(client);
    console.log("I'm here", userId);
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
    const clientsInConversation = this.conversationSocketsMap.getClientsInConversation(conversationId);
    console.log(`There are currently ${clientsInConversation.length} online in conversation ${conversationId}. Send!`);
    sendSocketEvent(clientsInConversation, 'receive-message', event);
  }

  @AsyncApiPub({
    channel: 'mark-as-read',
    message: {
      payload: MarkMessageAsReadDto
    },
    description: 'Publishes an event to notify everyone in the conversation that you have read a message.'
  })
  @SubscribeMessage('mark-as-read')
  async markMessageAsRead(client: WebSocket, markMessageAsReadDto: MarkMessageAsReadDto) {
    // Prepare
    const userId = this.userSocketsMap.getUserIdByClient(client);
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
    const clientsInConversation = this.conversationSocketsMap.getClientsInConversation(conversationId);
    sendSocketEvent(clientsInConversation, 'last-read-message-updated', event);
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
      const clients = this.userSocketsMap.getSocketClientsByUserId(friend.id);
      sendSocketEvent(clients, 'is-online', event);
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
    const clients = this.userSocketsMap.getSocketClientsByUserId(userId);
    this.conversationSocketsMap.addClientsToConversation(conversationId, clients);
    const clientsInConversation = this.conversationSocketsMap.getClientsInConversation(conversationId);
    sendSocketEvent(clientsInConversation, 'join', event);
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
    const clients = this.userSocketsMap.getSocketClientsByUserId(userId);
    this.conversationSocketsMap.removeClientsFromConversation(conversationId, clients);
    const clientsInConversation = this.conversationSocketsMap.getClientsInConversation(conversationId);
    sendSocketEvent(clientsInConversation, 'leave', event);
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
      this.userSocketsMap.getSocketClientsByUserId(memberId)
    );

    for (const eachUserClients of usersClients)
      this.conversationSocketsMap.addClientsToConversation(conversationId, eachUserClients);

    const clientsInConversation = this.conversationSocketsMap.getClientsInConversation(conversationId);
    sendSocketEvent(clientsInConversation, 'conversation-created', event);
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
      this.userSocketsMap.getSocketClientsByUserId(memberId)
    );

    const clientsInConversation = this.conversationSocketsMap.getClientsInConversation(conversationId);
    sendSocketEvent(clientsInConversation, 'conversation-deleted', event);

    for (const eachUserClients of usersClients)
      this.conversationSocketsMap.removeClientsFromConversation(conversationId, eachUserClients);
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
    const recipientClients = this.userSocketsMap.getSocketClientsByUserId(recipientId);
    sendSocketEvent(recipientClients, 'friend-request-sent', event);
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
    const clients = this.userSocketsMap.getSocketClientsByUserId(userIdToNotify);
    sendSocketEvent(clients, 'friend-request-updated', event);
  }
}
