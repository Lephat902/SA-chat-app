import WebSocket from "ws";

export function sendSocketEvent(clients: WebSocket[], eventName: string, eventData: unknown) {
    const message = JSON.stringify({
        event: eventName,
        data: eventData,
    });

    clients.forEach(client => client.send(message));
}
