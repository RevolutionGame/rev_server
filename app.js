const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const Lobby = require('./src/lobby');

app.get('/lobby', (req, res) => {
		res.append('Access-Control-Allow-Origin', '*');
		res.send(`ws://infinite-woodland-97233.herokuapp.com${lobby.server.options.path}`);
});

const server = app.listen(port, () => console.log(`Revolution Server up and listening on port ${port}`));
const lobby = new Lobby(server, "/lobby");

