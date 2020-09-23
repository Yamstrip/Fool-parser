#Ycloud Parse

```

let lib = require ( ... )

lib .add ( name , item )

item: {
	[name:名称],
	[type:lib|auto],
	[data:data]
}
item.data: {
	index: [  ],
	function: ( attr , all ) //attr参数,all当前执行对象
}
item.data.index: [

'$名称' 递归其他名称
'名称' 直接是名称
'$s' 无限空格
'$str' 字符串
{
	type: 'ary',
	split: '分割',
	return: 数字下标 | 直接字
} 将支持 'xxx 分割 xxx 分割 xxx' 的形式

]


lib .parse ( name )
返回字符串形势

```