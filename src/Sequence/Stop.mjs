/**
 * @namespace API/Sequence
 * @class Stop
 * @exports Stop
 * @description Sequence class providing a canned sequence
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
export default class Stop {

	/**
	 * @public @static @method do
	 * @description perform the sequence
	 * @param {Object<Leg>} legs The object collection containing Leg objects (the legs)
	 * @param {Object<Orchastrate>} legs The object collection containing Orchastrate objects (the chain)
	 * @param {Number} sx The x as a speed reference from -15 <> 0 <> 15, controlling the speed to move in that direction
	 * @param {Number} sy The y as a speed reference from -15 <> 0 <> 15, controlling the speed to move in that direction
	 * @return {Boolean} true to repeat unitl told to stop and false to complete once
	 */
	static do(legs, chain, sx, sy) {
		
	}
}