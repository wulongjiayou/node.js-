'use strict';
//负责get请求，将注册页面响应给浏览器
// global.orm=orm;
exports.getlist=function(req,res){
	//获得分页数据
	let count=req.params.count;
	let limitval=req.params.items;
	// console.log(count)
	// console.log(item)
	let offsetval=(limitval-1)*count;
	// console.log(offsetval)
	//获取传过来搜索的值
	let vtitl=req.body.vtitle;
	let where={};
	//当搜索完后,搜索栏里面还要有搜索的字
	let str='';
	//是get请求的话就不会获得搜索的文字,post是获取文字
	if(vtitl){
		//去数据库里面找含有这个vtitl的数据
		where={vtitle:orm.like('%'+vtitl+'%')};
		str=vtitl;
	};
	//获得数据库的总数据,获得总页数
		let ary=[];
	req.models.videoinfo.find(where,(err,content)=>{
		//如果数据为小于1或者没数据,给默认值
		let arycount=content.length/count;
		arycount=arycount<1?1:Math.ceil(arycount);
		global.arycount=arycount;
		//页码数必须为数字,所以要循环
		for(var i=1;i<arycount+1;i++){
			ary.push(i)
		}
	});
	//0.0 获取提交过来的查询条件数据
	//由于这个方法接受两个请求，当时当get请求的时候titleVal是没有值的
	console.log(count)
	req.models.videoinfo.find(where,{offset:offsetval,limit:parseInt(count)},(err,content)=>{

		if(err){
			res.end(err);
			return;
		};
		
		res.render('admin/videolist.html',{array:content,querystr:str,ary:ary,limitval:limitval,arycount:arycount},(err,html)=>{
			res.end(html)
		})
	})
	
};


//点击新增按钮的时候
exports.getadd=function(req,res){
	res.render('admin/videoadd.html',{},(err,html)=>{
		if(err){
			res.end(err);
			return;
		}
		res.end(html);
	});
};
//点击保存时post请求
exports.postadd=function(req,res){
	//1.0 获取浏览器请求body中的所有值
	let vtitle = req.body.vtitle;
	let vsortno = req.body.vsortno;
	let vsummary = req.body.vsummary;
	let vvideoid = req.body.vvideoid;
	let vremark = req.body.editorValue;
	//将数据添加到数据库
	req.models.videoinfo.create({
		vtitle:vtitle,
		vsortno:vsortno,
		vsummary:vsummary,
		vvideoid:vvideoid,
		vremark:vremark,
		vstatus:0
	},(err,item)=>{
		if(err){
			res.end(err);
			return;
		};
		//添加成功响应给客户
		res.end("<script>alert('新增成功'),window.location='/admin/list/4/1'</script>")
	}
)};

//点击编辑按钮get请求
exports.getedit=function(req,res){
	//获取传过来的vid参数
	let vid=req.params.vid;
	//获取相应的数据库的值
	req.models.videoinfo.get(vid,(err,content)=>{
		res.render('admin/videoedit.html',content,(err,html)=>{
			if(err){
				res.end(err);
				return;
			}
			res.end(html);
		});
	})
	
};
//点击编辑按钮post请求
exports.postedit=function(req,res){
	//1.0 获取浏览器请求body中的所有值
	let vtitle = req.body.vtitle;
	let vsortno = req.body.vsortno;
	let vsummary = req.body.vsummary;
	let vvideoid = req.body.vvideoid;
	let vremark = req.body.editorValue;
	//获取传过来的vid参数
	let vid=req.params.vid;
	//通过这个参数拿到数据库对应的数据
	req.models.videoinfo.get(vid,(err,content)=>{
		content.vtitle=vtitle,
		content.vsortno=vsortno,
		content.vsummary=vsummary,
		content.vvideoid=vvideoid,
		content.vremark=vremark,
		content.vstatus=0,
		content.save((err)=>{
			if(err){
				res.end(err);
				return;
			}
			res.end("<script>alert('修改成功'),window.location='/admin/list/4/1'</script>");
		})
		
	})

};

//当ajax发送请求的时候,要删除数据
exports.getdel=function(req,res){
	//获取传过来的vid参数
	let vid=req.params.vid;
	//定义传给浏览器的json对象
	let where={"statu":0,"message":""}
	//删除指定的数据
	req.db.driver.execQuery('delete from videoinfo where vid='+vid,(err,cpntent)=>{

		if(err){
			where.statu=1;
			where.message='删除失败';
			res.end(JSON.stringify(where));
		}
		where.message='删除数据成功';
		res.end(JSON.stringify(where));
	})
};
