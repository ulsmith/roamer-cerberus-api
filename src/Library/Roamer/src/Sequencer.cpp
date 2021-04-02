#if ARDUINO >= 100
  #include <Arduino.h>
#else
  #include <WProgram.h>
#endif

#include <Leg.h>
#include <Orcha.h>
#include <Sequencer.h>

Leg * leftFront;
Leg * leftMiddle;
Leg * leftBack;
Leg * rightFront;
Leg * rightMiddle;
Leg * rightBack;

Orcha orcha;
OrcChain chain[12];

enum legs { rfs, rfm, rff, rms, rmm, rmf, rbs, rbm, rbf, lfs, lfm, lff, lms, lmm, lmf, lbs, lbm, lbf };

Sequencer::Sequencer(void) {
	// setup legs
	rightFront = new Leg(72, 125);
	rightFront->setPins(22, 24, 26);
	rightFront->setHomes(90, 90, 90);

	rightMiddle = new Leg(72, 125);
	rightMiddle->setPins(28, 30, 32);
	rightMiddle->setHomes(90, 90, 90);

	rightBack = new Leg(72, 125);
	rightBack->setPins(34, 36, 38);
	rightBack->setHomes(90, 90, 90);

	// apply leg joints to chain
	chain[rfs].orc = &rightFront->shoulder;
	chain[rfm].orc = &rightFront->main;
	chain[rff].orc = &rightFront->foot;
	chain[rms].orc = &rightMiddle->shoulder;
	chain[rmm].orc = &rightMiddle->main;
	chain[rmf].orc = &rightMiddle->foot;
	chain[rbs].orc = &rightBack->shoulder;
	chain[rbm].orc = &rightBack->main;
	chain[rbf].orc = &rightBack->foot;
}

Sequencer::setup(void) {
	// assign servos to chain
	orcha.assign(chain);
}

Sequencer::reset(void) {
	orcha.reset(chain);
}

