'use strict';

/**
 * @namespace API/Library
 * @class Kinematics
 * @description Library class providing kinematics support, for angle generation
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
class Kinematics {
	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 * @param {Number} length1 The first length
	 * @param {Number} length2 The second length
	 */
	constructor(length1, length2) {
		this.l1 = length1;
		this.l2 = length2;

		this._cAng = { t1: 90, t2: -90, t3: 0 };
		this._cPos = { x: this.l2, y: 0, z: this.l1 };
	}

	/**
	 * @public @get @method angles
	 * @description Get current angles
	 * @return {Object} The current angles as t1, t2, t3
	 */
	get angles() { return this._cAng; }

	/**
	 * @public @get @method positions
	 * @description Get current positions
	 * @return {Object} The current positions as x, y, z
	 */
	get positions() { return this._cPos; }

	/**
	 * @private @method _radians
	 * @description Calculate radians form degrees
	 * @param {Number} degrees The degrees to convert
	 * @return {Number} The radians from degrees
	 */
	_radians(degrees) {
		return degrees * (Math.PI / 180);
	}

	/**
	 * @private @method _degrees
	 * @description Calculate degrees from radians
	 * @param {Number} radians The radians to convert
	 * @return {Number} The degrees from radians
	 */
	_degrees(radians) {
		return radians * (180 / Math.PI);
	}

	/**
	 * @public @method moveToAngle
	 * @description Use angles to set angles, positions
	 * @param {Number} t1 The first angle to move
	 * @param {Number} t2 The second angle to move
	 * @param {Number} t3 The third angle to move
	 */
	moveToAngle(t1, t2, t3) {
		const xPrime = this.l1 * Math.cos(this._radians(t1)) + this.l2 * Math.cos(this._radians(t1) + this._radians(t2));
		const z = this.l1 * Math.sin(this._radians(t1)) + this.l2 * Math.sin(this._radians(t1) + this._radians(t2));
		const x = xPrime * Math.cos(this._radians(t3));
		const y = xPrime * Math.sin(this._radians(t3));

		this._cAng = { t1, t2, t3 };
		this._cPos = { x, y, z };
	}

	/**
	 * @public @method moveToPosition
	 * @description Use positions to set angles, positions
	 * @param {Number} x The x posiiton to move
	 * @param {Number} y The y position to move
	 * @param {Number} z The z position to move
	 */
	moveToPosition(x, y, z) {
		const xPrime = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		const t3 = this._degrees(Math.atan(y/x));
		const t2 = -this._degrees(Math.acos((Math.pow(xPrime, 2) + Math.pow(z, 2) - Math.pow(this.l1, 2) - Math.pow(this.l2, 2))/(2 * this.l1 * this.l2)));
		const t1 = this._degrees(Math.atan(z / xPrime) - Math.atan((this.l2 * Math.sin(this._radians(t2))) / (this.l1 + this.l2 * Math.cos(this._radians(t2)))));

		this._cAng = {t1, t2, t3};
		this._cPos = {x, y, z};
	}
}

module.exports = Kinematics;