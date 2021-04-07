# ROAMer API

CerberusMVC (Express Clustered Process)...

ROAMer Remote Obeservation And Manipulation device API. REST API for talking to roamer.

This is the APi that sits ont eh raspberry pi, connecting us to the bot, running an arduino kernel.

## Introducation

## Setup

npm install roamer-cerberus-api --save

## Run

npm run serve

## Test

npm test

## NOTES

Raspberry Pi Setup
$ sudo vi /etc/modules
Add these two lines

i2c-bcm2708 
i2c-dev
$ sudo vi /etc/modprobe.d/raspi-blacklist.conf
Comment out blacklist i2c-bcm2708

#blacklist i2c-bcm2708
Load kernel module

$ sudo modprobe i2c-bcm2708
$ sudo modprobe i2c-dev
Make device writable

sudo chmod o+rw /dev/i2c*
Install gcc 4.8 (required for Nan)

sudo apt-get install gcc-4.8 g++-4.8
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
sudo update-alternatives --config gcc 
 
Set correct device for version

 
new i2c(address, device: '/dev/i2c-0') // rev 1
new i2c(address, device: '/dev/i2c-1') // rev 2