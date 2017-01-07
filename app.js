var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');//在mongoStore前面
var mongoStore = require('connect-mongo')(session);  //持久会话
var logger = require('morgan'); //中间件logger
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty'); //对应form表单enctype="multipart/form-data"的中间件

var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl); //若imooc数据库不存在会自动创建

app.use(cookieParser());
app.use(multipart()); 
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url: dbUrl,//本地mongodb地址
		collection: 'sessions'
	}),
	resave: false,
    saveUninitialized: true
}));

//app.config
//推荐
if('development'=== app.get('env')){
	app.set("showStackError",true);
	app.use(logger(':method:url:status')); //在控制台打出调用的方法名、url、状态，以及数据库的操作信息
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

app.set('views','./app/views/pages');
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);

//app.locals 
////把请求体转换成对象
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));  //此项必须在 bodyParser.json 下面,为参数编码

require('./config/routes')(app);
console.log('imooc start port'+port);

var TestModel = require('./app/models/demo');

var TestEntity = new TestModel({
        name : "gzygq",
        age  : 26,
        email: "gzyq@qq.com",
    });
TestEntity.save();