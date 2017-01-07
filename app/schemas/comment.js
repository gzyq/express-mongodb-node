var mongoose = require("mongoose");
var Schema = mongoose.Schema; 
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
	movie: { //原始movie
		type: ObjectId,
		ref: 'Movie'
	}, //当前要评论的电影
	from:{
		type: ObjectId,
		ref: 'User'  //评论来自谁
	},
	to:{
		type: ObjectId,
		ref:'User'  //评论谁，即被评论的人
	},
	reply:[{  //针对主评论的回复
		from:{type:ObjectId,ref:'User'},
		to:{type:ObjectId,ref:'User'},
		content:String
	}],
	content: String, //评论内容
	meta:{ //更新时的时间记录
		creatAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date,
			default: Date.now()
		}
	}
})
CommentSchema.pre('save',function(next){
	if(this.isNew){ //是否是新增的
		//是新增
		this.meta.creatAt = this.meta.updateAt = Date.now()
	}else{
		//不是新增的
		this.meta.updatAt = Date.now()
	}
	next()
})
CommentSchema.statics = {
	fetch:function(cb){
		return  this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return  this
			.findOne({"_id":id})   //根据id查询一条数据
			.exec(cb)
	}
}

module.exports = CommentSchema