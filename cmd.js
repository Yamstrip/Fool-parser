let obj = require ( './parse' )
let data = [ ]
let score = { }
let fs = require ( 'fs' )
//
let func = { }
!function ( val ) {
	let d = {
		'sb add': {
			data:[
				'$val',
				'$val'
			],
			call: function ( d , i ) {
				data .push ( 'scoreboard objectives add ' + d [ 0 ] + ' dummy ' + d [ 1 ] )
			}
		},
		'sb rm': {
			data:[
				'$val'
			],
			call: function ( d ) {
				data .push ( 'scoreboard objectives remove ' + d [ 0 ] )
			}
		},
		'/': {
			data: [
				{
					type: 'array',
					str:'*',
					end: '*/'
				}
			]
		}
	}
	
	for ( let i in d ) {
		val ( 'cmd' , {
			type: 'lib',
			name: i,
			data: {
				data: d [ i ] .data,
				eval: d [ i ] .call
			}
		} )
	}
	
	
} ( obj .conf )

obj .conf ( 'cmd' , {
	type: 'lib',
	name: 'cmd',
	data: {
		data: [
			{
				type: 'array',
				str: '(',
				end: ')'
			}
		],
		eval: function ( d ) {
			data .push ( d [ 0 ] .join ( ' ' ) )
		}
	}
} )


obj .parse ( 'cmd', fs .readFileSync ( __dirname +  '/cmd.txt' ) + '' )
console.log(data)