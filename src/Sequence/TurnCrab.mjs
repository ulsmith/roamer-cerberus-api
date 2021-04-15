/**
 * @namespace API/Sequence
 * @class TurnCrab
 * @exports TrunCrab
 * @description Sequence class providing a canned sequence
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
export default class TurnCrab {

	/**
	 * @public @static @method do
	 * @description perform the sequence
	 * @param {Object<Leg>} legs The object collection containing Leg objects (the legs)
	 * @param {Object<Orchastrate>} legs The object collection containing Orchastrate objects (the chain)
	 * @param {Object} data The data object passed to the sequence such as the amount to move
	 * @return {Boolean} true to repeat unitl told to stop and false to complete once
	 */
	static do(legs, chain, data) {
	}
}
