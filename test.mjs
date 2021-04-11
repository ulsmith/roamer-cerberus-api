import ServoDriver from './src/Library/ServoDriver.mjs';// use this one in real use case
import Sleep from './src/Library/Sleep.mjs';

const sd = new ServoDriver({ address: 0x40, device: '/dev/i2c-1', debug: false });

const loop = () => {
	return Sleep.seconds(1)
		.then(() => sd.setAngle(0, 0))
		.then(() => Sleep.seconds(1))
		.then(() => sd.setAngle(0, 45))
		.then(() => Sleep.seconds(1))
		.then(() => sd.setAngle(0, 90))
		.then(() => Sleep.seconds(1))
		.then(() => sd.setAngle(0, 135))
		.then(() => Sleep.seconds(1))
		.then(() => sd.setAngle(0, 180))
		.then(loop);
}

Sleep.seconds(1).then(loop);

