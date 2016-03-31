var setting = {
		check: {
			enable: true,
			chkboxType: {"Y":"", "N":""}
		},
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
//			beforeClick: beforeClick,
//			onCheck: onCheck
		}
	};
var zNodes;
$(document).ready(function(){
	var fromData = $("#fromData").val();
	//入口是地图查盘
	if(fromData == 'dataMap'){
		setTab('one',3,4);
	}
});
/**
 ***************************
 ** 页签切换
 ***************************
 */
function setTab(name,cursel,n){
	for(i=1;i<=n;i++){
		var menu=document.getElementById(name+i);
		var con=document.getElementById("con_"+name+"_"+i);
		menu.className=i==cursel?"hover":"";
		con.style.display=i==cursel?"block":"none";
	}
	var gardenId=$("#gardenId").val();
	var paramStr = $("#gardenParamStr").val();
	if(cursel==3){	//楼栋
		$("#buildingView").attr("src",getPath()+"/projectm/pmGarden/buildingView?gardenId="+gardenId + "&paramStr=" + paramStr+"&cityId="+cityId);
	}
}

/**
 ***************************
 ** 图片移到相框去
 ***************************
 */
function toBigPhoto(url){	
	$(".bigphoto").html("<img src='"+url.replace("size","400X300")+"'/>");
	//$('[enlarger]').attr("enlarger",url);
	$(".bigphoto").attr("enlarger",url.replace("size","origin"));
	$("#bigShow").attr("enlarger",url.replace("size","origin"));
	
}

/**
 ***************************
 ** 图片翻页
 ***************************
 */
function changePageImage(flag,count,gardenId,pageCount){	
	if(count==0)return;
	var page=parseInt($("#image_page").val());
	var totalPage=Math.ceil(parseInt(count)/pageCount);	
	if(flag=="last"){	//上一页
		if(page==1){
			return;
		}else{
			page=page-1;
			doPageImage(page,gardenId,pageCount);
			$("#next_imgPage img").attr("src",base+"/default/style/images/garden/loupan06.gif");
			if(page==1){
				$("#last_imgPage img").attr("src",base+"/default/style/images/garden/loupan03.gif");
			}else{
				$("#last_imgPage img").attr("src",base+"/default/style/images/garden/loupan05.gif");
			}
		}
	}else if(flag=="next"){		//下一页
		if(page==totalPage){
			return;
		}else{
			page=page+1;
			doPageImage(page,gardenId,pageCount);
			$("#last_imgPage img").attr("src",base+"/default/style/images/garden/loupan05.gif");
			if(page==totalPage){
				$("#next_imgPage img").attr("src",base+"/default/style/images/garden/loupan04.gif");
			}else{
				$("#next_imgPage img").attr("src",base+"/default/style/images/garden/loupan06.gif");
			}
		}
	}
}

/**
 ***************************
 ** 处理图片翻页
 ***************************
 */
function doPageImage(page,gardenId,pageCount){	
	$.post(getPath()+"/projectm/pmGarden/turnGardenImagePage?imageType=PLOTFIGURE",{gardenId:gardenId,currentPage:page,pageSize:pageCount},function(data){
		var img_li="";
		for(var i=0;i<data.items.length;i++){
			img_li=img_li+"<li onclick=toBigPhoto('"+imgBase+"/"+data.items[i].url+"')><img src='"+imgBase+"/"+data.items[i].url.replace("size","100X75")+"'/></li>";
		}
		$(".imglist ul").html(img_li);
		$("#image_page").val(page);
	},"json");
}

/**
 ***************************
 ** 查看楼栋tree
 ***************************
 */
