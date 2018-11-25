const WebSocket = require('ws');
const Player = require('./player');

class Lobby {

    constructor(server, path) {
        this.server = new WebSocket.Server({server});
        this.players = new Array();
    }

    onConnection(ws) {
        console.log("player requesting a connection");
        if(this.players.length < 10) {
            let player = new Player(ws, lobby);
            let player_id = this.players.push(player);
            player.id = player_id;
        }
        else {
            ws.terminate();
        }
    }
}

module.exports = Lobby;