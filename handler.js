'use strict';

const Application = require('cerberus-mvc/System/Application');
const CorsMiddleware = require('cerberus-mvc/Middleware/Cors');
const AuthMiddleware = require('./src/Middleware/Auth.js');
// const AuthService = require('./src/Service/Auth.js');

const express = require('express');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const API_PORT = 8082;
const server = express();

server.use(requestIp.mw())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.use('/', (req, res) => {
	let app = new Application('express');
	let corsMiddleware = new CorsMiddleware();

	app.middleware(corsMiddleware);

	return app.run(req).then((response) => res.set(response.headers).status(response.status).send(response.body));
});

server.listen(API_PORT, () => console.log('Rest API listening on http://localhost:' + API_PORT));

const http = require('http').Server(express());
const SOCKET_PORT = 3000
const io = require('socket.io')(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: ["authorization"]
	}
});

io.on('connection', (socket) => {
	socket.onAny((route, data) => {		
		console.log(route);
		const app = new Application('socket');
		// const authService = new AuthService();
		const authMiddleware = new AuthMiddleware();

		// app.service(authService);
		app.middleware(authMiddleware);

		app.run({ route, data, socket, io });
	});
});

http.listen(SOCKET_PORT, () => {
	console.log('Socket API listening on http://localhost:' + SOCKET_PORT);
});