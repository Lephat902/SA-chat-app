
  

<p  align="center">

<a  href="http://nestjs.com/"  target="blank"><img  src="https://nestjs.com/img/logo_text.svg"  width="320"  alt="Nest Logo"  /></a>

</p>

  

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

  

<p  align="center">A progressive <a  href="http://nodejs.org"  target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

  

# Websockets chat

A real-time chat application built with NestJS, leveraging WebSocket for real-time bi-directional communication.

## Table of Contents  
- [Overview](#overview) 
- [Architecture](#architecture) 
- [Features](#features) 
- [Installation](#installation) 
- [Running the App](#running-the-app) 

## Overview

This project is a chat application built with Websockets. It follows a monolithic and event-driven architecture, adhering to the Single Responsibility Principle. This means each method in our system does exactly what its name suggests.

## Architecture

### Monolithic + Event-Driven

Our system is monolithic in nature. The event-driven aspect comes into play as we adhere to the  **Single Responsibility Principle**. For example, when a friend request is accepted, we only update the request’s status to  `ACCEPTED`:
```typescript
async acceptFriendRequest(userId: string, requestId: string) {
	return this.updateFriendRequestStatus(userId, 'recipient', requestId, RequestStatus.ACCEPTED);
}

private async updateFriendRequestStatus(
	userId: string,
	actorType: 'requester' | 'recipient',
	requestId: string,
	status: RequestStatus
) {
	// ....
	// Code to prepare and validate
	// ....
	
	request.status = status;
	const updatedRequest = await this.friendRequestRepository.save(request);
	
	this.eventEmitter.emit(
		FRIEND_REQUEST_UPDATED_EVENT,
		Builder<FriendRequestUpdatedEvent>()
			.requestId(requestId)
			.requesterId(updatedRequest.requester.id)
			.recipientId(updatedRequest.recipient.id)
			.updatedAt(updatedRequest.updatedAt)
			.newStatus(updatedRequest.status)
			.build()
	);
	
	return updatedRequest;
}
```


The  `acceptFriendRequest`  method only updates the new state. The  `addFriend`  part is handled by another piece of code that listens to the  `FRIEND_REQUEST_UPDATED_EVENT`  event.

```typescript
@OnEvent(FRIEND_REQUEST_UPDATED_EVENT)
async handleUserFriendAddedEvent(event: FriendRequestUpdatedEvent) {
	const { requesterId, recipientId, newStatus } = event;
	if (newStatus === RequestStatus.ACCEPTED) {
		await this.friendService.addFriend(requesterId, recipientId);
	}
}
 ```


Our Websocket gateway operates in a similar manner:

```typescript
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@OnEvent(CONVERSATION_MESSAGE_ADDED)
	async handleConversationMessageAddedEvent(event: ConversationMessageAddedEvent) {
		const { conversationId, text, userId, createdAt } = event;
		this.server.to(conversationId).emit('message', { userId, text, createdAt });
	}
}
```


For the entire socket gateway, we don’t allow clients to make changes through it. Instead, they make changes via the traditional HTTP REST API. We handle the events on the gateway and send them back to connected clients.

## Features
- PassportJS/JWT auth

- Conversations

	- Direct conversation (1-1): automatically created when friendship established

	- Group conversation: can be created and deleted at anytime

		- Add/Delete a member

		- Leave a group

- Friend

	- Send a friend request

	- Accept/Reject a friend request

	- Cancel a friend request

- Message:

	- Send a message

	- Mark a message as read

 - Real-time state changes update for: online status, new message, user added to / removed from group, conversation created/removed, message read,...

## Installation
```bash
$  npm  ci
```

## Running the app
To start the app, first start the docker containers:
```bash
$ docker-compose up
```
Then, you can start the application.
