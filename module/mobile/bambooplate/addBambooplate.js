function releaseData() {
	showload('保存中');
	if(!$("#content").val()){
		commonTipShow('发布内容不能为空');
		hideload();
		return;
	}
	
	var imageStrVal="";
	$("img[imageKey='srcKey']").each(function(i){
		imageStrVal+=$(this).attr("flag")+",";  
	});
	//图片字符串
	$("#photoIdStr").val(imageStrVal);
	$.post(getPath()+"/broker/market/getMarketCount",null,function(count){
		if(count>2){
			commonTipShow('今天您已发布了两条记录，请明天再来','2000');
			hideload();
			return;
		}else{
			if($("#content").val()==""){
				commonTipShow('请输入发布的内容','1000');
				hideload();
				return;
			}
			
			var type = $("span.icon-svg25.Greenico").parent().attr('key');
			$("#type").val(type);
			
			$.post($('form').attr('action'), $('form').serialize(), function(res) {
				if (res.STATE == "SUCCESS") {
					hideload();
					commonTipShow('发布成功','1000');
					window.location.href = base+"/mobile/broker/bambooPlate/list";
				} else {
					commonTipShow(res.MSG,'1000');
					hideload();
				}
			}, 'json');
			
		}
	},'json');
}

function delphoto(id){
	$("#"+id).remove();
}

function saveBtn(obj){
	releaseData();
}

function tdClick(obj){
	var now = $("span.icon-svg25.Greenico");
	if(!$(obj).find('span').hasClass('icon-svg25')){
		now.removeClass('icon-svg25').removeClass('Greenico').addClass('Ashico');
		$(obj).find('span').addClass('icon-svg25').addClass('Greenico').removeClass('Ashico');
	}
}
