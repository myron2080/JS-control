$(document).ready(function(){
	bunkData_searchData('0');
	photoData_searchData('0');
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
			    if($("#bunkData").is(':visible')){
			    	if($("#bunkData_currentPage").val()!= $("#bunkData_totalPage").val())
			    	bunkData_searchData('1');
			    }else  if($("#photoData").is(':visible')){
			    	if($("#photoData_currentPage").val()!= $("#photoData_totalPage").val())
			    	photoData_searchData('1');
			    }
		　　}
	});
});
function afterSelec(obj){
	$("#areaId").val($(obj).attr("key"));
	$("#selectArea").html($(obj).attr("name"));
	bunkData_searchData('0');
}
//铺位信息 Start
function bunkData_searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#bunkData_currentPage").val();
	var totalPage=$("#bunkData_totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#bunkData_currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 10;
	para.medi_CompanyId = dataId;
	para.areaId = $("#areaId").val();
	$.post(base+'/app_web/medicompany/getBunkPagData',para,function(res){
		$("#bunkData_totalPage").val(res.pageCount);
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var html='';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				html+='<dl>';
				html+='<dt><a href="javascript:void(0);" onclick="toDitu(this);" mapX="'+obj.bunk_X+'" mapY="'+obj.bunk_Y+'" name="'+obj.bunkName+'">地图位置</a>';
				var areaName ='';
				if(obj.area)
				areaName = obj.area.name;
				html+='<h3>'+areaName+'-'+obj.bunkName+'</h3>';
				html+='</dt>';
				html+='<dd>';
				html+='<ul>';
				html+='<li><span class="title">联系人：</span>'+obj.linkman+' ('+obj.phone+')</li>';
				html+='<li><span class="title">铺位地址：</span>'+obj.bunkAdd+'</li>';
				html+='</ul>';
				html+='<div class="maplist">';
				html+='<ul>';
				if(obj.photoPag){
			    var photoList = obj.photoPag.items;
			    for(o in photoList){
			    	html+=' <a key="swipe" onclick="intiPsw(this);" href="'+base+'/images/'+photoList[o].path.replace("_size","_origin")+'" rel="external" >';
			    	html+='<li><span><img src="'+base+'/images/'+photoList[o].path.replace("_size","_150X100")+'" alt=""/></span></li>';
			    	html+='</a>';
			    }
			    if(obj.photoPag.recordCount>3)
				html+='<li><span>共'+obj.photoPag.recordCount+'张</span></li>';
				}
				html+='</ul></div>';
				html+='</dd>';
				html+='</dl>';
				
			}
			if(str == '0'){//初始化
				$("#bunkDataList").html("");
			}
			$("#bunkDataList").append(html);
			$("a[key='swipe']").photoSwipe();
		}else{
			var html = '';
			html += '<div style="text-align:center;vertical-align:middle;"><span ><img src="' + base + '/default/style/images/app_web/noDataImge_M.png"/></span></div>';
			$("#bunkDataList").html(html);
		}
		hideLoader();
	},'json');
}
function intiPsw(obj){
  var key=$(obj).attr("key");
  
}
//铺位信息 End

//图片信息 Start
function photoData_searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#photoData_currentPage").val();
	var totalPage=$("#photoData_totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#photoData_currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 10;
	para.albumId = dataId;
	$.post(base+'/app_web/medicompany/getPhotoPagData',para,function(res){
		$("#photoData_totalPage").val(res.pageCount);
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var html='';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				html+='<li><img  onerror="this.src='+base+'/default/style/images/app_web/app_image_error.jpg" src="'+base+'/images/'+obj.path.replace("_size","_900X300")+'" alt=""/></li>';
			}
			if(str == '0'){//初始化
				$("#photoDataList").html("");
			}
			$("#photoDataList").append(html);
		}else{
			var html = '';
			html += '<div style="text-align:center;vertical-align:middle;"><span ><img src="' + base + '/default/style/images/app_web/noDataImge_M.png"/></span></div>';
			$("#photoDataList").html(html);
		}
		hideLoader();
	},'json');
}
//图片信息 End
function toDitu(obj){
	var mapX = $(obj).attr("mapX");
	var mapY = $(obj).attr("mapY");
	if(mapX&&mapY){
	var href = base+'/app_web/medicompany/mapView?mapX='+mapX+'&mapY='+mapY+'&name='+$(obj).attr("name");
	window.location.href=href;
	}else{
		showwarndiv("未获取到地图坐标！",1000);
	}
}
function toBunkListMap(){
	window.location.href=base+'/app_web/medicompany/bunkListMap?medi_CompanyId='+dataId;
}
function toRecoveryView(){
	window.location.href=base+'/app_web/medicompany/bunkListMap?medi_CompanyId='+dataId+"&userId"+userId;
}
function AutoResizeImage(maxWidth,maxHeight,objImg){
	var img = new Image();
	img.src = objImg.src;
	var hRatio;
	var wRatio;
	var Ratio = 1;
	var w = img.width;
	var h = img.height;
	wRatio = maxWidth / w;
	hRatio = maxHeight / h;
	if (maxWidth ==0 && maxHeight==0){
	Ratio = 1;
	}else if (maxWidth==0){//
	if (hRatio<1) Ratio = hRatio;
	}else if (maxHeight==0){
	if (wRatio<1) Ratio = wRatio;
	}else if (wRatio<1 || hRatio<1){
	Ratio = (wRatio<=hRatio?wRatio:hRatio);
	}
	if (Ratio<1){
	w = w * Ratio;
	h = h * Ratio;
	}
	objImg.height = h;
	objImg.width = w;
	}
