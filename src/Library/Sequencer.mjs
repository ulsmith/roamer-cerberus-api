import Leg from './Leg.mjs';
import { Orchestrate } from './Orchestrate.mjs';
import Sequences from '../Sequence/index.mjs';

/**
 * @namespace API/Library
 * @class Sequencer
 * @exports Sequencer
 * @description Library class providing sequences for blocks of movement
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 * @note
 * sit at x = 90, y = 0, z = 0
 * Obtuse Scalene Triangle
 * Side angles = 125
 * Side b = 72
 * Side c = 90
 * .
 *  .   .
 *   .      .  125
 * 72 .         .
 *     .            .
 *      .................
 *             90
 */
export default class Sequencer {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor() {
		// create legs
		this.legs = {};
		this.legs.leftFront = new Leg(72, 125);
		this.legs.leftMiddle = new Leg(72, 125);
		this.legs.leftBack = new Leg(72, 125);
		this.legs.rightFront = new Leg(72, 125);
		this.legs.rightMiddle = new Leg(72, 125);
		this.legs.rightBack = new Leg(72, 125);

		// set pins
		this.legs.rightFront.setPins(22, 24, 26);
		this.legs.rightMiddle.setPins(28, 30, 32);
		this.legs.rightBack.setPins(34, 36, 38);
		
		// set homes
		this.legs.rightFront.setHomes(90, 90, 90);
		this.legs.rightMiddle.setHomes(90, 90, 90);
		this.legs.rightBack.setHomes(90, 90, 90);
		
		// apply leg joints to orchestration chain
		this.chain = new Orchestrate();
		this.chain.add('rfs', this.legs.rightFront.shoulder);
		this.chain.add('rfm', this.legs.rightFront.main);
		this.chain.add('rff', this.legs.rightFront.foot);
		this.chain.add('rms', this.legs.rightMiddle.shoulder);
		this.chain.add('rmm', this.legs.rightMiddle.main);
		this.chain.add('rmf', this.legs.rightMiddle.foot);
		this.chain.add('rbs', this.legs.rightBack.shoulder);
		this.chain.add('rbm', this.legs.rightBack.main);
		this.chain.add('rbf', this.legs.rightBack.foot);
	}

	setup() {
		this.chain.assign();
	}

	reset() {
		this.chain.reset();
	}

	sequence(name, d1, d2) {
		if (!Sequences[name]) return;
		Sequences[name].do(this.legs, this.chain, d1, d2);
	}
}