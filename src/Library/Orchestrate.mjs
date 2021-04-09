/**
 * @namespace API/Library
 * @class Orc
 * @exports Orc
 * @description Library class providing orcastrable structure
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
class Orc {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor() {
		this.servo;
		this.pin;
		this.angle;
		this.home;
	}
};

/**
 * @namespace API/Library
 * @class Orchestrate
 * @exports Orchastrate
 * @description Library class providing servo orchastration support, moving many servos in unison
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
class Orchestrate {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor() {
		this.chain = {};
	}

	add(key, orc) {
		this.chain[key] = {
			orc,
			origin: undefined,
			angle: undefined,
			delay: undefined,
			time: undefined
		};
	}

	remove(key) {
		delete this.chain[key];
	}

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 * @param {String} name The property name for the chain item
	 * @param {Number} angle The angle to set in degres 0-180
	 * @param {Number} delay The delay to use in ms
	 * @param {Number} time The time to take in ms
	 */
	load(name, angle, delay, time) {
		this.chain[name].angle = angle;
		this.chain[name].delay = delay;
		this.chain[name].time = time;
	}

	/**
	 * @public @method assign
	 * @description Run through servos and assign them to pins
	 */
	assign() {
		for (const key in this.chain) {
			/*
			chain[key].orc.servo = Servo();
			chain[key].orc.servo.attach(chain[i].orc -> pin);
			*/
			console.log(key + ':assign servo');
			console.log(key + ':attach pin');
		}
	}

	/**
	 * @public @method reset
	 * @description Run through servos and reset them
	 */
	reset() {
		for (const key in this.chain) {
			chain[key].orc.angle = chain[key].orc.home;
			// chain[key].orc.servo.write(chain[key].orc.angle);
			console.log(key + ':move servo to home');
		}
	}

	/**
	 * @public @method reset
	 * @description Run through servos and clear them
	 */
	clear() {
		// reset chain values
		for (const key in chain) {
			chain[key].origin = NULL;
			chain[key].angle = NULL;
			chain[key].delay = NULL;
			chain[key].time = NULL;
		}
	}

	/**
	 * @public @method reset
	 * @description Run through servos performing moves and checking to see if done
	 */
	play() {
		const start = Date.now();
		let now = Date.now();
		let done = false;

		while (!done) {
			done = true;

			for (const key in chain) {
				now = Date.now();
				let res = this.move(chain[key], start, now);
				if (done) done = res;
			}
		}

		// clear up cache
		for (const key in chain) chain[key].origin = null;
	}

	/**
	 * @public @method move
	 * @description Move the actual chainable item and return its state as at angle or not
	 * @param {Object} chainable The chianable object
	 * @param {Number} start The start time as timestamp
	 * @param {Number} now The now time as timestamp
	 */
	move(chainable, start, now) {
		// capture the start position
		if (!chainable.origin) chainable.origin = chainable.orc.angle;

		// capture the increment amount if not set
		const inc = (chainable.angle - chainable.origin) / chainable.time;

		// move by increment over time added to current angle
		if (now >= start + chainable.delay && chainable.angle != chainable.orc.angle) {
			// write new angle
			chainable.orc.angle = (chainable.origin + (inc * (now - (start + chainable.delay))));

			// should we overrid it if past?
			if (chainable.angle > chainable.origin && chainable.orc.angle > chainable.angle) chainable.orc.angle = chainable.angle;
			else if (chainable.angle < chainable.origin && chainable.orc.angle < chainable.angle) chainable.orc.angle = chainable.angle;

			// write movement
			// chainable.orc.servo.write(chainable.orc.angle);
			console.log('move servo chainable');
		}

		// did we make it all the way?
		return chainable.angle == chainable.orc.angle;
	}
}

export {
	Orc,
	Orchestrate
};