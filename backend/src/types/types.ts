import WebSocket from "ws";

export interface CustomWebsocket extends WebSocket {
    roomId: string
}

export interface Question {
    id: string;
    text: string;
    correctIndex: number;
    options: {
        imageUrl: string | null;
        text: string;
        index: number;
    }[];
}[]

