import { Server, Socket } from "socket.io";

export class SocketUserMap {
    // Maps socket client ID to system user ID
    clientIdToUserId: Map<string, string> = new Map();

    // Maps system user ID to socket client ID
    userIdToClientId: Map<string, string> = new Map();

    // Example method to add a connection
    addConnection(clientId: string, userId: string) {
        this.clientIdToUserId.set(clientId, userId);
        this.userIdToClientId.set(userId, clientId);
    }

    // Example method to remove a connection
    removeConnection(clientId: string) {
        const userId = this.clientIdToUserId.get(clientId);
        if (userId) {
            this.userIdToClientId.delete(userId);
            this.clientIdToUserId.delete(clientId);
        }
    }

    // Get Socket by User ID
    getSocketClientByUserId(server: Server, userId: string): Socket | null {
        const clientId = this.userIdToClientId.get(userId);
        if (clientId) {
            return server.sockets.sockets.get(clientId);
        }
        return null;
    }

    // Optionally, get User ID by Socket Client ID
    getUserIdByClientId(clientId: string): string | null {
        return this.clientIdToUserId.get(clientId) || null;
    }
}