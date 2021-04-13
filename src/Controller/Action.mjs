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
		// if (!this.$services.ComService.connection) return this.$socket.emit('notification', { type: 'warning', message: 'Serial port is not connected' });

		// this.$services.ComService.send(request.body).catch(() => this.$socket.emit('notification', { type: 'warning', message: 'Could not send message to serial port' }));	
		// console.log(request);



		// console.log(request);

		// sit
		// this.$services.sequencer.sequence('PostureSit');

		// ////////////////////////////////////////

		// for most part appears to work now

		// need to change the payload coming in
		// need to patch this through to sequences
		// need to look at jitteryness
		// think we may need to add some promise chains in somewhere

		// console.log(request.body);

		if (!request.body) return;

		const body = JSON.parse(request.body);
		const action = body.action ? body.action.charAt(0).toUpperCase() + body.action.slice(1).toLowerCase() : '';
		const posture = body.posture ? body.posture.charAt(0).toUpperCase() + body.posture.slice(1).toLowerCase() : '';

		console.log(action + posture);
		// console.log(this.$services);
		this.$services.sequencer.sequence(action + posture, body.x, body.y);


		// /connect undefined Oemu2lG9ePzX2rocAAAD
		// /disconnect undefined Oemu2lG9ePzX2rocAAAD
		// /connect undefined Oemu2lG9ePzX2rocAAAD
				
		// /action {"action":"posture","posture":"sit"} Oemu2lG9ePzX2rocAAAD
		// {"action":"posture","posture":"sit"}
		
		// /action {"action":"posture","posture":"crab"} Oemu2lG9ePzX2rocAAAD
		// {"action":"posture","posture":"crab"}
		
		// /action {"action":"posture","posture":"walk"} Oemu2lG9ePzX2rocAAAD
		// {"action":"posture","posture":"walk"}
		
		// /action {"action":"posture","posture":"run"} Oemu2lG9ePzX2rocAAAD
		// {"action":"posture","posture":"run"}
		
		// /action {"action":"move","posture":"run","x":0,"y":0} Oemu2lG9ePzX2rocAAAD
		// {"action":"move","posture":"run","x":0,"y":0}
		
		// /action {"action":"move","posture":"run","x":0,"y":1} Oemu2lG9ePzX2rocAAAD
		// {"action":"move","posture":"run","x":0,"y":1}
		
		// /action {"action":"move","posture":"run","x":0,"y":2} Oemu2lG9ePzX2rocAAAD
		// {"action":"move","posture":"run","x":0,"y":2}
		
		// /action {"action":"move","posture":"run","x":1,"y":2} Oemu2lG9ePzX2rocAAAD
		// {"action":"move","posture":"run","x":1,"y":2}
		
		// /action {"action":"move","posture":"run","x":2,"y":2} Oemu2lG9ePzX2rocAAAD
		// {"action":"move","posture":"run","x":2,"y":2}
		
		// /action {"action":"stop"} Oemu2lG9ePzX2rocAAAD
		// {"action":"stop"}

	}
}
