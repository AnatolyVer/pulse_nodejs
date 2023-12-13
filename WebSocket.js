import { WebSocketServer} from 'ws';
const EVENT_CONNECTION = 'connection';
const EVENT_MESSAGE = 'message';
const EVENT_CLOSE = 'close';

class WebSocketManager {

    wss
    clients
    rooms

    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.clients = {};
        this.rooms = {};

        this.wss.on(EVENT_CONNECTION, (socket, req) => this.onConnection(socket, req));
    }

    async onConnection(socket, req) {
        console.log('Connection is opened');
        const userID = this.parseRequestParameters(req.url.substr(1));

        socket.on(EVENT_MESSAGE, async (message) => {
            const { type, payload } = JSON.parse(message)
            const { projectId, id, data } = payload;
            try {
                switch (type) {

                }
            } catch (e) {
                console.error(e);
            }

            this.sendMessageToRoom(socket, projectId, JSON.stringify({ type, payload }));
        });

        socket.on(EVENT_CLOSE, () => {
            this.closeSocket(socket);
        });
    }

    parseRequestParameters(url){
        const [, id] = url.split('&')[0].split('=');
        return id;
    }

    addClientToRoom(clientId, roomName) {
        if (!this.rooms.hasOwnProperty(roomName)) {
            this.rooms[roomName] = new Set();
        }
        this.rooms[roomName].add(clientId);
    }

    getClientIDBySocket(socket){
        for (const id in this.clients) {
            if (this.clients.hasOwnProperty(id) && this.clients[id].socket === socket) {
                return id;
            }
        }
        return undefined;
    }

    sendMessageToRoom(socket, projectId, message) {
        if (this.rooms.hasOwnProperty(projectId)) {
            this.rooms[projectId].forEach((clientID) => {
                const client = this.clients[clientID];
                if (client && client.socket !== socket) {
                    client.socket.send(message);
                }
            });
        }
    }

    removeClientFromRoom(clientId, roomName) {
        const room = this.rooms[roomName];
        if (room) {
            room.delete(clientId);
            if (room.size === 0) {
                delete this.rooms[roomName];
            }
        }
    }

    closeSocket(socket) {
        for (const key in this.clients) {
            if (this.clients[key].socket === socket) {
                const rooms = this.clients[key].rooms;
                rooms.forEach((room) => this.removeClientFromRoom(key, room));
                delete this.clients[key];
                console.log('Connection is closed');
                return;
            }
        }
    }
}

export default WebSocketManager;
