'use strict';

/**
 * @namespace API/Library
 * @class Sleep
 * @description Library class providing async sleep abilty for timing
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
class Sleep {
	/**
	 * @public @method @static @async seconds
	 * @description Sleep in seconds
	 * @param {Number} seconds The time in seconds
	 */
	static async seconds(seconds) {
		return new Promise((res, rej) => setTimeout(() => res(), seconds * 1000));
	}

	/**
	 * @public @method @static @async milliseconds
	 * @description Sleep in seconds
	 * @param {Number} milliseconds The time in milliseconds
	 */
	static async milliseconds(milliseconds) {
		return new Promise((res, rej) => setTimeout(() => res(), milliseconds));
	}

	/**
	 * @public @method @static @async microseconds
	 * @description Sleep in seconds
	 * @param {Number} microseconds The time in microseconds
	 */
	static async microseconds(microseconds) {
		return new Promise((res, rej) => setTimeout(() => res(), microseconds / 1000));
	}
}

module.exports = Sleep;