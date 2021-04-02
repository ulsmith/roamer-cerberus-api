'use strict';

/**
 * @namespace API/Sequence
 * @class PostureSit
 * @description Sequence class providing a canned sequence
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
class PostureSit {

	/**
	 * @public @static @method do
	 * @description perform the sequence
	 * @param {Object<Leg>} legs The object collection containing Leg objects (the legs)
	 * @param {Object<Orchastrate>} legs The object collection containing Orchastrate objects (the chain)
	 */
	static do(legs, chain) {
		let angles;

		// move to sit positions
		angles = legs.rightFront.moveLeg(90, 0, 0);
		chain.load('rfs', angles.shoulder, 200, 200);
		chain.load('rfm', angles.main, 0, 200);
		chain.load('rff', angles.foot, 0, 200);
		angles = legs.rightMiddle.moveLeg(90, 0, 0);
		chain.load('rms', angles.shoulder, 200, 200);
		chain.load('rmm', angles.main, 0, 200);
		chain.load('rmf', angles.foot, 0, 200);
		angles = legs.rightBack.moveLeg(90, 0, 0);
		chain.load('rbs', angles.shoulder, 200, 200);
		chain.load('rbm', angles.main, 0, 200);
		chain.load('rbf', angles.foot, 0, 200);
		
		chain.play();
	}
}

module.exports = PostureSit;
