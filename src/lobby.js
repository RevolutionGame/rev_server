const WebSocket = require('ws');
const Player = require('./player');

class Lobby {

    constructor(server, path) {
        this.server = new WebSocket.Server({server: server, path: path});
        this.server.on('connection', this.onConnection.bind(this));
        this.players = new Array();
    }

    onConnection(ws, req) {
        console.log("player requesting a connection");
        console.log(`player IP ${req.connection.remoteAddress}`);
        if(this.players.length < 10) {
            let player = new Player(ws, this);
            let player_id = this.players.push(player);
            player.id = player_id;
        }
        else {
            ws.terminate();
        }
    }
}

module.exports = Lobby;