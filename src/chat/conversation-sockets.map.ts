import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

@Injectable()
export class ConversationSocketsMap {
    private readonly conversationClientsMap = new Map<string, WebSocket[]>();

    private getClients(conversationId: string): WebSocket[] {
        if (!this.conversationClientsMap.has(conversationId)) {
            this.conversationClientsMap.set(conversationId, []);
        }
        return this.conversationClientsMap.get(conversationId);
    }

    addClientsToConversation(conversationId: string, clientsToAdd: WebSocket | WebSocket[]) {
        const clients = this.getClients(conversationId);
        const newClients = Array.isArray(clientsToAdd) ? clientsToAdd : [clientsToAdd];
        clients.push(...newClients);
    }

    removeClientsFromConversation(conversationId: string, clientsToDelete: WebSocket | WebSocket[]) {
        const clients = this.getClients(conversationId);
        const clientsToRemove = Array.isArray(clientsToDelete) ? clientsToDelete : [clientsToDelete];
        this.conversationClientsMap.set(conversationId, clients.filter(client => !clientsToRemove.includes(client)));
    }

    removeClient(client: WebSocket) {
        this.conversationClientsMap.forEach((clients, conversationId) => {
            const index = clients.indexOf(client);
            if (index !== -1) {
                clients.splice(index, 1);
                if (clients.length === 0) {
                    this.conversationClientsMap.delete(conversationId);
                }
            }
        });
    }

    getClientsInConversation(conversationId: string): WebSocket[] | undefined {
        return this.conversationClientsMap.get(conversationId);
    }
}