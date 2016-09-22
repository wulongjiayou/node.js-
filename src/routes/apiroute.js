'use strict';
const express=require('express');
//创建一个路由
let route=express.Router();

//引入控制器
let accountCtrl=require('../control/apiController.js');
//手机页面ajax跨域请求是get请求
route.get('/getvideos',accountCtrl.getvideos);
//手机页面是视屏请求
route.get('/getvideo/:vid',accountCtrl.getvideo)
//暴露路由
module.exports=route;

