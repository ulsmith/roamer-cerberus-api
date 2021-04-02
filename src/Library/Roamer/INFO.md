# Messages

The message responses from ROAMer.

## Error

### Move

* [e m x > 100] - Cannot move x more than 100mm [error] out of bounds >>> send '? m\\n' for help.
* [e m y < -100] - Cannot move x less than -100mm [error] out of bounds >>> send '? m\\n' for help.
* [e m y > 100] - Cannot move y more than 100mm [error] out of bounds >>> send '? m\\n' for help.
* [e m y < -100] - Cannot move y less than -100mm [error] out of bounds >>> send '? m\\n' for help.

### Turn

* [e t > 360] - Cannot turn more than 360 degrees clockwise [error] out of bounds >>> send '? t\\n' for help.
* [e t < -360] - Cannot turn more less -360 degrees anti-clockwise [error] out of bounds >>> send '? t\\n' for help.

### Gait

* [e g ! r t] - Only types (r)ipple and (t)ripod existing [error] incorrect type >>> send '? g\\n' for help.

### Balance

* [e b p > 360] - Cannot turn pitch more than 360 degrees clockwise [error] out of bounds >>> send '? b\\n' for help."
* [e b r > 360] - Cannot turn roll more than 360 degrees clockwise [error] out of bounds >>> send '? b\\n' for help."
* [e b y > 360] - Cannot turn yaw more than 360 degrees clockwise [error] out of bounds >>> send '? b\\n' for help."
* [e b p < -360] - Cannot turn pitch less than -360 degrees clockwise [error] out of bounds >>> send '? b\\n' for help."
* [e b r < -360] - Cannot turn roll less than -360 degrees clockwise [error] out of bounds >>> send '? b\\n' for help."
* [e b y < -360] - Cannot turn yaw less than -360 degrees clockwise [error] out of bounds >>> send '? b\\n' for help."


### Speed

* [e s ! i d s] - Only types (i)ncrease, (d)ecrease and (s)et existing [error] incorrect type >>> send '? s\\n' for help.
* [e s s > 254] - Cannot set step more than 254 [error] out of bounds >>> send '? s\\n' for help.
* [e s s < 1] - Cannot set step less than 1 [error] out of bounds >>> send '? s\\n' for help.

### Height

* [e h ! i d s] - Only types (i)ncrease, (d)ecrease and (s)et existing [error] incorrect type >>> send '? h\\n' for help.
* [e h s > 254] - Cannot set step more than 254 [error] out of bounds >>> send '? s\\n' for help.
* [e h s < 1] - Cannot set step less than 1 [error] out of bounds >>> send '? s\\n' for help.

### Foot Distance

* [e f ! i d s] - Only types (i)ncrease, (d)ecrease and (s)et existing [error] incorrect type >>> send '? f\\n' for help.
* [e f s > 254] - Cannot set step more than 254 [error] out of bounds >>> send '? f\\n' for help.
* [e f s < 1] - Cannot set step less than 1 [error] out of bounds >>> send '? f\\n' for help.

### Calibrate

* [e c l ! 0-5] - Cannot calibrate leg, only have five, use 0-5 for leg [error] out of bounds >>> send '? c\\n' for help.
* [e c p ! l m u] - Cannot calibrate leg, leg part must be (l)ower, (m)iddle or (u)pper [error] out of bounds >>> send '? c\\n' for help.
* [e c a ! 0-120 255] - Cannot calibrate leg, amount must be 0-120 or 255 to confirm last message [error] out of bounds >>> send '? c\\n' for help.
* [e l ! e w i d] - Cannot change log type, only types (e)rror, (w)warning/error, (i)nfo/warning/error and (d)ebug/info/warning/error exist [error] incorrect type >>> send '? l\\n' for help. 

### Message

* [e] - Message incorrect format

## Help

### Move

--------------------
Move: 
--------------------
m X Y
Move X, Y with selected gait.
X: distance forward in mm.
Y: distance left side in mm.
Example Command (terminated with new line character):
m 30 -20

### Turn

--------------------
Turn
--------------------
t Angle
Turn with selected gait
Angle: degrees with one decimal, positive CW, negative ACW.
Example Command (terminated with new line character):
t -150

### Gait

g Type
Choose type of gait
Type: t (tripod)
Type: r (ripple)
Example Command (terminated with new line character):
g t
Serial.println();

### Balance 

--------------------
Balance
--------------------
b Pitch Roll Yaw
Balance change without moving.
Pitch: angle in degrees with one decimal, positive CW, negative ACW.
Roll: angle in degrees with one decimal, positive CW, negative ACW.
Yaw: angle in degrees with one decimal, positive CW, negative ACW.
Example Command (terminated with new line character):
b -10 -5 12.5

### Speed

--------------------
Speed
--------------------
s Type [Amount]
Change speed of ROAMer movements.
Type: i (Increase speed)
Type: d (decrease speed)
Type: s (increase/decrease step size)
Amount: Size of step in mm (optional)
Example Command (terminated with new line character):
s i
s s 30

### Height

--------------------
Height
--------------------
h Type [Amount]
Change height of ROAMer.
Type: i (Increase height)
Type: d (decrease height)
Type: s (increase/decrease step size)
Amount: Size of step in mm (optional)
Example Command (terminated with new line character):
h d
h s 30

### Foot Distance

--------------------
Foot Distance
--------------------
f Type [Amount]
Change foot distance of ROAMer.
Type: i (Increase distance)
Type: d (decrease distance)
Type: s (increase/decrease step size)
Amount: Size of step in mm (optional)
Example Command (terminated with new line character):
f i
f s 30

### Calibrate

--------------------
Calibrate
--------------------
c Leg Part Amount
Calibrate the starting servo position of leg parts.
Leg: 0 number of the leg from 0-5.
Part: l Part of the leg as lower.
Part: m Part of the leg as middle.
Part: u Part of the leg as upper.
Amount: 40 The amount to set as position from 0-120.
Amount: 255 To confirm the previous calibration.
Example Command (terminated with new line character):
c 0 m 20
c 0 m 255

### Log

--------------------
Log
--------------------
l Type
Change log type pushed back from ROAMer.
Type: e Error logs
Type: w Error and warning logs
Type: i Error, warning and info logs
Type: d Error, warning, info and debug logs
Example Command (terminated with new line character):
l w