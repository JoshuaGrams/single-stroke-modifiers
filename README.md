Single-stroke Navigation and Modifier-key Combos
================================================

This is sort of a blend between Ted Morin's excellent [cross
platform movement][1] dictionary and codepoke's [single stroke
commands][2] dictionary.

I've been using since I made it in February of 2020 and I'm pretty
happy with it. I just (mid-March 2022) updated it to add the ten
punctuation-only keys on a QWERTY keyboard, volume up/down/mute,
PrintScreen and Insert keys, along with switching numbers to use
[Aerick's right-hand numpad system][3]. There might be some more
media or other special keys that I could add, but for my purposes
I think it's complete now.

[1]: http://www.openstenoproject.org/stenodict/dictionaries/cross_platform_movement.html
[2]: https://familyhoodchurch.blogspot.com/2019/06/single-stroke-commands.html
[3]: https://github.com/aerickt/steno-dictionaries/#rh-numpadjson

It uses `STK` to indicate a navigation command on the right, and
then `P/W/H/R` are Super, Control, Alt, and Shift, respectively.
You can use these by themselves to press and release the bare
modifier (e.g. Super to open the Windows menu, Alt to toggle
application menus).

This is mirrored on the right by `-LGT`, and `-P/-B/-F/-R` are
Super/Control/Alt/Shift. Combine this with a fingerspelt letter
for key combos. I did __not__ define these alone: they only work
as part of a combo.

The navigation commands are extended from Ted's dictionary:

* `-R`, `-P`, `-B`, `-G` are arrow keys: left/up/down/right.
* `-F` and `-L` are Backspace and Delete (upper diagonals).
* `-RPG` and `-FBL` are page-up and page-down (upward and downward facing triangles).
* `-FPL` and `-RBG` are Home and End (all up, all down).
* `-FR` and `-LG` are Escape and Tab (both left, both right).
* `-RB` is Enter (down and left, like the return arrow).
* `-PS` is PrintScreen, `-PBS` (`-NS`) is Insert.

Some of the punctuation makes sense, some is arbitrary (note that
these are the raw keys: you get the other symbol by adding shift):

* `-RP` is forward slash, `-FB` is backslash.
* `-BL` is apostrophe, `-PG` is backtick.
* `-FPLT` is period, `-RBGS` is comma.
* `-PB` is semicolon.
* `-BG` is minus, `-PL` is the equals sign.
* `-RPL` is left square bracket, `-FBG` is right square bracket.

The RH numpad uses the number key/bar along with:

* `-F/-P/-L` = 7 8 9
* `-FR/-PB/-LG` = 4 5 6
* `-R/-B/-G` = 1 2 3
* `U` = 0

Again, adding Shift will give you the punctuation above the number
on that key.

Adding `U` to another number tacks a zero on the end, `E` adds 00,
and `EU` adds 000.

The F-keys are given by adding `A` to the numbers 1 through 12
(`#AU/#AUR/#AUB` are F10-F12).

Volume up/down are `-FL` and `-RG`, while Mute is `-PLT`.

-----

It only has 11 conflicts with `main.json`, several of which are
misstrokes:

* `STKP`: {#super} vs. "and"
* `ABLGT`: {#control(a)} vs. "act"
* `TPH-FPBLGT`: {#alt(control(super(n)))} vs. "income{.}"
* `OFPBLGT`: {#alt(control(super(o)))} vs. "okay{.}"
* `ORPBLGT`: {#shift(control(super(o)))} vs. "originality"
* `URPBLGT`: {#shift(control(super(u)))} vs. "urgent"
* `W-BLGT`: {#control(w)} vs. "WebCT"
* `STKPW-G`: {#control(super(right))} conflicts with "is going"
* `STK-RB`: {#return} vs. "--"
* `STK-RBGS`: {#comma} vs. "{&Z}"
* `STKPWHR-FPLT`: {#shift(alt(control(super(period))))} vs. "{!}"

-----

`index.js` is the code that generates the dictionary. It could
easily be adapted to run in a web browser, but for now you'll need
Node.js to run it.
