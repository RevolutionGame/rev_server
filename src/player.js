const Messages = require('./messages_pb');

class Player {

    constructor(socket, lobby) {
        this.socket = socket;
        this.lobby = lobby;
        this.is_alive = false;   
        this.is_connected = false;
        this._set_up_socket_listeners();
        this.pong_interval = setInterval(this._ping_interval_function.bind(this), 10000);
    }

    _set_up_socket_listeners() {
        this.socket.on('message', this._on_message.bind(this));
        this.socket.on('pong', this._on_pong.bind(this));   
        this.socket.on('open', this._on_open.bind(this));
        this.socket.on('error', this._on_error.bind(this));
    }

    _on_message(data) {
        let packet = Messages.Packet.deserializeBinary(data);
        switch(packet.getType()) {
            case Messages.Type.REQUEST_SLOT:
                console.log(`${packet.getPlayerInfo().getName()} is requesting a slot`);
                this._on_slot_request();
                break;  
            case Messages.Type.PLAYER_LOCATION:
                this._on_location();
                break;
            case Messages.Type.PLAYER_ACTION:
                this._on_player_action();
                break;         
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
        this.ping(() => {});
    }

    _on_close() {
        console.log('closing socket');
    }

    _on_error(err) {
        console.log(`error ${err.message}`);
    }

    _on_slot_request() {

    }

    _on_open() {
        console.log('socket is open');
    }

    _on_location() {

    }

    _on_player_action() {
        
    }
}

module.exports = Player;