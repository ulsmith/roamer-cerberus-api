/*
  Com.h - Com library for Wiring - implementation
  Copyright (c) 2006 John Doe.  All right reserved.
*/

// include this library's description file
#include <Com.h>
#include <Sequencer.h>
#include <Arduino.h>

Sequencer sequencer;
String part = "";
String parts[5];
byte partKey = 0;
bool lock;

Com::Com() {}

void Com::start(void)
{
	Serial.begin(9600);
	sequencer.setup();
	sequencer.reset();
}

void Com::readInput(void)
{
	// input coming in, process and do command
	while (Serial.available() > 0)
	{
		char inchar = Serial.read();
		if (inchar == '\n') {
			// process command
			parts[partKey] = part;
			lock = runCommand(parts);
			part = "";
			partKey = 0;

			// clear if not locked
			if (!lock) {
				for (int i = 0; i <= 4; i++) parts[i] = "";
			}
			
			return;
		} else if (inchar == ' ') {
			parts[partKey] = part;
			part = "";
			partKey++;
		}
		else part += inchar;
	}

	// continous movement (locked) do again (will stop when a none locking command is recieved)
	if (lock) {
		lock = runCommand(parts);

		// clear if not locked
		if (!lock) {
			for (int i = 0; i <= 4; i++) parts[i] = "";
		}
	}
}

bool Com::runCommand(String parts [5])
{
	char action = parts[0].charAt(0);

	switch (action) {
		case '?': return help(parts[1].charAt(0));
		case '!': return false;
		case 'p': return doPosture(parts[1].charAt(0));
		case 'm': return doMove(parts[1].charAt(0), parts[2].toInt(), parts[3].toInt());
		case 'd': return doDrive(parts[1].charAt(0), parts[2].toInt(), parts[3].toInt());
		case 't': return doTurn(parts[1].charAt(0), parts[2].charAt(0));
		default:
			Serial.println("e");
			return false;
	}
}

bool Com::doPosture(char p)
{
	switch (p) {
		case 's': sequencer.postureSit(); break;
		case 'c': sequencer.postureCrab(); break;
		case 'w': sequencer.postureWalk(); break;
		case 'r': sequencer.postureRun(); break;
		default: Serial.println("e p ! s,c,w,r\n");
	}

	return false;
}

bool Com::doMove(char p, int sx, int sy)
{	
	String e;
	
	if (sx > 3) e = "e sx > 3\n";
	else if (sx < -3) e = "e sx < -3\n";
	else if (sy > 3) e = "e sy > 3\n";
	else if (sy < -3) e = "e sy < -3\n";

	Serial.print("DEBUG0:");
	Serial.print(e);
	Serial.println("\n");

	if (e.length() > 0) {
		Serial.println(e);
		return false;
	}

	Serial.print("DEBUG1:");
	Serial.print(p);
	Serial.print(":");
	Serial.print(sx);
	Serial.print(":");
	Serial.print(sy);
	Serial.println("\n");

	switch (p) {
		case 'c': sequencer.moveCrab(sx, sy); break;
		case 'w': sequencer.moveWalk(sx, sy); break;
		case 'r': sequencer.moveRun(sx, sy); break;
		default: 
			Serial.println("e p ! c,w,r\n");
			return false;
	}

	// keep moving until stopped!
	return true;
}

bool Com::doDrive(char p, int sx, int sy)
{
	String e;
	
	if (sx > 3) e = "e sx > 3\n";
	else if (sx < -3) e = "e sx < -3\n";
	else if (sy > 3) e = "e sy > 3\n";
	else if (sy < -3) e = "e sy < -3\n";

	if (e.length() > 0) {
		Serial.println("e sx > 3\n");
		return false;
	}

	switch (p) {
		case 'c': sequencer.driveCrab(sx, sy); break;
		case 'w': sequencer.driveWalk(sx, sy); break;
		case 'r': sequencer.driveRun(sx, sy); break;
		default: 
			Serial.println(e);
			return false;
	}

	// keep moving until stopped!
	return true;
}

bool Com::doTurn(char p, char d)
{
	String e;
	
	if (d != 'l' && d != 'r') e = "e d ! l,r\n";

	if (e.length() > 0) {
		Serial.println(e);
		return false;
	}

	switch (p) {
		case 'c': sequencer.turnCrab(d); break;
		case 'w': sequencer.turnWalk(d); break;
		case 'r': sequencer.turnRun(d); break;
		default: 
			Serial.println("e p ! c,w,r\n");
			return false;
	}

	// keep moving until stopped!
	return true;
}

bool Com::help(char a)
{
	switch (a) {
		case 's': return helpStep();
		case 'w': return helpWalk();
		default:
			Serial.println("ROAMer Help > send '? action' actions: s, w\n");
			return false;
	}
}

bool Com::helpStep(void)
{
	Serial.println("step: s X Y\n");
	return false;
}

bool Com::helpWalk(void)
{
	Serial.println("walk: w X Y\n");
	return false;
}