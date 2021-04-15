/**
 * @namespace API/Sequence
 * @class MoveWalk
 * @exports MoveWalk
 * @description Sequence class providing a canned sequence
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
export default class MoveWalk {
	/**
	 * @public @static @method do
	 * @description perform the sequence
	 * @param {Object<Leg>} legs The object collection containing Leg objects (the legs)
	 * @param {Object<Orchastrate>} legs The object collection containing Orchastrate objects (the chain)
	 * @param {Object} data The data object passed to the sequence such as the amount to move
	 * @return {Boolean} true to repeat unitl told to stop and false to complete once
	 */
	static do(legs, chain, data) {
		if (data.x == 0 && data.y == 0) return;

		let angles;
		let y = data.y > 0 ? 15 + (data.y * 2) : (data.y < 0 ? -15 + (data.y * 2) : 0);

		// move forward/back and up
		angles = legs.rightFront.moveLeg(63 + (data.x * 10), 63 + y, -40);
		chain.load('rfs', angles.shoulder, 0, 200);
		chain.load('rfm', angles.main, 0, 200);
		chain.load('rff', angles.foot, 0, 200);
		angles = legs.rightMiddle.moveLeg(90 - (data.x * 10), -y, -40);
		chain.load('rms', angles.shoulder, 0, 200);
		chain.load('rmm', angles.main, 0, 200);
		chain.load('rmf', angles.foot, 0, 200);
		angles = legs.rightBack.moveLeg(63 + (data.x * 10), -63 + y, -40);
		chain.load('rbs', angles.shoulder, 0, 200);
		chain.load('rbm', angles.main, 0, 200);
		chain.load('rbf', angles.foot, 0, 200);

		chain.play();

		// move down and center
		angles = legs.rightFront.moveLeg(63, 63, -70);
		chain.load('rfs', angles.shoulder, 100, 100);
		chain.load('rfm', angles.main, 0, 100);
		chain.load('rff', angles.foot, 0, 100);
		angles = legs.rightMiddle.moveLeg(90, 0, -70);
		chain.load('rms', angles.shoulder, 100, 100);
		chain.load('rmm', angles.main, 0, 100);
		chain.load('rmf', angles.foot, 0, 100);
		angles = legs.rightBack.moveLeg(63, -63, -70);
		chain.load('rbs', angles.shoulder, 100, 100);
		chain.load('rbm', angles.main, 0, 100);
		chain.load('rbf', angles.foot, 0, 100);

		chain.play();

		// forward/back full way
		angles = legs.rightFront.moveLeg(63 - (data.x * 10), 63 + -y, -70);
		chain.load('rfs', angles.shoulder, 0, 200);
		chain.load('rfm', angles.main, 100, 100);
		chain.load('rff', angles.foot, 0, 200);
		angles = legs.rightMiddle.moveLeg(90 + (data.x * 10), y, -70);
		chain.load('rms', angles.shoulder, 0, 200);
		chain.load('rmm', angles.main, 100, 100);
		chain.load('rmf', angles.foot, 0, 200);
		angles = legs.rightBack.moveLeg(63 - (data.x * 10), -63 + -y, -70);
		chain.load('rbs', angles.shoulder, 0, 200);
		chain.load('rbm', angles.main, 100, 100);
		chain.load('rbf', angles.foot, 0, 200);

		chain.play();

		return true;
	}
}
