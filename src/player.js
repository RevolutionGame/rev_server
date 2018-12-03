const Messages = require('./messages_pb');

class Player {

    constructor(socket, lobby) {
        this.socket = socket;
        this.lobby = lobby;
        this.is_alive = true;   
        this.is_connected = false;
        this._set_up_socket_listeners();
        this.pong_interval = setInterval(this._ping_interval_function.bind(this), 1000);
    }

    _set_up_socket_listeners() {
        console.log("sets up listeners");
        this.socket.on('message', this._on_message.bind(this));
        this.socket.on('pong', this._on_pong.bind(this));
        this.socket.on('open', this._on_open.bind(this));
        this.socket.on('error', this._on_error.bind(this));
        this.socket.on('close', this._on_close.bind(this));
    }

    _on_message(data) {
        let packet = Messages.Packet.deserializeBinary(data);
        console.log("packet received: " + packet);
        switch(packet.getBodyType()) {
            case Messages.BodyType.REQUEST_SLOT:
                console.log(`${packet.getPlayerInfo().getName()} is requesting a slot`);
                this._on_slot_request();
                break;
            case Messages.BodyType.PLAYER_LOCATION:
                this._on_location(packet);
                break;
            case Messages.BodyType.PLAYER_ACTION:
                this._on_player_action(packet);
                break;   
            case Messages.BodyType.PLAYER_READY:
                this._on_player_ready();
        }
    }

    _on_pong() {
        this.is_alive = true;
    }

    _ping_interval_function() {
        if(this.is_alive === false) {
            console.log(`${this.name} has lost connection`);
            clearInterval(this.pong_interval);
            return this.socket.terminate();
        }
        this.is_alive = false;
        this.socket.ping(() => {});
    }

    _on_close() {
        console.log('closing socket');
        this.lobby.removePlayer(this);
    }

    _on_error(err) {
        console.log(`error ${err.message}`);
    }

    _on_slot_request() {

    }

    _on_open() {
        console.log('socket is open');
    }

    _on_location(packet) {
        this._broadcast(packet.serializeBinary());
    }

    _on_player_action(packet) {
        let action = packet.getPlayerAction();
        switch(action.getActionType()) {
            case Messages.ActionType.FIRE_GUN:
                this._broadcast(packet.serializeBinary());
                break;
            case Messages.ActionType.DESPAWN_SHIP:
                this._broadcast(packet.serializeBinary());
                break;
            case Messages.ActionType.SPAWN_SHIP:
                this._broadcast(packet.serializeBinary());
                break;   
            case Messages.ActionType.HIT_ASTEROID:
                this.asteroidHit(action);
                break;   
            case Messages.ActionType.HIT_PLAYER:
                this.playerHit(action);
        }
        action.getActionType
    }

    _on_player_ready() {
        this.lobby.playerReady();
    }

    _broadcast(packet) {
        this.lobby.players.forEach(player => {
            player.send(packet);
        });      
    }

    send(packet) {
        this.socket.send(packet);
    }

    asteroidHit(action){
        this.lobby.damageAsteroid(action);
    }

    playerHit(action, socket){
        //this.lobby.damagePlayer();//TODO write this in lobby
    }
}

module.exports = Player;