function showMenu() {
	$.post(getPath()+"/projectm/pmGarden/getGardensByKey",{term:$("#gardenName").val()},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);		
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#gardenName");
			var cityOffset = $("#gardenName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");	
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "gardenName" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
	



//查看户型图start
// 图片移到相框去
function toBigPhotoUnit(url,name){	
	$("#bigphotoUnit").html("<img src='"+url.replace("size","400X300")+"' style='max-width:420px;max-height:300px;'/><br>"+name);
	$("#bigphotoUnit").attr("enlarger",url.replace("size","origin"));
}
 //图片翻页
function changePageImageUnit(flag,count,gardenId,pageCount){	
	if(count==0)return;
	var page=parseInt($("#image_pageUnit").val());
	var totalPage=Math.ceil(parseInt(count)/pageCount);	
	if(flag=="last"){	//上一页
		if(page==1){
			return;
		}else{
			page=page-1;
			doPageImageUnit(page,gardenId,pageCount);
			$("#next_imgPageUnti img").attr("src",base+"/default/style/images/garden/loupan06.gif");
			if(page==1){
				$("#last_imgPageUnit img").attr("src",base+"/default/style/images/garden/loupan03.gif");
			}else{
				$("#last_imgPageUnit img").attr("src",base+"/default/style/images/garden/loupan05.gif");
			}
		}
	}else if(flag=="next"){		//下一页
		if(page==totalPage){
			return;
		}else{
			page=page+1;
			doPageImageUnit(page,gardenId,pageCount);
			$("#last_imgPageUnit img").attr("src",base+"/default/style/images/garden/loupan05.gif");
			if(page==totalPage){
				$("#next_imgPageUnti img").attr("src",base+"/default/style/images/garden/loupan04.gif");
			}else{
				$("#next_imgPageUnti img").attr("src",base+"/default/style/images/garden/loupan06.gif");
			}
		}
	}
}
//处理图片翻页
function doPageImageUnit(page,gardenId,pageCount){	
	$.post(getPath()+"/projectm/pmGarden/turnGardenImagePage?imageType=UNITFIGURE",{gardenId:gardenId,currentPage:page,pageSize:pageCount},function(data){
		var img_li="";
		for(var i=0;i<data.items.length;i++){
			img_li=img_li+"<li onclick=toBigPhotoUnit('"+imgBase+"/"+data.items[i].url+"','"+data.items[i].name+"')><img src='"+imgBase+"/"+data.items[i].url.replace("size","100X75")+"'/></li>";
		}
		$("#unitImageList ul").html(img_li);
		$("#image_pageUnit").val(page);
	},"json");
}


function changePageImageDist(flag,count,gardenId,pageCount){	
	if(count==0)return;
	var page=parseInt($("#image_pageDist").val());
	var totalPage=Math.ceil(parseInt(count)/pageCount);	
	if(flag=="last"){	//上一页
		if(page==1){
			return;
		}else{
			page=page-1;
			doPageImageUnit(page,gardenId,pageCount);
			$("#next_imgPageDist img").attr("src",base+"/default/style/images/garden/loupan06.gif");
			if(page==1){
				$("#last_imgPageDist img").attr("src",base+"/default/style/images/garden/loupan03.gif");
			}else{
				$("#last_imgPageDist img").attr("src",base+"/default/style/images/garden/loupan05.gif");
			}
		}
	}else if(flag=="next"){		//下一页
		if(page==totalPage){
			return;
		}else{
			page=page+1;
			doPageImageUnit(page,gardenId,pageCount);
			$("#last_imgPageDist img").attr("src",base+"/default/style/images/garden/loupan05.gif");
			if(page==totalPage){
				$("#next_imgPageDist img").attr("src",base+"/default/style/images/garden/loupan04.gif");
			}else{
				$("#next_imgPageDist img").attr("src",base+"/default/style/images/garden/loupan06.gif");
			}
		}
	}
}
//处理图片翻页
function doPageImageDist(page,gardenId,pageCount){	
	$.post(getPath()+"/projectm/pmGarden/turnGardenImagePage?imageType=DISTTFIGURE",{gardenId:gardenId,currentPage:page,pageSize:pageCount},function(data){
		var img_li="";
		for(var i=0;i<data.items.length;i++){
			img_li=img_li+"<li onclick=toBigPhotoDist('"+imgBase+"/"+data.items[i].url+"','"+data.items[i].name+"')><img src='"+imgBase+"/"+data.items[i].url.replace("size","100X75")+"'/></li>";
		}
		$("#distImageList ul").html(img_li);
		$("#image_pageDist").val(page);
	},"json");
}

function toBigPhotoDist(url,name){	
	$("#bigphotoDist").html("<img src='"+url.replace("size","400X300")+"' style='max-width:420px;max-height:300px;'/><br>"+name);
	$("#bigphotoDist").attr("enlarger",url.replace("size","origin"));
}

