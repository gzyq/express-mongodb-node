$(function(){
	$(".nav>ul>li>a").click(function(e){
		
		$(this).addClass("active").parent().siblings().children('a').removeClass("active");
			
	});

});