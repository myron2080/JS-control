

$(document).ready(function() {
	//统计数量
	getCount();
	//加载数据
	searchData(1);
})

function searchData(page) {
	//
	$.ajax({type:"POST",
			url:getPath()+"/ebsite/weixin/participants/getOrderList",
			dataType:"json",
			data:{page:page},
			success:function(res){
				setValue(res);//设置列表数据
				setPage(res);//设置分页按钮
		   }

		});
}

function setValue(data){
	$("#paiming").html('');
	var home = "<tr><th width='16%'>排名</th><th width='24%'>编号</th><th width='30%'>名称</th><th width='30%'>票数</th></tr>";
	var page = parseInt(data.currentPage);//当前页
//	var count = parseInt(data.count);//总条数
	var pagesize = 10;//每页数
	var index = (page-1)*pagesize;
	for ( var info in data.items) {
		home += "<tr><td>"+(index+parseInt(info)+1)+"</td><td>"+data.items[info].pNumber+"</td>" +
				"<td>"+data.items[info].playerName+"</td><td>"+data.items[info].pCount+"</td></tr>";
	}
	$("#paiming").append(home);
}

