import Service from '../../node_modules/cerberus-mvc/Base/Service.js';
import Leg from '../Library/Leg.mjs';
import { Orchestrate } from '../Library/Orchestrate.mjs';
import Sequences from '../Sequence/index.mjs';

/**
 * @namespace API/Service
 * @class Sequencer
 * @exports Sequencer
 * @description Library class providing sequences for blocks of movement
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
export default class Sequencer extends Service {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor() {
		super();

		this.service = 'sequencer';
		this.ready;
		this.sig;

		// create legs
		this.legs = {};
		this.legs.leftFront = new Leg(72, 125);
		this.legs.leftMiddle = new Leg(72, 125);
		this.legs.leftBack = new Leg(72, 125);
		this.legs.rightFront = new Leg(72, 125);
		this.legs.rightMiddle = new Leg(72, 125);
		this.legs.rightBack = new Leg(72, 125);

		// set pins
		this.legs.rightFront.setChannels(0, 1, 2);
		this.legs.rightMiddle.setChannels(3, 4, 5);
		this.legs.rightBack.setChannels(6, 7, 8);
		
		// set homes
		this.legs.rightFront.setHomes(90, 90, 90);
		this.legs.rightMiddle.setHomes(90, 90, 90);
		this.legs.rightBack.setHomes(90, 90, 90);

		if (this.$environment.API_SERVO === 'disconnected') return console.log(`API_SERVO is disconnected, simulating instantiation of Sequencer service`);
		
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
	
	reset() {
		if (this.$environment.API_SERVO === 'disconnected') return console.log('API_SERVO is disconnected, simulating reset');

		this.chain.reset();
		this.ready = true;
	}

	sequence(data) {
		const action = data.action ? data.action.charAt(0).toUpperCase() + data.action.slice(1).toLowerCase() : '';
		const posture = data.posture ? data.posture.charAt(0).toUpperCase() + data.posture.slice(1).toLowerCase() : '';

		if (!Sequences[action + posture] || !this.ready) return;
		if (this.$environment.API_SERVO === 'disconnected') return console.log(`API_SERVO is disconnected, simulating sequence [${action + posture}:${data}]`);

		let sig = this.sig = action + posture + Date.now();
		this.name = action + posture;

		clearInterval(this.intval);
		let intval = this.intval = setInterval(() => {
			let repeat = Sequences[this.name].do(this.legs, this.chain, data);
			if (sig != this.sig || !repeat) clearInterval(intval);
		}, 0);
	}
}