Sequencer::postureSit() {
	ServoAngle a;

	// move to sit with should y moving last to stop drag
	a = rightFront->moveLeg(90, 0, 0);
	orcha.setStep(&chain[rfs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightMiddle->moveLeg(90, 0, 0);
	orcha.setStep(&chain[rms], a.shoulder, 200, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	a = rightBack->moveLeg(90, 0, 0);
	orcha.setStep(&chain[rbs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);
}

Sequencer::postureCrab() {
	ServoAngle a;
	
	// step odd legs to position above ground
	a = rightFront->moveLeg(90, 0, -40);
	orcha.setStep(&chain[rfs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightBack->moveLeg(90, 0, -40);
	orcha.setStep(&chain[rbs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// lower odd legs to position
	a = rightFront->moveLeg(90, 0, -90);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightBack->moveLeg(90, 0, -90);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// step even legs to position above ground
	a = rightMiddle->moveLeg(90, 0, -40);
	orcha.setStep(&chain[rms], a.shoulder, 200, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// lower even legs to position
	a = rightMiddle->moveLeg(90, 0, -90);
	orcha.setStep(&chain[rms], a.shoulder, 0, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);
}

Sequencer::postureWalk() {
	ServoAngle a;

	// step odd legs to position above ground
	a = rightFront->moveLeg(63, 63, -40);
	orcha.setStep(&chain[rfs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightBack->moveLeg(63, -63, -40);
	orcha.setStep(&chain[rbs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// lower odd legs to position
	a = rightFront->moveLeg(63, 63, -90);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightBack->moveLeg(63, -63, -90);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// step even legs to position above ground
	a = rightMiddle->moveLeg(90, 0, -40);
	orcha.setStep(&chain[rms], a.shoulder, 200, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// lower even legs to position
	a = rightMiddle->moveLeg(90, 0, -90);
	orcha.setStep(&chain[rms], a.shoulder, 0, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);
}

Sequencer::postureRun()
{
	ServoAngle a;

	// step odd legs to position above ground
	a = rightFront->moveLeg(63, 63, -100);
	orcha.setStep(&chain[rfs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightBack->moveLeg(63, -63, -100);
	orcha.setStep(&chain[rbs], a.shoulder, 200, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// lower odd legs to position
	a = rightFront->moveLeg(63, 63, -130);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightBack->moveLeg(63, -63, -130);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// step even legs to position above ground
	a = rightMiddle->moveLeg(90, 0, -100);
	orcha.setStep(&chain[rms], a.shoulder, 200, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// lower even legs to position
	a = rightMiddle->moveLeg(90, 0, -130);
	orcha.setStep(&chain[rms], a.shoulder, 0, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);
}

Sequencer::moveCrab(int sx, int sy)
{
	ServoAngle a;

	int csy = sy > 0 ? 15 + (sy * 2) : (sy < 0 ? -15 + (sy * 2) : 0);

	// move forward/back and up
	a = rightFront->moveLeg(90 + (sx * 10), csy, -40);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightMiddle->moveLeg(90 - (sx * 10), -csy, -40);
	orcha.setStep(&chain[rms], a.shoulder, 0, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	a = rightBack->moveLeg(90 + (sx * 10), csy, -40);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// move down and center
	a = rightFront->moveLeg(90, 0, -70);
	orcha.setStep(&chain[rfs], a.shoulder, 100, 100);
	orcha.setStep(&chain[rfm], a.main, 0, 100);
	orcha.setStep(&chain[rff], a.foot, 0, 100);
	a = rightMiddle->moveLeg(90, 0, -70);
	orcha.setStep(&chain[rms], a.shoulder, 100, 100);
	orcha.setStep(&chain[rmm], a.main, 0, 100);
	orcha.setStep(&chain[rmf], a.foot, 0, 100);
	a = rightBack->moveLeg(90, 0, -70);
	orcha.setStep(&chain[rbs], a.shoulder, 100, 100);
	orcha.setStep(&chain[rbm], a.main, 0, 100);
	orcha.setStep(&chain[rbf], a.foot, 0, 100);
	orcha.play(chain, 1, 0);

	// forward/back full way
	a = rightFront->moveLeg(90 - (sx * 10), -csy, -70);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rfm], a.main, 100, 100);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightMiddle->moveLeg(90 + (sx * 10), csy, -70);
	orcha.setStep(&chain[rms], a.shoulder, 0, 200);
	orcha.setStep(&chain[rmm], a.main, 100, 100);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	a = rightBack->moveLeg(90 - (sx * 10), -csy, -70);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rbm], a.main, 100, 100);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);
}

Sequencer::moveWalk(int sx, int sy)
{
	ServoAngle a;

	// move forward/back and up
	a = rightFront->moveLeg(63 + (sx * 10), 63 +(sy * 10), -40);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rfm], a.main, 0, 200);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightMiddle->moveLeg(90 - (sx * 10), -(sy * 10), -40);
	orcha.setStep(&chain[rms], a.shoulder, 0, 200);
	orcha.setStep(&chain[rmm], a.main, 0, 200);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	a = rightBack->moveLeg(63 + (sx * 10), -63 + (sy * 10), -40);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rbm], a.main, 0, 200);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);

	// move down and center
	a = rightFront->moveLeg(63, 63, -70);
	orcha.setStep(&chain[rfs], a.shoulder, 100, 100);
	orcha.setStep(&chain[rfm], a.main, 0, 100);
	orcha.setStep(&chain[rff], a.foot, 0, 100);
	a = rightMiddle->moveLeg(90, 0, -70);
	orcha.setStep(&chain[rms], a.shoulder, 100, 100);
	orcha.setStep(&chain[rmm], a.main, 0, 100);
	orcha.setStep(&chain[rmf], a.foot, 0, 100);
	a = rightBack->moveLeg(63, -63, -70);
	orcha.setStep(&chain[rbs], a.shoulder, 100, 100);
	orcha.setStep(&chain[rbm], a.main, 0, 100);
	orcha.setStep(&chain[rbf], a.foot, 0, 100);
	orcha.play(chain, 1, 0);

	// forward/back full way
	a = rightFront->moveLeg(63 - (sx * 10), 63 + -(sy * 10), -70);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rfm], a.main, 100, 100);
	orcha.setStep(&chain[rff], a.foot, 0, 200);
	a = rightMiddle->moveLeg(90 + (sx * 10), (sy * 10), -70);
	orcha.setStep(&chain[rms], a.shoulder, 0, 200);
	orcha.setStep(&chain[rmm], a.main, 100, 100);
	orcha.setStep(&chain[rmf], a.foot, 0, 200);
	a = rightBack->moveLeg(63 - (sx * 10), -63 + -(sy * 10), -70);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 200);
	orcha.setStep(&chain[rbm], a.main, 100, 100);
	orcha.setStep(&chain[rbf], a.foot, 0, 200);
	orcha.play(chain, 1, 0);
}

Sequencer::moveRun(int sx, int sy)
{
	ServoAngle a;

	// move forward/back and up
	a = rightFront->moveLeg(63 + (sx * 10), 63 + (sy * 10), -100);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 100);
	orcha.setStep(&chain[rfm], a.main, 0, 100);
	orcha.setStep(&chain[rff], a.foot, 0, 100);
	a = rightMiddle->moveLeg(90 - (sx * 10), -(sy * 10), -100);
	orcha.setStep(&chain[rms], a.shoulder, 0, 100);
	orcha.setStep(&chain[rmm], a.main, 0, 100);
	orcha.setStep(&chain[rmf], a.foot, 0, 100);
	a = rightBack->moveLeg(63 + (sx * 10), -63 + (sy * 10), -100);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 100);
	orcha.setStep(&chain[rbm], a.main, 0, 100);
	orcha.setStep(&chain[rbf], a.foot, 0, 100);
	orcha.play(chain, 1, 0);

	// move down and center
	a = rightFront->moveLeg(63, 63, -130);
	orcha.setStep(&chain[rfs], a.shoulder, 50, 50);
	orcha.setStep(&chain[rfm], a.main, 0, 50);
	orcha.setStep(&chain[rff], a.foot, 0, 50);
	a = rightMiddle->moveLeg(90, 0, -130);
	orcha.setStep(&chain[rms], a.shoulder, 50, 50);
	orcha.setStep(&chain[rmm], a.main, 0, 50);
	orcha.setStep(&chain[rmf], a.foot, 0, 50);
	a = rightBack->moveLeg(63, -63, -130);
	orcha.setStep(&chain[rbs], a.shoulder, 50, 50);
	orcha.setStep(&chain[rbm], a.main, 0, 50);
	orcha.setStep(&chain[rbf], a.foot, 0, 50);
	orcha.play(chain, 1, 0);

	// forward/back full way
	a = rightFront->moveLeg(63 - (sx * 10), 63 + -(sy * 10), -130);
	orcha.setStep(&chain[rfs], a.shoulder, 0, 100);
	orcha.setStep(&chain[rfm], a.main, 50, 50);
	orcha.setStep(&chain[rff], a.foot, 0, 100);
	a = rightMiddle->moveLeg(90 + (sx * 10), (sy * 10), -130);
	orcha.setStep(&chain[rms], a.shoulder, 0, 100);
	orcha.setStep(&chain[rmm], a.main, 50, 50);
	orcha.setStep(&chain[rmf], a.foot, 0, 100);
	a = rightBack->moveLeg(63 - (sx * 10), -63 + -(sy * 10), -130);
	orcha.setStep(&chain[rbs], a.shoulder, 0, 100);
	orcha.setStep(&chain[rbm], a.main, 50, 50);
	orcha.setStep(&chain[rbf], a.foot, 0, 100);
	orcha.play(chain, 1, 0);
}

Sequencer::driveCrab(int sx, int sy)
{
}

Sequencer::driveWalk(int sx, int sy)
{
}

Sequencer::driveRun(int sx, int sy)
{
}

Sequencer::turnCrab(char d)
{
}

Sequencer::turnWalk(char d)
{
}

Sequencer::turnRun(char d)
{
}

// Sequencer::crabForward(byte amount, byte speed) {
// 	ServoAngle a;

// 	// move forward and up
// 	a = rightFront->moveLeg(90, amount, -40);
// 	orcha.setStep(&chain[rfs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rfm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rff], a.foot, 0, 200 * speed);
// 	a = rightMiddle->moveLeg(90, -amount, -40);
// 	orcha.setStep(&chain[rms], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rmm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rmf], a.foot, 0, 200 * speed);
// 	a = rightBack->moveLeg(63, amount, -40);
// 	orcha.setStep(&chain[rbs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rbm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rbf], a.foot, 0, 200 * speed);
// 	orcha.play(chain, 1, 0);

// 	// move down and back half way
// 	a = rightFront->moveLeg(90, 0, -70);
// 	orcha.setStep(&chain[rfs], a.shoulder, 100, 100 * speed);
// 	orcha.setStep(&chain[rfm], a.main, 0, 100 * speed);
// 	orcha.setStep(&chain[rff], a.foot, 0, 100 * speed);
// 	a = rightMiddle->moveLeg(90, 0, -70);
// 	orcha.setStep(&chain[rms], a.shoulder, 100, 100 * speed);
// 	orcha.setStep(&chain[rmm], a.main, 0, 100 * speed);
// 	orcha.setStep(&chain[rmf], a.foot, 0, 100 * speed);
// 	a = rightBack->moveLeg(90, 0, -70);
// 	orcha.setStep(&chain[rbs], a.shoulder, 100, 100 * speed);
// 	orcha.setStep(&chain[rbm], a.main, 0, 100 * speed);
// 	orcha.setStep(&chain[rbf], a.foot, 0, 100 * speed);
// 	orcha.play(chain, 1, 0);

// 	// back full way
// 	a = rightFront->moveLeg(90, -amount, -70);
// 	orcha.setStep(&chain[rfs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rfm], a.main, 100 * speed, 100 * speed);
// 	orcha.setStep(&chain[rff], a.foot, 0, 200 * speed);
// 	a = rightMiddle->moveLeg(90, amount, -70);
// 	orcha.setStep(&chain[rms], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rmm], a.main, 100 * speed, 100 * speed);
// 	orcha.setStep(&chain[rmf], a.foot, 0, 200 * speed);
// 	a = rightBack->moveLeg(90, -amount, -70);
// 	orcha.setStep(&chain[rbs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rbm], a.main, 100 * speed, 100 * speed);
// 	orcha.setStep(&chain[rbf], a.foot, 0, 200 * speed);
// 	orcha.play(chain, 1, 0);
// }

// Sequencer::step(byte speed) {
// 	ServoAngle a;

// 	// move forward and up
// 	a = rightFront->moveLeg(63, 63, -70);
// 	orcha.setStep(&chain[rfs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rfm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rff], a.foot, 0, 200 * speed);
// 	a = rightMiddle->moveLeg(90, 0, -70);
// 	orcha.setStep(&chain[rms], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rmm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rmf], a.foot, 0, 200 * speed);
// 	a = rightBack->moveLeg(63, -63, -70);
// 	orcha.setStep(&chain[rbs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rbm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rbf], a.foot, 0, 200 * speed);
// 	orcha.play(chain, 1, 0);
// }

// Sequencer::stepForward(byte amount, byte speed) {
// 	ServoAngle a;

// 	// move forward and up
// 	a = rightFront->moveLeg(63, 63 + amount, -40);
// 	orcha.setStep(&chain[rfs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rfm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rff], a.foot, 0, 200 * speed);
// 	a = rightMiddle->moveLeg(90, 0 + -amount, -40);
// 	orcha.setStep(&chain[rms], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rmm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rmf], a.foot, 0, 200 * speed);
// 	a = rightBack->moveLeg(63, -63 + amount, -40);
// 	orcha.setStep(&chain[rbs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rbm], a.main, 0, 200 * speed);
// 	orcha.setStep(&chain[rbf], a.foot, 0, 200 * speed);
// 	orcha.play(chain, 1, 0);

// 	// move down and back half way
// 	a = rightFront->moveLeg(63, 63, -70);
// 	orcha.setStep(&chain[rfs], a.shoulder, 100, 100 * speed);
// 	orcha.setStep(&chain[rfm], a.main, 0, 100 * speed);
// 	orcha.setStep(&chain[rff], a.foot, 0, 100 * speed);
// 	a = rightMiddle->moveLeg(90, 0, -70);
// 	orcha.setStep(&chain[rms], a.shoulder, 100, 100 * speed);
// 	orcha.setStep(&chain[rmm], a.main, 0, 100 * speed);
// 	orcha.setStep(&chain[rmf], a.foot, 0, 100 * speed);
// 	a = rightBack->moveLeg(63, -63, -70);
// 	orcha.setStep(&chain[rbs], a.shoulder, 100, 100 * speed);
// 	orcha.setStep(&chain[rbm], a.main, 0, 100 * speed);
// 	orcha.setStep(&chain[rbf], a.foot, 0, 100 * speed);
// 	orcha.play(chain, 1, 0);

// 	// back full way
// 	a = rightFront->moveLeg(63, 63 + -amount, -70);
// 	orcha.setStep(&chain[rfs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rfm], a.main, 100 * speed, 100 * speed);
// 	orcha.setStep(&chain[rff], a.foot, 0, 200 * speed);
// 	a = rightMiddle->moveLeg(90, 0 + amount, -70);
// 	orcha.setStep(&chain[rms], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rmm], a.main, 100 * speed, 100 * speed);
// 	orcha.setStep(&chain[rmf], a.foot, 0, 200 * speed);
// 	a = rightBack->moveLeg(63, -63 + -amount, -70);
// 	orcha.setStep(&chain[rbs], a.shoulder, 0, 200 * speed);
// 	orcha.setStep(&chain[rbm], a.main, 100 * speed, 100 * speed);
// 	orcha.setStep(&chain[rbf], a.foot, 0, 200 * speed);
// 	orcha.play(chain, 1, 0);
// }

// NOTE:
// thi sis the positions for sit, x, y, z on side leg
// it should also be the home i think!
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
