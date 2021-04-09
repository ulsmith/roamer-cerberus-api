import Controller from '../../node_modules/cerberus-mvc/Base/Controller.js';

/**
 * @namespace API/Controller
 * @class Health
 * @extends Controller
 * @exports Action
 * @description Controller class exposing methods over the routed endpoint
 * @author Paul Smith (ulsmith) <p@ulsmith.net> <pa.ulsmith.net>
 * @copyright 2020 Paul Smith (ulsmith) all rights reserved
 * @license MIT
 */
export default class Action extends Controller {

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
		if (!this.$services.ComService.connection) return this.$socket.emit('notification', { type: 'warning', message: 'Serial port is not connected' });

		this.$services.ComService.send(request.body).catch(() => this.$socket.emit('notification', { type: 'warning', message: 'Could not send message to serial port' }));	
	}
}
