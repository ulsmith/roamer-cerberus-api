'use strict';

const Application = require('cerberus-mvc/System/Application');
const CorsMiddleware = require('cerberus-mvc/Middleware/Cors');
const AuthMiddleware = require('./src/Middleware/Auth.js');
const ComService = require('./src/Service/Com.js');
// const AuthService = require('./src/Service/Auth.js');
const express = require('express');
const requestIp = require('request-ip');
const http = require('http');
const socketio = require('./node_modules/socket.io/dist/index.js');

const API_PORT = 8082;
const server = express();
const shttp = http.Server(express())
const SOCKET_PORT = 3000
const io = socketio(shttp, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: ["authorization"]
	}
});

// traditional rest
server.use(requestIp.mw())
server.use(express.urlencoded({ extended: false }))
server.use(express.json())
server.use('/', (req, res) => {
	let app = new Application('express');
	let corsMiddleware = new CorsMiddleware();

	app.middleware(corsMiddleware);

	return app.run(req).then((response) => res.set(response.headers).status(response.status).send(response.body));
});
server.listen(API_PORT, () => console.log('Rest API listening on http://localhost:' + API_PORT));

// socket io
io.on('connection', (socket) => {
	const app = new Application('socket');
	// const authService = new AuthService();
	const authMiddleware = new AuthMiddleware();
	const comService = new ComService();

	// app.service(authService);
	app.middleware(authMiddleware);
	// here we need to somehow auth the user and drop connect if not authed
	
	socket.onAny((route, data) => {		
		console.log(route, data, socket.id);

		app.service(comService);

		app.run({ route, data, socket, io });
	});
});
shttp.listen(SOCKET_PORT, () => console.log('Socket API listening on http://localhost:' + SOCKET_PORT));