"use strict";exports.getregister=function(t,e){t.models.userinfo.get(1,function(t,s){e.setHeader("Content-Type","text/html;charset=utf8"),e.end(JSON.stringify(s))})},exports.postregister=function(t,e){};