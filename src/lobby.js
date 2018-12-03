const WebSocket = require('ws');
const Player = require('./player');
const Messages = require('./messages_pb');

class Lobby {

    constructor(server, path) {
        this.server = new WebSocket.Server({server: server});
        this.server.on('connection', this.onConnection.bind(this));
        this.players = new Array();

        this.maxPlayers = 2;

        this.asteroids = new Array();
        this.nextAsteroidId = 0;
        this.numPlayersReady = 0;
        this.playerReady();
    }

    onConnection(ws, req) {
        console.log("player requesting a connection");
        console.log(`player IP ${req.connection.remoteAddress}`);
        let player = new Player(ws, this);
    }

    onSlotRequest(player, packet){
        if(this.players.length < this.maxPlayers) {
            let player_id = this.players.push(player);
            player.id = player_id;

            packet.getPlayerInfo().setId(player_id);
            this.playerJoin(packet.getPlayerInfo());
        }
        else {
            player.socket.terminate();
        }
    }

    playerJoin(playerInfo){
        let packet = new Messages.Packet();
        packet.setBodyType(Messages.BodyType.PLAYER_JOIN);
        packet.setPlayerInfo(playerInfo);
        this.broadcast(packet.serializeBinary);
    }

    playerReady(){
        this.numPlayersReady++;
        if(this.numPlayersReady == this.maxPlayers){
            let packet = new Messages.Packet();
            packet.setBodyType(Messages.BodyType.GAME_START);
            console.log(packet.getBodyType());
            this.broadcast(packet.serializeBinary());
            this.beginGame();
        }
    }

    broadcast(packet) {
        this.players.forEach(player => {
            player.send(packet);
        });      
    }

    beginGame(){
        setTimeout(this.startDataSending, 5000);
    }

    startDataSending(){
        var numDataSends = {num:0};
        var theInterval = setInterval(function(){sendData(numDataSends);}, 2000);
    }

    sendData(numDataSends){
        //numDataSends.num++;
        //if(numDataSends.num % 200 === 0){
            generateAsteroids();
        //}

        let sendingData = new Messages.WorldInfo();
        sendingData.setObjects(this.asteroids);

        let sendingPacket = new Messages.Packet();
        sendingPacket.setBodyType(Messages.BodyType.WorldInfo);
        sendingPacket.setWorldInfo(sendingData);

        this.broadcast(sendingPacket.serializeBinary());
    }

    generateAsteroids(){
        var asteroids = this.asteroids;
        var x, y, degrees;
        for(var k = 0; k < 3; k++){
            x = 0;
            y = 0;
            degrees = Math.floor(Math.random() * 360);
            let asteroid = new Messages.ObjectLocation();
            asteroid.setObjectId(this.nextAsteroidId);
            asteroid.setX(0.0);
            asteroid.setY(0.0);
            asteroid.setR(degrees);

            asteroids.push(asteroid);

            this.nextAsteroidId++;
        }
    }

    damageAsteroid(action){
        let damage = 5;
        let asteroidId = action.getObjectTarget();
        let found = false;
        let k = 0;
        let asteroid = null;
        while(!found && k < this.asteroids.length){
            asteroid = asteroids[k];
            if(asteroid.getObjectId === asteroidId){
                asteroid.setHealth(asteroid.getHealth() - 20);
            }
        }
    }

    initializeGame(){
        this.asteroids = new Array();
    }

    removePlayer(player){
        for( var i = 0; i < this.players.length; i++){ 
            if ( this.players[i] === player) {
              this.players.splice(i, 1);
              console.log("spliced to remove player");
            }
         }
    }
}

module.exports = Lobby;