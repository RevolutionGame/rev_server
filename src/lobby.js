const WebSocket = require('ws');
const Player = require('./player');

class Lobby {

    constructor(server, path) {
        this.server = new WebSocket.Server({server: server, path: path});
        this.players = new Array();
    }

    onConnection(ws) {
        if(this.players.length < 10) {
            let player = new Player(ws);
            let player_id = this.players.push(player);
            player.id = player_id;
        }
        else {
            ws.terminate();
        }
    }
}

module.exports = Lobby;