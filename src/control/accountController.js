'use strict';
//负责get请求，将注册页面响应给浏览器
exports.getregister=function(req,res){
	res.render('./account/regist.html',{},(err,html)=>{
		res.end(html)
	})
};

//负责post提交表单
exports.postregister=function(req,res){

	let uname=req.body.uname;
	let upwd=req.body.upwd;
	//将密码MD5化加密
	upwd=require('../tool/md5jiami.js')(upwd);
	let uqq=req.body.uqq;
	let uemail=req.body.uemail;
	//将数据写入数据库中
	req.models.userinfo.create({
		uname:uname,
		upwd:upwd,
		uqq:uqq,
		uemail:uemail
	});
	//3.0 提醒用户注册成功，同时跳转到登录页面
	res.end("<script>alert('注册成功');window.location='/account/login'</script>");
};

//登录的get请求
exports.getlogin=function(req,res){
	res.render('account/login.html',{},(err,html)=>{
		res.end(html);
	})
};

//登录的post请求
exports.postlogin=function(req,res){
		//1.0 获取浏览器提交上来的值
	let uname =req.body.uname;
	let upwd = req.body.upwd;  //明文
	let vcode = req.body.vcode;
	//判断请求回来的二维码是否正确
	let vcodeFormSession=req.session.vcode;
	if(vcode != vcodeFormSession){
		res.end("<script>alert('验证码输入错误');window.location='/account/login';</script>");
		return;
	}
	//如果验证码输入正确,就要将密码md5话,和数据库的用户名比对
	upwd=require('../tool/md5jiami.js')(upwd);
	req.models.userinfo.find({uname:uname,upwd:upwd},(err,content)=>{
		if(content.length==0){
			res.end("<script>alert('用户名或者密码错误');window.location='/account/login';</script>");
		return;
		};
		//如果输入正确,那么久将用户名存储下,执行后面的页面告诉浏览器已经登陆过,同时将用户名可以
		//显示在用户的页面上
		req.session.uname=uname;
		res.end("<script>alert('登录成功');window.location='/admin/list/2/1';</script>");
	})
	
};




//请求图片的路由控制,生成二维码
exports.getvcode=function(req,res){
	let vcodenum=parseInt(Math.random()*9000+1000);
	//将随机数存储在session的对象中
	req.session.vcode=vcodenum.toString();
	//引入包
	let captchapng=require('captchapng');
	 var p = new captchapng(80,30,vcodenum); 
        p.color(245, 222, 179, 255);  // 背景色 
        p.color(255, 0, 0, 255); // 前景色
 
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64)
};
