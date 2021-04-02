/*
  Roamer.h
*/

// include this library's description file
#include <Roamer.h>
#include <Com.h>

Com com;

Roamer::Roamer(void) {}

void Roamer::start(void) {
	com.start();
}

void Roamer::ping(void) {
	com.readInput();
}
