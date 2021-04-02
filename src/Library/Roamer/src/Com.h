/*
  Com.h - Com library for Wiring - description
  Copyright (c) 2006 John Doe.  All right reserved.
*/

// ensure this library description is only included once
#ifndef Com_h
#define Com_h

#include <Arduino.h>

// library interface description
class Com
{
	// user-accessible "public" interface
	public:
		Com();
		void start(void);
		void readInput(void);
		bool runCommand(String parts [5]);

		bool doPosture(char p);
		bool doMove(char p, int sx, int sy);
		bool doDrive(char p, int sx, int sy);
		bool doTurn(char p, char d);

		bool help(char a);
		bool helpStep(void);
		bool helpWalk(void);
};

#endif
