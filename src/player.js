class Player {

    constructor(socket) {
        this.socket = socket;
        this.is_alive = false;
        this.is_connected = false;
        this._set_up_socket_listeners();
        this.pong_interval = setInterval(this._ping_interval_function.bind(this), 10000);
    }

    _set_up_socket_listeners() {
        this.socket.on('message', this._on_message.bind(this));
        this.socket.on('pong', this._on_pong.bind(this));                
    }

    _on_message(data) {
        
    }

    _on_pong() {
        this.is_alive = true;
    }

    _ping_interval_function() {
        if(this.is_alive === false) {
            console.log(`${name} has lost connection`);
            clearInterval(this.pong_interval);
            return socket.terminate();
        }
        this.is_alive = false;
        this.ping(() => {});
    }
}

module.exports = Player;
