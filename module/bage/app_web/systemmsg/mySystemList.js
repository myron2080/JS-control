$(document).ready(function(){
	searchData('0');
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
		　　　　searchData('1');
		　　}
	});
});


function searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 10;
	para.userId = userId;
	para.orderBy ='D.FCREATETIME DESC';
	$.post(base+'/app_web/mySystemmsg/getPagData',para,function(res){
		$("#totalPage").val(res.pageCount);
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var html='';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				html+='<dl onclick=viewDetail("'+obj.id+'");>';
				html+='<dd>';
				html+='<h3>'+obj.title+'</h3>';
				html+=obj.content;
			    html+='</dd>';
			    var creatorName ='系统通知';
			    if(obj.systemMsg.creator)
			    creatorName = obj.systemMsg.creator.name;
				html+='<dt><span>'+obj.createTime+'</span>'+obj.systemMsg.creator.name+'</dt>';
				html+='</dl>';
			}
			if(str == '0'){//初始化
				$("#dataList").html("");
			}
			$("#dataList").append(html);
		}else{
			var html = '';
			html += '<div style="text-align:center;vertical-align:middle;"><span style=" text-align:center;height:'+window.screen.height+'px;padding: 0 100px;display: block;"><img width="100%" src="' + base + '/default/style/images/app_web/noDataImge_M.jpg"/></span></div>';
			$("#dataList").html(html);
			//$("#dataList").height(document.body.clientHeight);
		}
		hideLoader();
	},'json');
}
function viewDetail(id){
	window.location.href=base+"/app_web/mySystemmsg/mySystemMsgView?id="+id;
}
