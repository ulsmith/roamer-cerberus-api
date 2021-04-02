# ROAMer Kernel

C++ Arduino kernel for mega2560

ROAMer Remote Obeservation And Manipulation device kernel.

Use roamer-cerberus-api to talk to kernel and roamer-ui to talk to API

Requires the Orcha orchastration library for servo manipulation (arduino-orcha) https://github.com/ulsmith/arduino-orcha
Requires the Kinematics library for angle calculations https://www.arduino.cc/reference/en/libraries/kinematics/

## Introducation

## Setup

```cpp
#include <Roamer.h>

Roamer roamer;
boolean ready;

void setup() {
	roamer.start();
	ready = true;
	delay(2000);
}

void loop() {
	if (!ready) return;
	roamer.ping();
}
```