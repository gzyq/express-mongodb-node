var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	poster: String,
	summary: String,
	flash: String,
	year: Number,
	pv:{
		type: Number,
		default: 0
	},
	catetory:{
		type: ObjectId,
		ref: "Catetory"
	},//分类
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
MovieSchema.pre('save',function(next){
	if(this.isNew){ //是否是新增的
		//是新增
		this.meta.creatAt = this.meta.updateAt = Date.now()
	}else{
		//不是新增的
		this.meta.updatAt = Date.now()
	}
	next()
})
MovieSchema.statics = {
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

module.exports = MovieSchema