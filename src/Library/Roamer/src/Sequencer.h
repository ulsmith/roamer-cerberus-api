#ifndef Sequencer_h
#define Sequencer_h

#if ARDUINO >= 100
  #include <Arduino.h>
#else
  #include <WProgram.h>
#endif

#include <Leg.h>

class Sequencer{
	private:

	public:
		Sequencer(void);

		setup(void);
		reset(void);

		postureSit(void);
		postureCrab(void);
		postureWalk(void);
		postureRun(void);

		moveCrab(int sx, int sy);
		moveWalk(int sx, int sy);
		moveRun(int sx, int sy);

		driveCrab(int sx, int sy);
		driveWalk(int sx, int sy);
		driveRun(int sx, int sy);

		turnCrab(char d);
		turnWalk(char d);
		turnRun(char d);
};

#endif
