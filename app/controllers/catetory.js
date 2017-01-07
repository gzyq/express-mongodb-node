var _= require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Catetory = require('../models/catetory');

exports.new = function(req,res){
	res.render('catetory_admin',{
		title: '后台分类录入页',
		category :{}
	})
}

exports.save = function(req,res){
	var _catetory = req.body.catetory;   console.log("分类名字："+_catetory.name);

	var catetory = new Catetory(_catetory);

	catetory.save(function(err){
		if (err) {
			console.log("err"+err);
		}
		res.redirect('/admin/catetory/list');
	});
}

exports.list = function(req,res){
	Catetory.fetch(function(err,catetories){
		if (err) {
			console.log(err);
		}

		res.render('catetorylist',{
			title: '分类列表页',
			catetories: catetories
		})

	});
}