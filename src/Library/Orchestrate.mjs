import ServoDriver from './ServoDriver.mjs';

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
		this.channel;
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
		this.driver = new ServoDriver({ address: 0x40, device: '/dev/i2c-1', debug: false });
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
	 * @public @method reset
	 * @description Run through servos and reset them
	 */
	reset() {
		for (const key in this.chain) {
			this.chain[key].orc.angle = this.chain[key].orc.home;
			this.driver.setAngle(this.chain[key].orc.channel, this.chain[key].orc.angle);
		}
	}

	/**
	 * @public @method reset
	 * @description Run through servos and clear them
	 */
	clear() {
		// reset chain values
		for (const key in this.chain) {
			this.chain[key].origin = NULL;
			this.chain[key].angle = NULL;
			this.chain[key].delay = NULL;
			this.chain[key].time = NULL;
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

			for (const key in this.chain) {
				now = Date.now();

				// capture the start position
				if (!this.chain[key].origin) this.chain[key].origin = this.chain[key].orc.angle;

				// capture the increment amount if not set
				const inc = (this.chain[key].angle - this.chain[key].origin) / this.chain[key].time;

				// move by increment over time added to current angle
				if (now >= start + this.chain[key].delay && this.chain[key].angle != this.chain[key].orc.angle) {
					// write new angle
					this.chain[key].orc.angle = (this.chain[key].origin + (inc * (now - (start + this.chain[key].delay))));

					// should we overrid it if past?
					if ((this.chain[key].angle > this.chain[key].origin && this.chain[key].orc.angle > this.chain[key].angle) || (this.chain[key].angle < this.chain[key].origin && this.chain[key].orc.angle < this.chain[key].angle)) this.chain[key].orc.angle = this.chain[key].angle;

					// write movement
					try {
						this.driver.setAngle(this.chain[key].orc.channel, this.chain[key].orc.angle);
					} catch (err) {
						console.log(err);
					}
				}

				if (done) done = !this.chain[key].angle || this.chain[key].angle == this.chain[key].orc.angle;
			}
		}

		// clear up cache
		for (const key in this.chain) this.chain[key].origin = null;
	}
}

export {
	Orc,
	Orchestrate
};