module.exports=function(db, models){
	////初始化userinfo表结构
	models.userinfo = db.define("userinfo", {
        	 uid : { type: 'serial', key: true }, //uid是主键和自增的写法
             uname:String,
             upwd:String,
             uqq:String,
             uemail:String
                       
        });
	//初始化userinfo表结构
	models.videoinfo = db.define("videoinfo", {
        	 vid : { type: 'serial', key: true }, //uid是主键和自增的写法
             vtitle:String,
        	 vsortno:Number,
        	 vsummary:String,
             vremark:String,
             vvideoid:String,
             vstatus :Number,
             vimg:String   

        });
}
