const I2C = require('node-i2c-js');
const Sleep = require('./Sleep');

/**
 * @namespace API/Library
 * @class PwmDriver
 * @description Library class providing PWM functionality over i2c
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
class PwmDriver {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor(options) {
		this.m1Hex = 0x00;
		this.m2Hex = 0x01;
		this.pscaleHex = 0xFE;
		this.onLowHex = 0x06;
		this.onHighhex = 0x07;
		this.offLowHex = 0x08;
		this.offHighHex = 0x09;
		this.allOnLowHex = 0xFA;
		this.allOnHighHex = 0xFB;
		this.allOffLowHex = 0xFC;
		this.allOffHighHex = 0xFD;
		this.sleepHex = 0x10;
		this.allCallHex = 0x01;
		this.outDrvHex = 0x04;

		this.options = Object.assign({}, { address: 0x40, device: '/dev/i2c-1', debug: false }, options);
		this.i2c = new I2C(this.options.address, { device: this.options.device, debug: this.options.debug });
	}

	async init() {
		if (this.options.debug) {
			console.log(`device: //${this.options.device}, adress: ${this.options.address}, debug: ${this.options.debug}`);
			console.log(`Reseting... mode1: ${this.m1Hex}`);
		}

		try {
			this.setPulse(0, 0);

			await this.i2c.writeBytes(this.m2Hex, this.outDrvHex);
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

		await this.i2c.writeBytes(this.m1Hex, newm);
		await this.i2c.writeBytes(this.pscaleHex, Math.floor(pscale));
		await this.i2c.writeBytes(this.m1Hex, oldm);
		await Sleep.microseconds(5000);
		await this.i2c.writeBytes(this.m1Hex, oldm | 0x80);
	}

	async setPulse(channel, on, off) {
		if (this.options.debug) console.log(`Set PWM channel [${channel}] on: ${on} off: ${off}`);

		await this.i2c.writeBytes(this.onLowHex + 4 * channel, on & 0xFF);
		await this.i2c.writeBytes(this.onHighhex + 4 * channel, on >> 8);
		await this.i2c.writeBytes(this.offLowHex + 4 * channel, off & 0xFF);
		await this.i2c.writeBytes(this.offHighHex + 4 * channel, off >> 8);
	}

	async setPulseAll(on, off) {
		if (this.options.debug) console.log(`Set ALL PWM channels on: ${on} off: ${off}`);

		await this.i2c.writeBytes(this.allOnLowHex, on & 0xFF);
		await this.i2c.writeBytes(this.allOnHighHex, on >> 8);
		await this.i2c.writeBytes(this.allOffLowHex, off & 0xFF);
		await this.i2c.writeBytes(this.allOffHighHex, off >> 8);
	}

	async clearPulse(channel) {
		await this.i2c.writeBytes(this.offHighHex + 4 * channel, 0x01);
	}

	async clearPulseAll() {
		await this.i2c.writeBytes(this.allOffHighHex, 0x01);
	}
}

module.exports = PwmDriver;