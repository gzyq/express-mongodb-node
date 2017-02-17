
var User = require('../models/user');
//signup
//app.post('/user/signup',function(req,res){});
exports.signup = function(req,res){
	//var _user = req.body.user;
	//user/signup/:userid  var _userid = req.params.userid
	//user/signup/1111?userid = 1112   var _userid = req.query.userid
	var _user = req.body.user;
	console.log('username：'+_user.name);
	User.find({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		
		if(user&&user.length>0){//已注册过
			console.log('user has existed,Please sign in');
			return res.redirect('/signin'); 
		}else{  //未注册过
			var user = new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				console.log("signup-user:"+user);
				console.log("the new user has signed up successfully");

				
				return res.redirect('/');
			});
		}
	});
}

//signin
//app.post('/user/signin',function(req,res){})
exports.signin = function(req,res){
	var _user = req.body.user; //拿到表单user
	var name = _user.name;
	var password = _user.password;
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			console.log("this user has not sign");
			res.render('signin',{
				title:'登录页面',
				msg:"该用户未注册，请先注册"
			});


			return res.redirect('/signup')
		}
		//数据库中
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			if (isMatch) { //密码正确
				console.log("Password is right")
				req.session.user = user;	

				return res.redirect('/');
			} else {
				console.log("Password is not right");
				return res.redirect('/signin');
			}
		});

	});
}

exports.showSignup = function(req,res){
	res.render('signup',{
		title:'注册页面'
	});
}
exports.showSignin = function(req,res){
	res.render('signin',{
		title:'登录页面'
	});
}

//signout退出
//app.get('/signout',function(req,res){});
exports.signout = function(req,res){
	delete req.session.user;
	//delete app.locals.user;
	res.redirect('/');
}

//userlist
//app.get('/user/userlist',function(req,res){});
exports.userlist = function(req,res){
	var user = req.session.user;

	if (!user) {
		return res.redirect('/signin');
	}

	if(user.role >10){
		User.fetch(function(err,users){
			if(err){
				console.log(err);
			}
			res.render('userlist',{
				title: "用户列表页",
				users: users
			})
		});
	}
}

//midware for user 是否登录
exports.signinRequired = function(req,res,next){
	var user = req.session.user;

	if (!user) { //如果uer不存在
		console.log('no sign in')
		return res.redirect('/signin');
	}
	next();
}

//midware for admin
exports.adminRequired = function(req,res,next){
	var user = req.session.user;
	if (user.role <= 10) {
		console.log('no role to open userlist page  '+user.name+' '+user.role)
		return res.redirect('/signin');
	}
	next();
}