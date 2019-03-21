/*Inputs
0-Pc is slow
1-No image Computer starts no beep
2-No image Computer starts beeps
3-No image Computer does not starts
4-PC wont boot
5-Bars on screen
6-Fans speed up
7-Usb not recognised
8-Computer keeps restartng
9-peripherals aren't working  properly
10-Commands not working
11-Internet slow
12-Computer freezes
13-PC blue screen of death
14-Corrupt files or long delays accessing files
15-Sudden shut off…or sudden anything weird
16-Unusual noises
17-Clicking sound

Outputs
0-Severity
1-Motherboard
2-CPU
3-Video Card
4-Ram cards
5-HDD
6-OS
7-Drivers
8-BIOS
9-Clean Up
10-PSU
*/

var data=[{inp:["Computer freezes"],outp:["Ram cards"]},
		  {inp:["Unusual noises"],outp:["HDD"]},
		  {inp:["PC blue screen of death"],outp:["Ram cards"]},
		  {inp:["Ma doare in cot"],outp:["Racit"]},


];