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

#if ARDUINO >= 100
  #include <Arduino.h>
#else
  #include <WProgram.h>
#endif

#include <Leg.h>
#include <Kinematics.h>

// leg lengths closest to shoulder then foot
// orientation degress rotation as 0 (right middle) 45 = rb, 135 = lb and so on CW
Leg::Leg(unsigned int len1, unsigned int len2) {
	this->k = new Kinematics(len1, len2);
}

Leg::setPins(byte shoulder, byte main, byte foot) {
	this->shoulder.pin = shoulder;
	this->main.pin = main;
	this->foot.pin = foot;
}

Leg::setHomes(byte shoulder, byte main, byte foot) {
	this->shoulder.home = shoulder;
	this->main.home = main;
	this->foot.home = foot;
}

ServoAngle Leg::moveLeg(float x, float y, float z) {
	this->k->moveToPosition(x, y, z);
	Angle a = this->k->getAngles();

	return {
		(byte)(90 - a.theta3),
		(byte)(180 - (a.theta1 < -45 ? 225 + a.theta1 : 45 + a.theta1)),
		(byte)(10 - a.theta2)
	};
}