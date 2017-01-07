var _= require('underscore');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
//var Comment = require('../app/models/comment');
var Catetory = require('../app/controllers/catetory');
module.exports = function(app){

	//pre handle user会话持久逻辑预处理
	app.use(function(req,res,next){
		var _user = req.session.user;

		app.locals.user = _user; //本地变量

		next()
	});
	//index
	app.get('/', Index.index);

	//signup
	app.post('/user/signup',User.signup);

	//signin
	app.post('/user/signin',User.signin);

	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);

	//signout
	app.get('/signout',User.signout);

	//userlist
	//app.get('/user/userlist',User.userlist);
	//使用中间件
	app.get('/user/userlist',User.signinRequired,User.adminRequired, User.userlist);

	//detail
	app.get('/movie/:id',Movie.detail);

	//update admin
	app.get('/admin/update/:id',User.signinRequired,User.adminRequired,Movie.update);

	//ADMIN post movie表单提交过来的页面
	app.post('/admin/movie/new', User.signinRequired,User.adminRequired,Movie.savePoster, Movie.save);

	app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.new);  //录入

	app.get('/admin/list',User.signinRequired,User.adminRequired,Movie.list);

	//catetory分类
	app.get('/admin/catetory/new',User.signinRequired,User.adminRequired, Catetory.new);
	app.post('/admin/catetory', Catetory.save);
	app.get('/admin/catetory/list', User.signinRequired,User.adminRequired,Catetory.list);
	
	//comment评论
	//需要先登录
	app.post('/user/comment',User.signinRequired,Comment.save);

	//result查询（不需要登录）
	app.get('/results',Index.search);

	
}