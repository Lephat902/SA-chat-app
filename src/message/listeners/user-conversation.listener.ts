import { OnEvent } from '@nestjs/event-emitter';
import {
    CONVERSATION_CREATED_EVENT,
    CONVERSATION_MESSAGE_ADDED,
    ConversationCreatedEvent,
    ConversationMessageAddedEvent,
    USER_ADDED_TO_GROUP_EVENT,
    UserAddedToGroupEvent,
} from 'src/events';
import { Injectable } from '@nestjs/common';
import { MessageService } from '../services';

@Injectable()
export class UserConversationListener {
    constructor(
        private readonly messageService: MessageService,
    ) { }

    @OnEvent(USER_ADDED_TO_GROUP_EVENT)
    async handleUserAddedToGroupEvent(event: UserAddedToGroupEvent) {
        const { conversationId, userId } = event;
        await this.messageService.createUserConversationRecords(conversationId, [userId]);
    }

    @OnEvent(CONVERSATION_CREATED_EVENT)
    async handleConversationCreatedEvent(event: ConversationCreatedEvent) {
        const { conversationId, membersIdsList } = event;
        await this.messageService.createUserConversationRecords(conversationId, membersIdsList);
    }

    @OnEvent(CONVERSATION_MESSAGE_ADDED)
    async handleConversationMessageAddedEvent(event: ConversationMessageAddedEvent) {
        const { userId, id } = event;
        await this.messageService.markAsLastRead({
            userId,
            messageId: id,
        });
    }
}
