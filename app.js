const express = require('express');
const app = express();
const port = process.env.PORT;
const Lobby = require('./src/lobby');

const server = app.listen(port, () => console.log(`Revolution Server up and listening on port ${port}`));
const lobby = new Lobby(server);

