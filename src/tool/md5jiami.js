//MD5加密
'use strict';
module.exports=function(entryString){
	const crypto = require('crypto');

	const secret = 'wulong';//加密后面加的参数
	const hash = crypto.createHmac('md5', secret)
	.update(entryString)//实参
	.digest('hex');
	return hash;
};
