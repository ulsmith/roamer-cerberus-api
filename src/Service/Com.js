const Service = require('cerberus-mvc/Base/Service');

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

/**
 * @namespace Service
 * @class Com
 * @description Communications handler for all serial port communications
 * @author Paul Smith (ulsmith) <p@ulsmith.net> <pa.ulsmith.net>
 * @copyright 2020 Paul Smith (ulsmith) all rights reserved
 * @license MIT
 */
class Com extends Service{

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
    constructor() {
        super();

		this.service = 'ComService';
		this.connection;
		this.parser;
    }

    /**
     * @public @method get
     * @description Ping the system to check whats health and whats not
	 * @socket @emit roamer-request {string}
     * @param {*} request The request that caused the controller to run
     * @return Promise a response promise resolved or rejected with a raw payload or {status: ..., data: ..., headers: ...} payload
     */
	connect() {
		return new Promise((res, rej) => {
			this.connection = new SerialPort(this.$environment.API_SERIAL_PORT, (err) => err ? rej(err.message) : undefined);
			this.$socket.emit('roamer-request', 'connect');
			this.$socket.emit('roamer-response', 'connected');
			this.connection.open(() => res('connected'));
		});	
	}

	/**
	 * @public @method get
	 * @description Ping the system to check whats health and whats not
	 * @socket @emit roamer-request {string}
	 * @param {*} request The request that caused the controller to run
	 * @return Promise a response promise resolved or rejected with a raw payload or {status: ..., data: ..., headers: ...} payload
	 */
	disconnect() {
		return new Promise((res, rej) => {
			this.connection.close((err) => err ? rej(err.message) : undefined);
			this.connection = undefined;
			this.$socket.emit('roamer-request', 'disconnect');
			this.$socket.emit('roamer-response', 'disconnected');
			return res('disconnected');
		});
	}

	listen() {
		if (!this.connection) return Promise.reject('connection error');

		return new Promise((res, rej) => {
			this.parser = this.connection.pipe(new Readline({ delimiter: '\r\n' }));
			this.parser.on('data', (data) => this.$socket.emit('roamer-response', (data + '\n').replace('\n\n', '\n')));
			this.$socket.emit('roamer-request', 'listen');
			this.$socket.emit('roamer-response', 'listening');
			return res('listening');
		});
	}

	ignore() {
		return new Promise((res, rej) => {
			this.parser = undefined;
			return res('ignoring');
		});
	}

	send(message) {
		if (!this.connection) return Promise.reject('connection error');

		return new Promise((res, rej) => {
			this.connection.write(`${message}\n`, (err) => {
				if (err) return rej(err.message);
				this.$socket.emit('roamer-request', `${message}`);
				return res('sent');
			});
		});
	}
}

module.exports = Com;