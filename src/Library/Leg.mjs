import Kinematics from './Kinematics.mjs';
import { Orc } from './Orchestrate.mjs';

// sit at x = 90, y = 0, z = 0
// Obtuse Scalene Triangle
// Side a = 125
// Side b = 72
// Side c = 90
// .
//  .   .
//   .      .  125
// 72 .         .
//     .            .
//      .................
//            90

/**
 * @namespace API/Library
 * @class Leg
 * @exports Leg
 * @description Library class providing legs for roamer
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
export default class Leg {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 * @param {String} length1 First length or leg part
	 * @param {String} length2 Second length or leg part
	 * @note leg lengths closest to shoulder then foot
	 * @note orientation degress rotation as 0 (right middle) 45 = rb, 135 = lb and so on CW
	 */
	constructor(length1, length2) {
		this.k = new Kinematics(length1, length2);
		this.shoulder = new Orc();
		this.main = new Orc();
		this.foot = new Orc();
	}

	/**
	 * @public @method setPins
	 * @description Set the pins that is to be used for this legs joints
	 * @param {String} shoulder Shoulder joint and appendage
	 * @param {String} main Main joint and appendage
	 * @param {String} foot Foot joint and appendage
	 */
	setPins(shoulder, main, foot) {
		this.shoulder.pin = shoulder;
		this.main.pin = main;
		this.foot.pin = foot;
	}

	/**
	 * @public @method setHomes
	 * @description Set the home point to use for the servo
	 * @param {String} shoulder Shoulder joint and appendage
	 * @param {String} main Main joint and appendage
	 * @param {String} foot Foot joint and appendage
	 */
	setHomes(shoulder, main, foot) {
		this.shoulder.home = shoulder;
		this.main.home = main;
		this.foot.home = foot;
	}

	/**
	 * @public @method moveLeg
	 * @description Move the leg based on an xyz coordinate
	 * @param {String} shoulder Shoulder joint and appendage
	 * @param {String} main Main joint and appendage
	 * @param {String} foot Foot joint and appendage
	 */
	moveLeg(x, y, z) {
		this.k.moveToPosition(x, y, z);
		return { foot, shoulder, main } = this.k.getAngles();
	}
}