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
class Test extends Controller {

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
     * @public @method socket
     * @description Ping the system to check whats health and whats not
     * @param {*} request The request that caused the controller to run
     * @return Promise a response promise resolved or rejected with a raw payload or {status: ..., data: ..., headers: ...} payload
     */
	socket(request) {
		console.log('socket', request.headers, request.parameters, request.body);
		
		this.$socket.emit('log', 'me only\n', 34, {test: 'fsdfsdfsd'});
		this.$io.emit('log', 'everyone\n');
		this.$socket.broadcast.emit('log', 'not me\n');
	}
}

module.exports = Test;
