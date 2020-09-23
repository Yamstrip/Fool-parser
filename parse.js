//语法解析器
let lib = { }
let color = require ( './color.js' )
color .setcolor ( 'e' , [
	[ 'red-', 'bright' ],
	[ 'white-' , 'bright' ]
] )
exports .parse = function ( name , str ) {
	if ( ! lib [ name ] ) {
		color .c ( 'e' , '名称 ' + name + ' 不存在' )
		return
	}
	//去掉空格
	let r = exports .int ( lib [ name ], str )
}
exports .int = function ( obj , str , ca ) {
	if ( ! ca ) {
		let now = { }
		ca = {
			//空格
			empty: 0,
			//code
			code: 0,
			//DIR
			dir: __dirname,
			//分割
			split: 0,
			//数据
			data: '',
			//行
			line: 0,
			//全局变量
			auto: { },
			//成功
			type: true,
			//当前指数
			index: 0,
			nowindex: 0,
			lastnowindex: 0,
			lastline: 0,
			//当前递归层次
			inl: [ ],
			//当前递归层次逻辑
			inld: [ ],
			//当前检测次序
			inli: [ ],
			//当前层参数
			inla: [ ],
			//当前层函数
			inlf: [ ],
			//上一层return
			inlr: [ ]
		}
	}
	ca .dir = obj .dir ? obj .dir : ca .dir
	//RETURN返回
	let ret = function ( d ) {
		ca .inlr [ ca .inlr .length - 1 ] = d
	}
	//递归语句
	let int = function ( strs ) {
		let ds = ca .inlr [ ca .inlr .length - 1 ]
		exports .int ( obj , strs , ca )
		ca .inlr .splice ( ca .inlr .length - 1 , 1 )
		return ds
	}
	let ifstring = function ( d ) {
		let g = {
			'"': {
				'\n': true
			},
			"'": {
				'\n': true
			},
			'`': {
				
			}
		}
		if ( d ) {
			for ( let i in d ) {
				g [ i ] = d [ i ]
			}
		}
		return g
	}
	let err = function ( i , text, inp ) {
		let line = 0
		let ac = 0
		let pos = [ ]
		let d = str .split ( '\n' )
		for ( let i in ca .inl ) {
			let v = ca .inl [ i ]
			pos .push ( `at(${v.dir}:${v.name} ${v.line}:${v.index})` )
		}
		color .c ( 'e' , 'Error\n' , [
			'Type: ' + text,
			'Text: ' + tostr(i,{str:true}).data+color.color(['underline','red'],inp),
			'Line: ' + ( 1 + ca .line ) + ':' + ca .nowindex,
			'struck: ' + pos .join ( '\n' )
		] .join ( '\n' ) )
		ca .type = false
	}
	//字符串/变量结束
	/*
	{
		end: { } ..设置END数据,
		str: true ? 是否初始默认字符串,
		string: { 
		xxx: {
		截断字符: true....
		}
		} 
	}
	*/
	let find = function ( i , d ) {
		if ( !d ) d = { }
		//返回
		let ret = {
			length: 0,
			line: 0,
			data: ''
		}
		//字符串
		let strv = {
			'"': {
				'\n': true
			},
			"'": {
				'\n': true
			},
			'`': {
				
			}
		}
		//结束
		let ends = {
			' ': true,
			';': true
		}
		//列表初始
		let stri = false
		let strc = { }
		let strl = false
		if ( d .str ) {
			let name = d .str
			let obk = { }
			if ( typeof d .str === 'object' ) {
				obk = d .str .data
				name = d .str .name
			}
			stri = true
			strl = d .str
			strv [ d .str ] = {
				'\n': true
			}
			strc = {
				'\n': { }
			}
			for ( let j in obk ) {
				strc [ j ] = true
			}
		}
		if ( d .string ) {
			for ( let j in d .string ) {
				strv [ j ] = d .string [ j ]
			}
		}
		if ( d .end ) {
			for ( let j in d .end ) {
				ends [ j ] = d .end [ j ]
			}
		}
		//默认字符
		
		//迭代函数形式
		let ints = function ( j ) {
			let v = str [ j ]
			ret .length += 1
			//不是字符串
			if ( stri == false ) {
				//返回
				if ( ends [ v ] ) {
					ret .length -= 1
					return false
				} else
				//提行
				if ( v == '\n' ) {
					ret .line += 1
					return false
				} else
				//新字符串
				if ( strv [ v ] ) {
					if ( ret .length == 1 || stri == true ) {
						strl = v
						stri = true
						strc = strv [ v ]
					} else {
						return false
					}
				} else {
					ret .data += v
				}
			} else {
				if ( strc [ v ] ) {
					return false
				} else
				if ( strl == v ) {
					return false
				} else {
					ret .data += v
				}
			}
		}
		//2种find
		if ( d .type == 'end' || d .type == undefined ) {
			for ( let j = i; j < str .length; j ++ ) {
				if ( ints ( j ) == false ) {
					return ret
				}
			}
		} else {
			for ( let j = i; j > 0; j -- ) {
				if ( ints ( j ) == false ) {
					return ret
				}
			}
		}
		return ret
	}
	//字符串/最前面
	let tostr = function ( i , d ) {
		if ( !d ) d = { }
		d .type = 'str'
		let v = find ( i , d )
		let co = ''
		for ( let j = v .data .length -1; j > 0; j -- ) {
			co += v .data [ j ]
		}
		v .data = co
		return v
	}
	//字符串/最后面
	let toend = function ( i , d ) {
		if ( !d ) d = { }
		d .type = 'end'
		return find ( i , d )
	}
	//匹配结构
	/*
	
	{
		string: { xx: {
		xxx: true 截断字符
		}
		} 设置结构匹配 
		str 开始
		end 结束
	}
	
	*/
	let toboth = function ( i , d ) {
		let stri = false
		let strl = false
		let strc = { }
		//空格字符
		let strv = { }
		//空格+\n字符
		let strvn = { }
		if ( !d ) d = { }
		if ( d .string ) {
			strv = d .string
		}
		//返回
		let ret = {
			length: 0,
			isfind: false,
			findstr: false,
			findend: false,
			data: [ ],
			text: '',
			str: 0,
			end: 0
		}
		//迭代
		for ( let j = i; j < str .length; j ++ ) {
			//设置
			ret .length += 1
			let v = str [ j ]
			//非字符串
			if ( stri == false ) {
				//开始结构
				if ( v == d .str ) {
					ret .str += 1
					ret .findstr = true
					//第一次不加入括号
					if ( ret .str !== 1 ) {
						ret .data .push ( d .str )
					}
				} else
				//结束符号
				if ( v == d .end ) {
					ret .end += 1
					ret .findend = true
					if ( ret .str - ret .end !== 0 ) {
						if ( ret .str - ret .end !== 0 ) {
							ret .data .push ( d .end )
						}
					} else {
						ret .isfind = true
						return ret
					}
				} else
				//进入字符串
				if ( strv [ v ] ) {
					stri = true
					strl = v
					strc = strv [ v ]
				} else
				{
					let vd = { }
					vd [ d .str ] = true
					vd [ d .end ] = true
					let r = toend ( j , {
						str: {
							name: '\n',
							data: vd
						}
					} )
					j += ( r .length - 2 > 0 ? r .length - 2 : 0 )
					ret .data .push ( r .data )
				}
				//字符串模式
			} else {
				//退出字符串
				ret .text += v
				if ( ( strv [ v ] && v == strl ) || strc [ v ] ) {
					stri = true
					strl = false
					strc = { }
					ret .data .push ( ret .text )
					ret .text = ''
				}
			}
		}
		return ret
	}
	//组装
	let call = {
		toend,
		find,
		toboth,
		err,
		int,
		ret,
		tostr
	}
	
	
	
	for ( let i = 0; i < str .length; i ++ ) {
		if ( ca .type == false ) {
			return ca
		}
		//空格
		if ( str [ i ] == ' ' ) {
			ca .empty += 1
		} else
		//分割略过
		if ( obj .split [ str [ i ] ] ) {
			ca .split += 1
		} else
		//提行
		if ( str [ i ] == '' ) {
			ca .line += 1
		} else
		//开始检测指令
		{
			if ( ca .lastline !== ca .line ) {
				ca .nowindex = 0
				ca .lastline = ca .line
			}
			if ( ca .lastnowindex !== i ) {
				ca .nowindex += ( i - ca .lastnowindex )
				ca .lastnowindex = i
			}
			let now = ca .inl [ ca .inl .length - 1 ]
			//语法重叠
			if ( now ) {
				if ( ( str .substr ( i , now .name .length ) == now .name ) && now !== '' ) {
					err ( i , 'Invalid syntax ' + now .name , now .name )
					return ca
				}
			}
			
			
			
			//检测新加层
			let is_add
			let is_name
			let is_func
			for ( let j in obj .lib ) {
				if ( str .substr ( i , j .length ) == j ) {
					is_add = obj .lib [ j ] .data
					is_name = j
					is_func = obj .lib [ j ] .eval
				}
			}
			//添加层
			if ( is_add && is_name ) {
				i += is_name .length -1
				ca .inl .push ( {
					name: is_name,
					line: ca .line + '',
					dir: ca .dir + '',
					index: ca .nowindex + ''
				} )
				ca .inld .push ( is_add )
				ca .inla .push ( [ ] )
				ca .inli .push ( 0 )
				ca .inlf .push ( is_func )
			} else
			//不是新的层，是参数
			{
				let index = ca .inli [ ca .inli .length - 1 ]
				let addindex = function ( n ) {
					index += n
					ca .inli [ ca .inli .length - 1 ] += n
				}
				let data = ca .inld [ ca .inld .length - 1 ]
				if ( data == undefined || index == undefined ) {
					err ( i ,  toend ( i ) .data + ' 未定义' , toend ( i ) .data )
					return ca
				}
				let d = data [ index ]
				
				let arg = ca .inla [ ca .inla .length - 1 ]
				//数组类型
				if ( d instanceof Array === true ) {
					let type = false
					for ( let j in d ) {
						if ( typeof d [ j ] === 'object' ) {
							let n = d [ j ] .name
							if ( str .substr ( i , n .length ) == n ) {
								type = true
								
								i += n .length - 1
								arg .push ( n )
								if ( d [ j ] .new ) {
									for ( let k = index; k < d [ j ] .new .length; k ++ ) {
										data [ k ] = d [ j ] .new [ k ]
									}
								}
							}
						} else {
							if ( str .substr ( i , d [ j ] .length ) == d [ j ] ) {
								type = true
								arg .push ( str [ i ] )
								addindex ( 1 )
								i += str [ i ] .length - 1
								break
							}
						}
					}
					if ( type == true ) {
						let test = [ ]
						for ( let j in d ) {
							if ( typeof d [ j ] === 'object' ) {
								test .push ( d [ j ] .name )
							} else {
								test .push ( d [ j ] )
							}
						}
						err ( i , 'Invalid syntax Lose [' + test .join ( ',' ) + ']' , '' )
						return ca
					}
				} else
				//数据结构
				if ( typeof d === 'object' ) {
					//多种结构
					/*分类变量
					type: ary,
					分类器,如果里面有其他分类，会优先递归当前语句
					str: 
					end: 
					split: 分割符号 , 可以是数组代表多种
					*/
					if ( d .type == 'array' ) {
						//多参数集对象
						let string = ifstring ( d .string )
						let d1 = toboth ( i , {
							str: d .str,
							end: d .end,
							string
						} )
						if ( d1 .isfind == true ) {
							addindex ( 1 )
							i += d1 .length + 2
							arg .push ( d1 .data )
						} else {
							err ( i , 'Invalid syntax ' + d1 .data , d1 .data )
						}
					}
				} else
				//空格
				if ( str [ i ] == ' ' ) {
					ca .empty += 1
				} else
				//提行
				if ( str [ i ] == '\n' ) {
					ca .line += 1
				} else
				//指定字符
				if ( str .substr ( i , d .length ) == d ) {
					i += d .length - 1
					addindex ( 1 )
					arg .push ( d )
				} else
				//变量以及函数和对象和字符串
				if ( d == '$val' ) {
					let ends = {
						end: { }
					}
					if ( data [ index + 1 ] ) ends .end [ data [ index + 1 ] ] = true
					addindex ( 1 )
					let f = toend ( i , ends )
					i += f .length - 1
					arg .push ( f .data )
				} else {
					err ( i , 'Invalid syntax' , d )
					return
				}
				//执行完
				if ( index == data .length ) {
					call .index = ca .index + ''
					call .line = ca .line + ''
					call .dir = ca .dir + ''
					ca .inlf [ ca .inlf .length - 1 ] (
						arg,
						call
					)
					ca .code += 1
					ca .inl .splice ( ca .inl .length -1 )
					ca .inld .splice ( ca .inld .length -1 )
					ca .inla .splice ( ca .inla .length -1 )
					ca .inli .splice ( ca .inli .length -1 )
					ca .inlf .splice ( ca .inlf .length -1 )
				}
			}
		}
	}
	return ca
}
exports .conf = function ( name , val ) {
	if ( ! lib [ name ] ) {
		lib [ name ] = {
			auto: { },
			lib: { },
			split: {
				'\n': true, 
				';': true
			}
			//逻辑分隔符
		}
	}
	if ( val .type == 'auto' ) {
		lib [ name ] .auto = val .data
	} else
	if ( val .type == 'lib' ) {
		lib [ name ] .lib [ val .name ] = val .data
	}
	if ( val .type == 'split' ) {
		lib [ name ] .split = val .data
	}
}