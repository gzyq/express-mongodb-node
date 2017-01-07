var _= require('underscore');
var Comment = require('../models/comment');

//comment
///form post user/comment
exports.save = function(req,res){
	var _comment = req.body.comment;
	var movieId = _comment.movie; 
	console.log("movieId:"+movieId);
	console.log("movieFrom:"+_comment.from);
  	
	if(_comment.cid){ //存在cid，即评论别人的
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};

			comment.reply.push(reply);

			comment.save(function(err,comment){ //save方法执行后，数据就保存到数据库了
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+movieId); 
			})
		});

	}else{
		var comment = new Comment(_comment);

		comment.save(function(err,comment){ //save方法执行后，数据就保存到数据库了
			if(err){
				console.log(err);
			}
			res.redirect('/movie/'+movieId); 
		})
	}	
}
	