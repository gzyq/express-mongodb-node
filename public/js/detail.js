$(function(){
	/*互相评论*/
	$('.a_replay').click(function(){
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');
		$('<input>').attr({
			type:'hidden',
			name:'comment[tid]',
			value: toId
		}).appendTo('#commForm'); //插入到表单中

		$('<input>').attr({
			type:'hidden',
			name:'comment[cid]',
			value: commentId
		}).appendTo('#commForm'); //插入到表单中

	});


})
