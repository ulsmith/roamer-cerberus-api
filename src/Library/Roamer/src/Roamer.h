/*
  Roamer.h - Roamer library for Wiring - description
  Copyright (c) 2006 John Doe.  All right reserved.
*/

// ensure this library description is only included once
#ifndef Roamer_h
#define Roamer_h

// library interface description
class Roamer
{
	// user-accessible "public" interface
	public:
		Roamer(void);
		void start(void);
		void ping(void);
};

#endif
