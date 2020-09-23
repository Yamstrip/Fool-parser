var styles = {
    'reset': '\x1B[0m',
    'bright': '\x1B[1m',
    'grey': '\x1B[2m',
    'italic': '\x1B[3m',
    'underline': '\x1B[4m',
    'reverse': '\x1B[7m',
    'hidden': '\x1B[8m',
    'black': '\x1B[30m',
    'red': '\x1B[31m',
    'green': '\x1B[32m',
    'yellow': '\x1B[33m',
    'blue': '\x1B[34m',
    'magenta': '\x1B[35m',
    'cyan': '\x1B[36m',
    'white': '\x1B[37m',
    'blackBG': '\x1B[40m',
    'redBG': '\x1B[41m',
    'greenBG': '\x1B[42m',
    'yellowBG': '\x1B[43m',
    'blueBG': '\x1B[44m',
    'magentaBG': '\x1B[45m',
    'cyanBG': '\x1B[46m',
    'whiteBG': '\x1B[47m',
     'black-': '\x1B[30;2m',
    'red-': '\x1B[31;2m',
    'green-': '\x1B[32;2m',
    'yellow-': '\x1B[33;2m',
    'blue-': '\x1B[34;2m',
    'magenta-': '\x1B[35;2m',
    'cyan-': '\x1B[36;2m',
    'white-': '\x1B[37;2m',
    'blackBG-': '\x1B[40;2m',
    'redBG-': '\x1B[41;2m',
    'greenBG-': '\x1B[42;2m',
    'yellowBG-': '\x1B[43;2m',
    'blueBG-': '\x1B[44;2m',
    'magentaBG-': '\x1B[45;2m',
    'cyanBG-': '\x1B[46;2m',
    'whiteBG-': '\x1B[47;2m'
}

function colors(keys, source) {
    var values = ''
    if(typeof keys === 'string'){
        values = styles[keys]
    }
    else {
        keys.forEach(key => {
            values += styles[key]
        });
    }
    return values + source + styles['reset']
}
exports .color = colors

exports .setcolor = function ( name , obj ) {
	if (  typeof obj === 'object' ) {
		let h = { }
		h [ name ] = obj
		name = h
	}
	for ( let i in name ) {
		exports .setcolor .data [ i ] = name [ i ]
	}
}
exports .setcolor .data = { }
exports .c = function ( name , a , b , c , d , e , f , g ) {
	let anp = exports .setcolor .data [ name ]
	if ( ! anp ) {
		anp = [
			{
				content: ' [yc] ',
				app: [ 'bright' , 'yellow' ]
			},
			[ 'bright' ],
		]
	}
	let vd = ''
	let inp = 0
	anp .forEach ( s => {
		if ( ( s instanceof Array === true ) ) {
			let t
			if ( inp == 0 && a ) {	
				t = a
			} else if ( inp == 1 && b ) {
				t = b
			} else if ( inp == 2 && c ) {
				t = c 
			} else if ( inp == 3 && d ) {
				t = d
			} else if ( inp == 4 && e ) {
				t = e
			} else if ( inp == 5 && f ) {
				t = f
			} else if ( inp == 6 && g ) {
				t = g
			} else if ( inp == 7 && h ) {
				t = h
			} else if ( inp == 8 && i ) {
				t = i
			}
			inp += 1
			if ( t ) {
				vd += exports .color ( s , t )
			}
		} else {
			let g = [ ]
			if ( s .app ) {
				g = g .concat ( s .app )
			}
			if ( s .content ) {
				if ( typeof s .content === 'function' ) {
					g = exports .color ( g , s .content ( ) )
				} else {
					g = exports .color ( g , s .content )
				}
			} else {
				g = s .content
			}
				vd += g
		}
	} )
	console .log ( vd )
}