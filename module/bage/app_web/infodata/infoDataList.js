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
	$.post(base+'/app_web/infoData/getPagData',para,function(res){
		$("#totalPage").val(res.pageCount);
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var html='';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				//html+='<li><a href="javascript:void(0);" onclick=viewDetail("'+obj.id+'")>';
				//html+='<img onerror=this.src="'+base+'/default/style/images/app_web/app_image_error.jpg"  src="'+base+'/images/'+obj.path.replace("origin","900X300")+'" alt=""/>';
				//html+='<span>'+obj.title+'</span>';
				//html+='</a></li>';
				
				
				html+='<dl onclick=viewDetail("'+obj.id+'")><dt><img onerror=this.src="'+base+'/default/style/images/app_web/noDataImge_S.jpg"  src="'+base+'/images/'+obj.path.replace("origin","300X100")+'" alt=""/>';
				html+='</dt><dd>';
				var content = delHtmlTag(obj.content);
				if(content.length>20)
				content = content.substring(0,20)+"...";	
				html+='<h3>'+obj.title+'</h3>';
				html+=content;
				html+='</dd></dl>';
			}
			if(str == '0'){//初始化
				$("#dataList").html("");
			}
			$("#dataList").append(html);
		}else{
			var html = '';
			html += '<div style="text-align:center;vertical-align:middle;"><span ><img src="' + base + '/default/style/images/defaultimage/nodata_M.png"/></span></div>';
			$("#dataList").html(html);
		}
		hideLoader();
	},'json');
}
function delHtmlTag(str){
	  return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
	 }
function viewDetail(id){
	window.location.href=base+"/app_web/infoData/infoDataView?id="+id;
}
