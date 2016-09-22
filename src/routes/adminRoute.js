'use strict';
const express=require('express');
//创建一个路由
let route=express.Router();

//引入控制器
let accountCtrl=require('../control/adminController.js');
//用户页面是get请求
route.all('/list/:count/:items',accountCtrl.getlist);
//点击新增按钮时
route.get('/add',accountCtrl.getadd);
route.post('/add',accountCtrl.postadd);
//点击编辑按钮时;/edit/:vid相当于angular里面的路由参数{vid:2}
route.get('/edit/:vid',accountCtrl.getedit);
route.post('/edit/:vid',accountCtrl.postedit);
//暴露路由模块
route.get('/del/:vid',accountCtrl.getdel);
module.exports=route;

