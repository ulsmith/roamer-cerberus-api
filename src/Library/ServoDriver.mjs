import I2C from '../../node_modules/node-i2c-js/index.js';
import Sleep from './Sleep.mjs';

/**
 * @namespace API/Library
 * @class ServoDriver
 * @exports ServoDriver
 * @description Library class providing PWM functionality over i2c
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 * @example
 * Configure min and max servo pulse lengths
 * @50hz - 424 is 180 degrees of movement from 100 --- 100 = 0, 312 = 90, 524 = 180 --- 2.355555556 ticks per degree
 * @100hz - 848 is 180 degrees of movement from 200 --- 200 = 0, 624 = 90, 1048 = 180 --- 4.711111111 ticks per degree
 * @200hz - 1670 is 180 degrees of movement from 400 --- 400 = 0, 1235 = 90, 2070 = 180 --- 9.277777778 ticks per degree
 */
export default class ServoDriver {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor(options) {
		this.m1Hex = 0x00;
		this.m2Hex = 0x01;
		this.pscaleHex = 0xFE;
		this.onLowHex = 0x06;
		this.onHighHex = 0x07;
		this.offLowHex = 0x08;
		this.offHighHex = 0x09;
		this.allOnLowHex = 0xFA;
		this.allOnHighHex = 0xFB;
		this.allOffLowHex = 0xFC;
		this.allOffHighHex = 0xFD;
		this.sleepHex = 0x10;
		this.allCallHex = 0x01;
		this.outDrvHex = 0x04;
		this.tickConfig = {
			50: { start: 100, multiply: 2.355555556 },
			100: { start: 200, multiply: 4.711111111 },
			200: { start: 400, multiply: 9.277777778 }
		};

		this.options = Object.assign({}, { address: 0x40, device: '/dev/i2c-1', debug: false, init: true, frequency: 50 }, options);
		this.i2c = new I2C(this.options.address, { device: this.options.device, debug: this.options.debug });

		if (this.options.init) this.init();
		if (this.options.frequency) this.setFrequency(this.options.frequency);
	}

	async init() {
		if (this.options.debug) {
			console.log(`device: //${this.options.device}, adress: ${this.options.address}, debug: ${this.options.debug}`);
			console.log(`Reseting... mode1: ${this.m1Hex}`);
		}

		try {
			this.setPulse(0, 0);

			this.i2c.writeBytes(this.m2Hex, this.outDrvHex);
			await this.i2c.writeBytes(this.m1Hex, this.allCallHex);
			await Sleep.microseconds(5000);

			const mode1 = await this.i2c.readBytes(this.m1Hex, 1).then((m) => m = m & ~this.sleepHex);
			await this.i2c.writeBytes(this.m1Hex, mode1);
			await Sleep.microseconds(5000);

			if (this.options.debug) console.log('init complete');
		} catch (e) {
			console.error('error with init', e);
		}
	}

	async setFrequency(frequency) {
		let pscale;
		let pscaleVal = ((25000000.0 / 4096.0) / frequency) - 1.0;

		if (this.options.debug) {
			console.log(`Setting PWM frequency: ${frequency}Hz`);
			console.log(`Estimated prescale value: ${pscaleVal}`);
		}

		pscale = Math.floor(pscaleVal + 0.5);

		if (this.options.debug) console.log(`Final prescale: ${pscale}`);

		const data = await this.i2c.readBytes(this.m1Hex, 1);
		const oldm = data[0];
		const newm = (oldm & 0x7F) | 0x10;

		if (this.options.debug) console.log(`prescale: ${Math.floor(pscale)}, new mode: ${newm.toString(16)}`);

		this.i2c.writeBytes(this.m1Hex, newm);
		this.i2c.writeBytes(this.pscaleHex, Math.floor(pscale));
		this.i2c.writeBytes(this.m1Hex, oldm);
		await Sleep.microseconds(5000);
		await this.i2c.writeBytes(this.m1Hex, oldm | 0x80);
	}

	async setPulse(channel, on, off) {
		if (this.options.debug) console.log(`Set PWM channel [${channel}] on: ${on} off: ${off}`);

		this.i2c.writeBytes(this.onLowHex + 4 * channel, on & 0xFF);
		this.i2c.writeBytes(this.onHighHex + 4 * channel, on >> 8);
		this.i2c.writeBytes(this.offLowHex + 4 * channel, off & 0xFF);
		await this.i2c.writeBytes(this.offHighHex + 4 * channel, off >> 8);
	}

	async setPulseAll(on, off) {
		if (this.options.debug) console.log(`Set ALL PWM channels on: ${on} off: ${off}`);

		this.i2c.writeBytes(this.allOnLowHex, on & 0xFF);
		this.i2c.writeBytes(this.allOnHighHex, on >> 8);
		this.i2c.writeBytes(this.allOffLowHex, off & 0xFF);
		await this.i2c.writeBytes(this.allOffHighHex, off >> 8);
	}

	async setAngle(channel, angle) {
		if (!this.tickConfig[this.options.frequency]) throw `Frequency ${this.options.frequency} must be ${Object.keys(this.tickMultiplier).join(', ')}`;
		if (angle < 0 || angle > 180) throw `Angle must be 0-180`;

		return this.setPulse(channel, 0, Math.round(this.tickConfig[this.options.frequency].start + (angle * this.tickConfig[this.options.frequency].multiply)));
	}

	async setAngleAll(angle) {
		if (!this.tickConfig[this.options.frequency]) throw `Frequency ${this.options.frequency} must be ${Object.keys(this.tickMultiplier).join(', ')}`;
		if (angle < 0 || angle > 180) throw `Angle must be 0-180`;

		return this.setPulseAll(0, Math.round(this.tickConfig[this.options.frequency].start + (angle * this.tickConfig[this.options.frequency].multiply)));
	}

	async stopChannel(channel) {
		await this.i2c.writeBytes(this.offHighHex + 4 * channel, 0x01);
	}

	async stopAll() {
		await this.i2c.writeBytes(this.allOffHighHex, 0x01);
	}
}