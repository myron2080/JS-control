$(function(){
	initPageState();
});

//禁用
function initPageState(){
	//输入框
	$('input,textarea,select').each(function(){
		$(this).attr('disabled','disabled');
	});
	//超链接
	$('a').each(function(){
		if(!$(this).attr('escape')){//如果有escape属性，则跳过
			$(this).removeAttr('onclick');
			$(this).attr('href','javascript:void(0)');
			$(this).attr('disabled','disabled');
		}
	});
	//F7
	$('div[class="f7"]').each(function(){
		$(this).attr('disabled','disabled');
		$(this).find('span').each(function(){
			$(this).removeAttr('onclick');
		});
		$(this).find('strong').each(function(){
			$(this).removeAttr('onclick');
		});
	});
	//关闭按钮 tab_box_close
	$('div[class="tab_box_close"]').each(function(){
		$(this).css('display','none');
		
	});
	//新增按钮 tab_box_add
	$('.tab_box_add').each(function(){
		$(this).css('display','none');
		
	});
}
