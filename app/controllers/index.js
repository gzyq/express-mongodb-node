var Movie = require('../models/movie');
var Catetory = require('../models/catetory');

//get相当于，客户端向服务器发送请求"/"地址，req是服务器收到的请求，res为服务器响应，即返回给客户端的信息
//当地址栏请求"/"时，会执行下面res.render里面的指定页面，
//此处为index
/*app.get('/',function(req,res){ 
	
});*/
exports.index = function(req,res){
	console.log('req.session.user:'+req.session.user);//在session中存储用户状态
	//console.log('req.session.user.name:'+req.session.user.name);//在session中存储用户状态
	Catetory
		.find({})
		.populate({path:'movies',options:{limit:4}})
		.exec(function(err,catetories){
			if(err){
				console.log(err);
			}
			res.render('index',{
				title: "首页",
				catetories: catetories  
			});
		})
}

//点击主页中分类，显示该分类下的电影数据(类似“更多”的功能)
exports.search = function(req,res){
	var catId = req.query.cat;
	var serachWord = req.body.serachWord; //搜索关键字

	var page = parseInt( req.query.page);  //分页(0开始)(parseInt避免页码产生01)
	var count = 2; //设置每页显示几条数据（此处为2条）
	var index = page * count ;  //每页展现2条数据（若从第一条查，就是从数据库的0开始(数据库中movies字段是数据)）
	
	/*if(catId){  //更多*/
		Catetory
			.find({_id : catId})
			.populate({
				path:'movies',
				select : 'title poster', //指定填充Catetory的title和poster字段(拿到title和poster)
				options:{ limit: count ,skip:index} //从哪条开始查(第一页从第0，第二页从第2，比如第二页时，跳过第一第二条数据，拿到第三第四条)
			})
			.exec(function(err,catetories){ //结果是一条catetory
				if(err){
					console.log(err);
				}

				var catetory = catetories[0] || {};  console.log("分类筛选:"+catetory);
				var movies = catetory.movies || [];
				var currentPage =(page +1);
				var totalPage = movies.length/count;  console.log("总movies页数:"+movies.length);

				res.render('results',{
					title: "分类结果列表",
					keyword: catetory.name,
					query: 'cat='+catId,
					currentPage : (page +1),
					totalPage: Math.ceil( movies.length/count), //每页显示count个，共movies.length/count页
					catetory: catetories[0]  
				});

				console.log("第"+currentPage+"页/一共"+totalPage+"页");
			})

	/*}else { //直接搜索
		Movie
			.find({title: serachWord})
			.exec(function(err,movies){
				if(err){
					console.log(err);
				}

				res.render('results',{
					title: "分类结果列表",
					keyword: serachWord,
					query: 'serachWord='+serachWord,
					currentPage : (page +1),
					totalPage: Math.ceil( movies.length/count), //每页显示count个，共movies.length/count页
					catetory: movies[0]  
				});

			})


	}*/


}