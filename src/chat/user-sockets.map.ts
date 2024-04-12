import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

@Injectable()
export class UserSocketsMap {
    // Maps socket client to system user ID
    clientToUserId: Map<WebSocket, string> = new Map();

    // Maps system user ID to a set of socket clients
    userIdToClients: Map<string, Set<WebSocket>> = new Map();

    // Example method to add a connection
    addConnection(client: WebSocket, userId: string) {
        this.clientToUserId.set(client, userId);
        if (!this.userIdToClients.has(userId)) {
            this.userIdToClients.set(userId, new Set());
        }
        this.userIdToClients.get(userId)?.add(client);
    }

    // Example method to remove a connection
    removeConnection(client: WebSocket) {
        const userId = this.clientToUserId.get(client);
        if (userId) {
            this.userIdToClients.get(userId)?.delete(client);
            if (this.getNumOfClientsByUserId(userId) === 0) {
                this.userIdToClients.delete(userId);
            }
            this.clientToUserId.delete(client);
        }
    }

    // Get Sockets by User ID
    getSocketClientsByUserId(userId: string): WebSocket[] {
        const sockets: Set<WebSocket> = this.userIdToClients.get(userId) ?? new Set();
        return Array.from(sockets);
    }

    // Optionally, get User ID by Socket Client ID
    getUserIdByClient(client: WebSocket): string | null {
        return this.clientToUserId.get(client) || null;
    }

    getNumOfClientsByUserId(userId: string): number {
        const numberOfClients = this.userIdToClients.get(userId)?.size;
        return numberOfClients ?? 0;
    }
}