'use strict';
//拿到执行package.json设置的端口号
let PORT=process.env.PORT.trim();
//引入模块
const express=require('express');
const orm=require('orm');
let app=express();
//导入body-parser实现获取请求报文体的数据
const bodyParser=require('body-parser');
// 将bodyParser作为第三方包加载到express框架中(express的中间件)
// 会产生一个body的对象加载到res对象里面
app.use(bodyParser());
//暴露orm方便后面操作数据库
global.orm=orm;

////导入express-session包：用来存放专门术语某个浏览器的数据
const session=require('express-session');
app.use(session({
  secret: 'cz02',
  resave: false,
  saveUninitialized: true
}));

//0.0 链接mysql数据库同时初始化所有的表的模型
app.use(orm.express("mysql://root:@127.0.0.1:3306/nodesystem", {
    define: function (db, models, next) {
    //db:数据库的链接对象,可以用数据库语句来操作数据库
    //req.db.driver.execQuery('select * from users',(err,data)=>{
  	// res.end(JSON.stringify(data));
	//models：在回调函数中定义好的对象，models中的每个对象都可以操作数据库中的表
	//只有将每张表初始化在model对象中才可以操作
        	let modelObj=require('./model/initModels.js');
        	modelObj(db, models);
       		next();
    }
}));



//设置模板引擎
let xtpl=require('xtpl');
//将来xtpl模板引擎自动去views文件夹中查找所有的模板文件
app.set('views',__dirname+'/view');
//将我们的xtpl扩展名称改成html结尾的模板
//将来碰到html结尾的模板请自动使用xtpl.renderFile
//将来在这个系统中解析模板的写法改变为：res.render('模板路径',传入的对象,(err,content)=>{})
app.set('view engine', 'html');
// app.use(function(req, res){
//     res.render('test',{data:1});
// });
app.engine('html',xtpl.renderFile);



//设置静态环境
app.use(express.static(__dirname+'/static'));


//设置默认的样式
app.all('/account/*',(req,res,next)=>{
  res.setHeader('Cotent-type','text/html;charset=utf8');
  next();
});
app.all('/admin/*',(req,res,next)=>{
  res.setHeader('Cotent-type','text/html;charset=utf8');
  next();
});
//导入路由模块
let accountRoute=require('./routes/accountRoute.js');
let adminRoute=require('./routes/adminRoute.js');
let videoRoute=require('./routes/apiroute.js');
//app监控的第一个参数是主目录,第二个参数是子目录,如'/account/register'
app.use('/account',accountRoute);
app.use('/admin',adminRoute);


//在这里统一设定api下面的所有请求都是可以允许跨域的
app.all('/api/*',(req,res,next)=>{
  //设置跨域请求
  res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    
  next();
});
app.use('/api',videoRoute);


//富文本编辑器
var ueditor = require("ueditor");
var path = require('path');
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'static'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = '/images/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));
//监听端口
app.listen(PORT,'127.0.0.1',()=>{
	console.log('服务器已经启动,端口号为'+PORT)
})
