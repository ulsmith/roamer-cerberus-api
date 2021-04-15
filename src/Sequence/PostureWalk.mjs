/**
 * @namespace API/Sequence
 * @class PostureWalk
 * @exports PostureWalk
 * @description Sequence class providing a canned sequence
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
export default class PostureWalk {

	/**
	 * @public @static @method do
	 * @description perform the sequence
	 * @param {Object<Leg>} legs The object collection containing Leg objects (the legs)
	 * @param {Object<Orchastrate>} legs The object collection containing Orchastrate objects (the chain)
	 * @param {Object} data The data object passed to the sequence such as the amount to move
	 * @return {Boolean} true to repeat unitl told to stop and false to complete once
	 */
	static do(legs, chain, data) {
		let angles;

		// step odd legs to position above ground
		angles = legs.rightFront.moveLeg(63, 63, -40);
		chain.load('rfs', angles.shoulder, 200, 200);
		chain.load('rfm', angles.main, 0, 200);
		chain.load('rff', angles.foot, 0, 200);
		angles = legs.rightBack.moveLeg(63, -63, -40);
		chain.load('rbs', angles.shoulder, 200, 200);
		chain.load('rbm', angles.main, 0, 200);
		chain.load('rbf', angles.foot, 0, 200);

		chain.play();

		// lower odd legs to position
		angles = legs.rightFront.moveLeg(63, 63, -90);
		chain.load('rfs', angles.shoulder, 0, 200);
		chain.load('rfm', angles.main, 0, 200);
		chain.load('rff', angles.foot, 0, 200);
		angles = legs.rightBack.moveLeg(63, -63, -90);
		chain.load('rbs', angles.shoulder, 0, 200);
		chain.load('rbm', angles.main, 0, 200);
		chain.load('rbf', angles.foot, 0, 200);

		chain.play();

		// step even legs to position above ground
		angles = legs.rightMiddle.moveLeg(90, 0, -40);
		chain.load('rms', angles.shoulder, 200, 200);
		chain.load('rmm', angles.main, 0, 200);
		chain.load('rmf', angles.foot, 0, 200);

		chain.play();

		// lower even legs to position
		angles = legs.rightMiddle.moveLeg(90, 0, -90);
		chain.load('rms', angles.shoulder, 0, 200);
		chain.load('rmm', angles.main, 0, 200);
		chain.load('rmf', angles.foot, 0, 200);

		chain.play();
	}
}