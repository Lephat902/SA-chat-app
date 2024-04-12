import { IncomingMessage } from "http";

export function getTokenFromIncomingMessage(args: IncomingMessage) {
    const connectURL = args.url;
    const url = new URL('http://localhost' + connectURL); // Add a base URL to handle relative URLs correctly
    return url.searchParams.get('token');
}