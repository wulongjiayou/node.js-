'use strict';
const express=require('express');
//创建一个路由
let route=express.Router();

//引入根据不同的路由得到不同的方法处理
let accountCtrl=require('../control/accountController.js');
//进入注册页面是get请求
route.get('/register',accountCtrl.getregister);

//提交表单是post请求
route.post('/register',accountCtrl.postregister);


//进入登录页面是get请求
route.get('/login',accountCtrl.getlogin);

//登录提交表单是post请求
route.post('/login',accountCtrl.postlogin);

//登录提交表单是post请求
route.get('/vcode',accountCtrl.getvcode);

//暴露路由模块
module.exports=route;
