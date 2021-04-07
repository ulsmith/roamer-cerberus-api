// const makePwmDriver = require('../dist/index')
const PwmDriver = require('./src/Library/PwmDriver')// use this one in real use case
const Sleep = require('./src/Library/Sleep');

const pwm = new PwmDriver({ address: 0x40, device: '/dev/i2c-1', debug: false });

// Configure min and max servo pulse lengths 
// @50hz - 424 is 180 degrees of movement from 100 --- 100 = 0, 312 = 90, 524 = 180 --- 2.355555556 ticks per degree
// @100hz - 848 is 180 degrees of movement from 200 --- 200 = 0, 624 = 90, 1048 = 180 --- 4.711111111 ticks per degree
// @200hz - 1670 is 180 degrees of movement from 400 --- 400 = 0, 1235 = 90, 2070 = 180 --- 9.277777778 ticks per degree

const servo_min = 400; // 100 Min pulse length out of 4096
const servo_mid = 1235; // 313 Min pulse length out of 4096
const servo_max = 2070; // 525 Max pulse length out of 4096

pwm.setFrequency(200);

const loop = function () {
	return Sleep.seconds(1)
		.then(function () {
			console.log(servo_min);
			return pwm.setPulse(0, 0, servo_min)
		})
		.then(function () { return Sleep.seconds(1) })
		.then(function () {
			console.log(servo_mid);
			return pwm.setPulse(0, 0, servo_mid)
		})
		.then(function () { return Sleep.seconds(1) })
		.then(function () {
			console.log(servo_max)
			return pwm.setPulse(0, 0, servo_max)
		})
		.then(loop)
}

pwm.init()
	.then(() => Sleep.seconds(1))
	.then(loop);

