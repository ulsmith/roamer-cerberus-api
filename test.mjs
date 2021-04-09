import ServoDriver from './src/Library/ServoDriver.mjs';// use this one in real use case
import Sleep from './src/Library/Sleep.mjs';

const sd = new ServoDriver({ address: 0x40, device: '/dev/i2c-1', debug: false });

const servo_min = 400; // 100 Min pulse length out of 4096
const servo_mid = 1235; // 313 Min pulse length out of 4096
const servo_max = 2070; // 525 Max pulse length out of 4096

sd.setFrequency(200);

const loop = function () {
	return Sleep.seconds(1)
		.then(function () {
			console.log(servo_min);
			return sd.setPulse(0, 0, servo_min)
		})
		.then(function () { return Sleep.seconds(1) })
		.then(function () {
			console.log(servo_mid);
			return sd.setPulse(0, 0, servo_mid)
		})
		.then(function () { return Sleep.seconds(1) })
		.then(function () {
			console.log(servo_max)
			return sd.setPulse(0, 0, servo_max)
		})
		.then(loop)
}

sd.init()
	.then(() => Sleep.seconds(1))
	.then(loop);

