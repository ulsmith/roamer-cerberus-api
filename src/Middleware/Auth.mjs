import Middleware from '../../node_modules/cerberus-mvc/Base/Middleware.js';
import RestError from '../../node_modules/cerberus-mvc/Error/Rest.js';

/**
 * @namespace API/Middleware
 * @class Auth
 * @extends Middleware
 * @description Middleware class providing authentication actions in all incomming requests
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2020 (ulsmith) all rights reserved
 * @license MIT
 */
export default class Auth extends Middleware {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor() {
		super();
	}

	/**
	 * @public @method in
	 * @description Invoke middleware for incomming event
	 * @param {Object} request The incoming request
	 */
	in(request) {
		// is this an internal message from aws?
		if (request.source === 'event') {
			// incoming only
			if (this.$client.origin) throw new RestError('Origin cannot be set on message, access denied', 401);

			// public access, do not authorize
			if (request.access !== request.context.service) throw new RestError('No access to this function for [' + request.context.service + '], access denied', 401);

			return request;
		}

		// API GATEWAY API REQUEST
		// incoming only
		if (!this.$client.origin) throw new RestError('Origin is not set, access denied', 401);
		
		// origin failed to auth to white list
		if (this.$environment.API_CORS_LIST.replace(' ', '').split(',').indexOf(this.$client.origin) < 0) throw new RestError('Origin [' + this.$client.origin + '] is not allowed, access denied', 401);
		
		// public access, do not authorize
		if (request.access === 'public') return request;

		// missing token
		if (!request.headers.Authorization) throw new RestError('Missing Authorization Token, invalid', 401);

		// get token bits
		if (request.headers.Authorization.split(' ')[0].toLowerCase() !== 'bearer') throw new RestError('Malformed Token due to missing "Bearer", invalid', 401);

		// verify against auth service, throws restError on failure
		return this.$services.auth.verify(request.headers.Authorization, request.headers['User-Agent']).then(() => request);
	}
}