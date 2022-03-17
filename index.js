const fs = require('fs')
const Steno = require('./steno.js')

const modifierNames = ['unique', 'super', 'control', 'alt', 'shift']
const modifiers = {
	// marker, Super, Control, Alt, Shift
	left: ['STK', 'P', 'W', 'H', 'R'].map(Steno.parseStroke),
	right: ['LGT', '-P', '-B', '-F', '-R'].map(Steno.parseStroke)
}

const keys = {
	// Letters
	"A": "a", "PW": "b", "KR": "c", "TK": "d", "E": "e",
	"TP": "f", "TKPW": "g", "H": "h", "EU": "i", "AOEU": "i", "SKWR": "j",
	"K": "k", "HR": "l", "PH": "m", "TPH": "n", "O": "o",
	"P": "p", "KW": "q", "R": "r", "S": "s", "T": "t",
	"U": "u", "SR": "v", "W": "w", "KP": "x", "KWR": "y",
	"SWR": "z", "STKPW": "z",
	// Navigation
	"-P": "up", "-R": "left", "-B": "down", "-G": "right",
	"-RPG": "page_up", "-FBL": "page_down",
	"-FPL": "home", "-RBG": "end",
	"-RB": "return", "-PS": "print",
	"-F": "backspace", "-L": "delete", "-PBS": "insert",
	"-FR": "escape", "-LG": "tab",
	// Punctuation
	"-RP": "slash", "-FB": "backslash",
	"-RBGS": "comma", "-FPLT": "period",
	"-PG": "grave", "-BL": "apostrophe",
	"-PB": "semicolon",
	"-BG": "minus", "-PL": "equal",
	"-RPL": "bracketleft", "-FBG": "bracketright",
	// Numbers
	"6":   "7",   "7": "8",   "8": "9",
	"6R":  "4",  "7B": "5",  "8G": "6",
	"#-R": "1", "#-B": "2", "#-G": "3",
	"#U":  "0",
	// F-keys
	"A6": "F7", "A7": "F8", "A8": "F9",
	"A6R": "F4", "A7B": "F5", "A8G": "F6",
	"#AR": "F1", "#AB": "F2", "#AG": "F3",
	"#AU": "F10", "#AUR": "F11", "#AUB": "F12"
}

const extras = {
	"U6":   "70",  "U7": "80",  "U8": "90",
	"U6R":  "40", "U7B": "50", "U8G": "60",
	"#UR":  "10", "#UB": "20", "#UG": "30",

	"E6":   "700",  "E7": "800",  "E8": "900",
	"E6R":  "400", "E7B": "500", "E8G": "600",
	"#ER":  "100", "#EB": "200", "#EG": "300",
	"#E":   "00",
	"EU6":   "7000",  "EU7": "8000",  "EU8": "9000",
	"EU6R":  "4000", "EU7B": "5000", "EU8G": "6000",
	"#EUR":  "1000", "#EUB": "2000", "#EUG": "3000",
	"#EU":   "000",

	"-FL": "{#AudioRaiseVolume}", "-RG": "{#AudioLowerVolume}",
	"-PLT": "{#AudioMute}"
}

const combos = {}

function generateCombo(modifierChords, i, stroke, key) {
	stroke = [...modifierChords[0], ...stroke]
	let translation = key
	for(b=0; b<modifierChords.length-1; ++b) {
		if(i & 1<<b) {
			stroke.push(...modifierChords[b+1])
			if(translation !== '') translation = '('+translation+')'
			translation = modifierNames[b+1]+translation
		}
	}
	if(translation === '') return
	if(!/^[0-9]+$/.test(translation)) translation = '{#'+translation+'}'
	stroke = Steno.normalize(stroke)
	combos[Steno.strokeToString(stroke)] = translation
}

function generateCombos(stroke, side, key) {
	const m = modifiers[side]
	const N = 1 << m.length-1
	const i0 = /^[a-z]$/.test(key) ? 1 : 0
	for(let i=i0; i<N; ++i) generateCombo(m, i, stroke, key)
}

// Generate strokes for each individual modifier: at least super 
// (windows menu) and alt (application menus) are useful.
for(let i=0; i<modifiers.left.length-1; ++i) {
	generateCombo(modifiers.left, 1<<i, [], '')
}

// Generate modifier combos for all keys.
for(const steno in keys) {
	const key = keys[steno], stroke = Steno.parseStroke(steno)
	let modifierSide
	const pieces = Steno.splitStroke(stroke)
	const num = pieces[0][0] === '#'
	if(num) pieces[0].shift()
	// Don't switch these two `if` statements: we want vowels to
	// be fingerspelling chords and use the right-side modifiers.
	if(!num && pieces[2].length === 0) modifierSide = 'right'
	else if(pieces[0].length === 0) modifierSide = 'left'
	else throw new Error(keys[key]+" has keys on both sides")
	generateCombos(stroke, modifierSide, key)
}

// Generate special entries with just the left-hand starter.
for(const steno in extras) {
	const stroke = Steno.merge(steno, modifiers.left[0]) 
	combos[Steno.strokeToString(stroke)] = extras[steno]
}

fs.writeFileSync('combos.json', JSON.stringify(combos, null, '\t'))
