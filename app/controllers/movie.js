var _= require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Catetory = require('../models/catetory');
var fs = require('fs');
var path = require('path');

//当地址栏请求"/movie/1"时，会执行下面res.render里面的指定页面，此处为detail页面
//app.get('/movie/:id',function(req,res){});
exports.detail = function(req,res){
	var id = req.params.id;
	Movie.update({_id:id},{ $inc:{pv:1}},function(err){ //统计访问量
		if(err){
			console.log(err);
		}
	});

	Movie.findById(id,function(err,movie){ //function为回调函数
		Comment
			.find({movie:id}) //找到这部电影，评论数据
			.populate('from','name') //from里面的objectid。找User里面对应信息name
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
				console.log(comments.reply);
				res.render('detail',{
					title:"详情页-"+movie.title,
					movie: movie , //返回Movie.findById满足指定id查找出来的movie（写成movies一样，只是参数）
					comments:comments
				})
			})	
		})
}



//在列表页面点击更新时，会重新回到录入页，需要将数据初始化到表单中
//app.get('/admin/update/:id',function(req,res){})
exports.update = function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			Catetory.find({},function(err,catetories){
				res.render('admin',{
					title:'后台更新页',
					movie: movie,
					catetories:catetories
				});
			})			
		})
	}
}
//上传海报
exports.savePoster=function(req,res,next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename; //上传图片原始名字
	console.log('req.files:'+req.files)
	if(originalFilename){ //有文件上传的话
		fs.readFile(filePath ,function(err,data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1]; //图片类型
			var poster = timestamp + '.' +type;
			var newPath = path.join( __dirname, '../../','/public/upload/'+ poster);//读取filePath里面二进制的数据

			fs.writeFile(newPath,data,function(err){
				req.poster = poster;
				next();
			});
		});
	}else{ //没有文件上传的话
		next(); //即下一步，movie.save
	}

}
//ADMIN post movie表单提交过来的页面
//app.post('/admin/movie/new',function(req,res){});
exports.save = function(req,res){
	var id = req.body.movie._id;    console.log("movie._id:"+id);
	var _movieObj = req.body.movie;   
	var _movie;

	if(req.poster){ //如果存在，说明上一步上传了海报图片
		_movieObj.poster = req.poster;
	}

	if(id!== undefined){//如果不是undefined，说明已经存在的，则需要更新
		Movie.findById(id,function(err,movie){ //先查到这组数据movie
			if(err){
				console.log(err);
			}

			//然后用post过来的新的数据字段替换掉老的数据字段
			_movie = _.extend(movie,_movieObj); //extend（查询到的旧的，post新的）
			//这个_movie 只不过是一个json格式的对象。本身并没有save方法。所以这个save方法一定是数据库对象的一个方法。我们只需要把加一句这个_movie = new Movie(_movie)  把_movie实例化为一个数据库对象就ok啦
			_movie = new Movie(_movie);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+movie._id); //数据更新并存储成功，重定向至电影详情页面
			})
		})
	}else{ //不存在，表明是新增
		var movie = new Movie(_movieObj);   
		var catetoryId = _movieObj.catetory; //拿到选择的是哪个分类（实际上就是catetory里面字段的_id），
		var catetoryName = _movieObj.catetoryName; 

		movie.save(function(err,movie){ //save方法执行后，数据就保存到数据库了
			if(err){
				console.log(err);
			}
			if (catetoryId) { //若直接选择了已有分类
				console.log("直接选择catetoryId");
				//把movieid存储到对应选择分类的catetory表里面
				Catetory.findById(catetoryId,function(err,catetory){ 
					catetory.movies.push(movie._id); //把电影id存入对应的catetory.movies字段里
					catetory.save(function(err,catetory){
						res.redirect('/movie/'+movie._id);
					});
				});
			}else if(catetoryName){   //如果只有catetoryName，说明是新增一个分类，new一个catetory
				console.log("新输入catetoryName："+catetoryName);
				var catetory = new Catetory({ //新增分类，并将此条movie存在该分类下
					name : catetoryName,
					movies : [movie._id]
				});
				catetory.save(function(err,catetory){ //保存数据(上面new的数据)
					movie.catetory = catetory._id; // 将分类_id存储到该条movie里面
					movie.save(function(err,movie){ //保存
						res.redirect('/movie/'+movie._id);	
					});	
				});
			}
	
		})
	}
}

//app.get('/admin/movie',function(req,res){});
exports.new = function(req,res){
	Catetory.find({},function(err,catetories){
		res.render('admin',{
			title:"imooc 后台录入",
			catetories : catetories,
			movie:{}
		})
	})
}

//app.get('/admin/list',function(req,res){});
exports.list = function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: "imooc 列表",
			movies: movies
		})
	});
}