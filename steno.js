const Steno = module.exports

let left = true
Steno.order = [..."#S1T2KP3WH4RA5O0-*EUF6RP7BL8GT9SDZ"].map(k => {
	if(left || /[0-9]/.test(k)) {
		if(k === 'U') left = false
		return k
	} else return '-'+k
})

Steno.index = {}
for(let i=0; i<Steno.order.length; ++i) {
	Steno.index[Steno.order[i]] = i
}

Steno.middle = [...'AO*EU']
Steno.fromDigit = ['O','S','T','P','H','A','-F','-P','-L','-T']
Steno.toDigit = {}; 
Steno.fromDigit.forEach((k,d) => Steno.toDigit[k] = d)

function escapeRegexSpecialChar(ch) {
	// XXX woefully incomplete
	if(ch === '*' || ch === '-') ch = '\\' + ch
	return ch
}

Steno.RE = new RegExp('^(' + Steno.order.map(k => escapeRegexSpecialChar(k.substr(-1))).join(')?(') + ')?$')
Steno.middleRE = new RegExp('^['+Steno.middle.map(k => escapeRegexSpecialChar(k.substr(-1))).join('')+']')

Steno.parseStroke = function(stroke) {
	if(Array.isArray(stroke)) return stroke
	const keys = []
	if(/[0-9]/.test(stroke)) keys.push('#')
	const m = Steno.RE.exec(stroke)
	if(m == null) return false
	if(m) for(let i=1; i<m.length; ++i) {
		if(m[i] == null || m[i] === '-') continue
		if(/^[0-9]$/.test(m[i])) keys.push(Steno.order[i-2])
		else keys.push(Steno.order[i-1])
	}
	return keys
}

Steno.parse = function(outline) {
	const parsed = outline.split('/').map(Steno.parseStroke)
	if(parsed.includes(false)) return false
	else return parsed
}

Steno.strokeToString = function(keys) {
	if(!Array.isArray(keys)) return 'NOT STENO: '+keys
	let str = ''
	const num = keys[0] === '#'
	let left = true, hasDigits = false
	for(let i=+num; i<keys.length; ++i) {
		let k = keys[i]
		if(Steno.middleRE.test(k)) left = false
		else if(left) {
			if(/^-/.test(k)) {
				left = false
				str += '-'
			} else if(/^[6798]$/.test(k)) left = false
		}
		if(num && Steno.toDigit[k] != null) {
			hasDigits = true
			k = ''+Steno.toDigit[k]
		}
		str += k.substr(-1)
	}
	return (num && !hasDigits ? '#' : '') + str
}

Steno.toString = function(strokes) {
	return strokes.map(Steno.strokeToString).join('/')
}

Steno.splitStroke = function(keys) {
	let ret = [[], [], []]
	for(const k of keys) {
		if(Steno.middleRE.test(k)) ret[1].push(k)
		else if(/^-/.test(k)) ret[2].push(k)
		else ret[0].push(k)
	}
	return ret
}

Steno.normalize = function(stroke) {
	stroke = [...new Set(stroke)]
	return stroke.sort((a,b) => Steno.index[a] - Steno.index[b])
}

Steno.merge = function(...strokes) {
	let merged = []
	for(let stroke of strokes) {
		if(typeof stroke === 'string') stroke = Steno.parseStroke(stroke)
		merged.push(...stroke)
	}
	return Steno.normalize(merged)
}
