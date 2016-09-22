'use strict';
exports.getvideos=function(req,res){
	let resObj={status:0,message:""}
	//找到所有的数据
	req.models.videoinfo.find({vstatus:0},(err,content)=>{
		if(err){
			resObj.status=1;
			resObj.message=err.message;
			res.end(JSON.stringify(resObj));
			return;
		};
		resObj.message=content;
		res.end(JSON.stringify(resObj));
	})
}

////手机页面是视屏请求
exports.getvideo=function(req,res){
	//得到传过来的id值 
	let vidd=req.params.vid;
	console.log(vidd)
	//在数据库里面按照需求找到所对应的数据
	let sql='select vvideoid,vremark,vtitle from videoinfo where vid='+vidd;
	let resObj={status:0,message:""}
	req.db.driver.execQuery(sql, (err,content)=>{
		if(err){
			resObj.status=1;
			resObj.message=err.message;
			res.end(JSON.stringify(resObj));
			return;
		}
		resObj.message=content;
		res.end(JSON.stringify(resObj));
	})
}
