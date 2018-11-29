const WebSocket = require('ws');
const Player = require('./player');
const Messages = require('./messages_pb');

class Lobby {

    constructor(server, path) {
        this.server = new WebSocket.Server({server: server, path: path});
        this.server.on('connection', this.onConnection.bind(this));
        this.players = new Array();
        this.numPlayersReady = 0;
        this.playerReady();
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

    playerReady(){
        this.numPlayersReady++;
        //if(this.numPlayersReady == 10){
            let packet = new Messages.Packet();
            packet.setBodyType(Messages.BodyType.GAME_START);
            console.log(packet.getBodyType());
            this.broadcast(packet);
        //}
    }

    broadcast(packet) {
        this.players.forEach(player => {
            player.send(packet);
        });      
    }
}

module.exports = Lobby;