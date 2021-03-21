'use strict';

const Controller = require('cerberus-mvc/Base/Controller');
const RestError = require('cerberus-mvc/Error/Rest');

/**
 * @namespace API/Controller
 * @class Health
 * @extends Controller
 * @description Controller class exposing methods over the routed endpoint
 * @author Paul Smith (ulsmith) <p@ulsmith.net> <pa.ulsmith.net>
 * @copyright 2020 Paul Smith (ulsmith) all rights reserved
 * @license MIT
 */
class Disconnect extends Controller {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
    constructor() {
        super();
    }

	/**
	 * @public @static @get access
	 * @desciption Get the access for methods. All methods are restricted by default unless specifically set as 'public'.
	 * @return {Object} Object of access levels for methods
	 */
    static get socket() { return 'public' }

    /**
     * @public @method get
     * @description Ping the system to check whats health and whats not
     * @param {*} request The request that caused the controller to run
     * @return Promise a response promise resolved or rejected with a raw payload or {status: ..., data: ..., headers: ...} payload
     */
	socket(request) {
		if (!this.$services.ComService.connection) return;

		this.$services.ComService.ignore()
			.then(() => this.$services.ComService.disconnect())
			.then(() => this.$socket.emit('notification', { type: 'info', message: 'Disconnected from serial port' }))
			.catch(() => this.$socket.emit('notification', { type: 'warning', message: 'Could not disconnect from serial port' }));	
	}
}

module.exports = Disconnect;
