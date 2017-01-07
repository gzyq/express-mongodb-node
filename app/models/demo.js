//var db = mongoose.connect("mongodb://127.0.0.1:27017/test");

// 创建Model
var mongoose = require('mongoose');
var TestSchema= require('../schemas/demo');
var TestModel = mongoose.model("test",TestSchema);
module.exports = TestModel;