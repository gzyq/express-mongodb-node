var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CatetorySchema = new Schema({
	name:String, //根据名字拿到分类下所有电影
	movies:[{
		type:ObjectId,
		ref:'Movie'
	}], //数组，存放属于该分类下所有电影
	meta:{ //更新时的时间记录
		creatAt:{
			type:Date,
			default: Date.now()
		},
		updateAt:{
			type:Date,
			default: Date.now()
		}
	}
})
CatetorySchema.pre('save',function(next){
	if(this.isNew){ //是否是新增的
		//是新增
		this.meta.creatAt = this.meta.updateAt = Date.now()
	}else{
		//不是新增的
		this.meta.updatAt = Date.now()
	}
	next()
})

CatetorySchema.statics = {
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

module.exports = CatetorySchema