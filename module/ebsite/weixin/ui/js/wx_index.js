

$(document).ready(function() {
	//统计数量
	getCount();
	//加载数据
	searchData(1);
	//判断是否关注
	isAttention();
})

function searchData(page) {
	// 关键字
	var keyWord = $("#keyWord").val();
	if (keyWord != ""&& keyWord != $("#keyWord").attr("defaultValue")) {
		$list_dataParam['key'] = keyWord;
	} else {
		delete $list_dataParam['key'];
	}
	//
	$.ajax({type:"POST",
			url:getPath()+"/ebsite/weixin/participants/getData",
			dataType:"json",
			data:{keyWord:$list_dataParam['key'],page:page},
			success:function(res){
				setValue(res.items);//设置列表数据
				setPage(res);//设置分页按钮
		   }

		});
}

function setValue(data){
	var home = "";
	$(".homelist").html("");
	var imgpath = "";
	for ( var info in data) {
		imgpath = (data[info].iconPath).replace("_size","_origin");
		home += "<div class='homelist1'>" +
				"<dl><dt><img src='"+getPath()+"/images/"+imgpath+"' onerror='errorImg(this);' />" +
				"<span>编号："+data[info].pNumber+"</span></dt><dd><div class='name'><span>"+data[info].pCount+"票</span>"+data[info].playerName+"</div>" +
				"<a href='"+getPath()+"/ebsite/weixin/participants/imgDetail?id="+data[info].id+"'>投票</a></dd></dl></div>";
	}
	$(".homelist").append(home);
}

