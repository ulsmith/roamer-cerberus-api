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
    }

    /**
     * @public @method get
     * @description Ping the system to check whats health and whats not
     * @param {*} request The request that caused the controller to run
     * @return Promise a response promise resolved or rejected with a raw payload or {status: ..., data: ..., headers: ...} payload
     */
	connect() {
		return new Promise((res, rej) => {
			this.connection = new SerialPort(this.$environment.API_SERIAL_PORT, (err) => err ? rej(err.message) : undefined);
			this.connection.open(() => res('connected'));
		});	
	}

	/**
	 * @public @method get
	 * @description Ping the system to check whats health and whats not
	 * @param {*} request The request that caused the controller to run
	 * @return Promise a response promise resolved or rejected with a raw payload or {status: ..., data: ..., headers: ...} payload
	 */
	disconnect() {
		return new Promise((res, rej) => {
			this.connection.close((err) => err ? rej(err.message) : undefined);
			this.connection = undefined;
			return res();
		});
	}

	send(message) {
		if (!this.connection) return Promise.reject('connection error');

		return new Promise((res, rej) => {
			const timeout = setTimeout(() => { res('timeout') }, 5000);

			const parser = this.connection.pipe(new Readline({ delimiter: '\r\n' }));
			parser.on('data', function (data) {
				clearTimeout(timeout);
				return res(data);
			});

			this.connection.write(`${message}\n`, function (err) {
				if (err) return rej(err.message);
			});
		});
	}
}

module.exports = Com;