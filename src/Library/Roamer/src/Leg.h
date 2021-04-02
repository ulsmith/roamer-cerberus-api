#ifndef Leg_h
#define Leg_h

#if ARDUINO >= 100
  #include <Arduino.h>
#else
  #include <WProgram.h>
#endif

#include <Kinematics.h>
#include <Orcha.h>

struct ServoAngle {
	byte shoulder;
	byte main;
	byte foot;
};

class Leg{
	private:
		Kinematics * k;

	public:
		Leg(unsigned int len1, unsigned int len2);
		setPins(byte shoulder, byte main, byte home);
		setHomes(byte shoulder, byte main, byte home);
		ServoAngle moveLeg(float x, float y, float z);

		Orc shoulder;
		Orc main;
		Orc foot;
};

#endif
