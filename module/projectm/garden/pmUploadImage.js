var upload;
var uploadImages = {};
$(document).ready(function(){
	initGardenUpload();
	EnlargerImg.init();	//放大图片
	$("li").click(function(){
		$(this).addClass("hover").siblings("li").removeClass("hover");
		var div_id=$(this).attr("id");
		
		if(div_id=="gardenImg"){
			$(".prolisttitle").show();
			$("#roomImg_div").hide();
			$("#distImg_div").hide();
			$("#gardenImg_div").show();
			$("#uploadPhotoType").val("PLOTFIGURE");
			upload.setPostParams({direct:'plot/images',belong:gardenId,uploadType:"PLOTFIGURE"});
			loadGardenImages();
		}
		if(div_id=="roomImg"){
			$(".prolisttitle").show();
			$("#gardenImg_div").hide();
			$("#distImg_div").hide();
			$("#roomImg_div").show();
			$("#uploadPhotoType").val("UNITFIGURE");
			upload.setPostParams({direct:'unit/images',belong:gardenId,uploadType:"UNITFIGURE"});
			loadUnitImages();
		}
		if(div_id=="distributionImg"){
			
			$("#gardenImg_div").hide();
			$("#roomImg_div").hide();
			$("#distImg_div").show();
			$("#uploadPhotoType").val("DISTTFIGURE");
			upload.setPostParams({direct:'dist/images',belong:gardenId,uploadType:"DISTTFIGURE"});
			loadDistImages();
			$(".prolisttitle").hide();
		}
	});
	if(type=='hx'){
		setTimeout(function() {
			$(this).addClass("hover").siblings("li").removeClass("hover");
			var div_id=$(this).attr("id");
			$("#gardenImg_div").hide();
			$("#distImg_div").hide();
			$("#roomImg_div").show();
			$("#uploadPhotoType").val("UNITFIGURE");
			upload.setPostParams({direct:'unit/images',belong:gardenId,uploadType:"UNITFIGURE"});
			loadUnitImages();
		}, 1000);
		$("#roomImg").click();
	}
	
	if(type=='fb'){
		setTimeout(function() {
			$(this).addClass("hover").siblings("li").removeClass("hover");
			var div_id=$(this).attr("id");
			$("#gardenImg_div").hide();
			$("#roomImg_div").hide();
			$("#distImg_div").show();
			$("#uploadPhotoType").val("DISTTFIGURE");
			upload.setPostParams({direct:'dist/images',belong:gardenId,uploadType:"DISTTFIGURE"});
			loadDistImages();
		}, 1000);
		$("#distributionImg").click();
	}
	if(type=='xq'){
		setTimeout(function() {
			$(this).addClass("hover").siblings("li").removeClass("hover");
			var div_id=$(this).attr("id");
			$("#gardenImg_div").show();
			$("#roomImg_div").hide();
			$("#distImg_div").hide();
			$("#uploadPhotoType").val("PLOTFIGURE");
			upload.setPostParams({direct:'dist/images',belong:gardenId,uploadType:"PLOTFIGURE"});
			loadGardenImages();
		}, 1000);
		$("#gardenImg").click();
	}
});
function initGardenUpload(){
		$('uploadImage').empty();
		upload = new SWFUpload({
			upload_url: getPath() + '/projectm/pmRoom/propertyUploadImage?cityId='+cityId,
			file_post_name:'image',
			post_params: {direct:'plot/images',belong:gardenId,uploadType:"PLOTFIGURE"},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var photoType = $("#uploadPhotoType").val();
				var f;
				if(photoType=="PLOTFIGURE"){
					f = $('<dl></dl>').appendTo($('#gardenPhotoList'));
					$('<dt><img src="'+getPath()+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
				}
				if(photoType=="UNITFIGURE"){
					f = $('<dl></dl>').appendTo($('#unitPhotoList'));
					$('<dt><img src="'+getPath()+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
				}
				if(photoType=="DISTTFIGURE"){
					f = $('<dl></dl>').appendTo($('#distPhotoList'));
					$('<dt><img src="'+getPath()+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
				}
				
				uploadImages[file.id] = f;
			},
			file_queue_error_handler : function(file, errorCode, message){
				try {
					if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
						art.dialog.tips('上传的文件太多啦');
						return;
					}
					switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							art.dialog.tips('上传的文件太大:'+file.name);
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
							art.dialog.tips('上传的文件为空:'+file.name);
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
							art.dialog.tips('上传的文件类型不符:'+file.name);
							break;
						case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
							art.dialog.tips('上传的文件太多啦:'+file.name);
							break;
						default:
							art.dialog.tips('未知错误');
							break;
					}
				} catch (ex) {
			        this.debug(ex);
			    }
			},
			file_dialog_complete_handler : function(selectNum,queueNum){
				if(selectNum > 0 && queueNum > 0){
					upload.startUpload();
				}
			},
			upload_start_handler : null,
			upload_progress_handler : null,
			upload_error_handler : null,
			upload_success_handler : function(file, serverData, responseReceived){
				if(uploadImages[file.id]){
					var res = eval('(' + serverData + ')');
					var im = uploadImages[file.id];
					im.empty();
					im.attr('id',res.id);
					
					window.location.reload();
//					$('<dt><img id='+res.id+' enlarger="'+getPath()+'/images/' + res.path.replace("size","origin")+'" src="'+getPath()+'/images/'+res.path.replace("size","100X75")+'" onmouseover="showImgInfo(this)"  onmouseout="hideImgDiv()"/></dt>').appendTo(im);
//					$('<dd><a href="javascript:void(0)" enlarger="'+getPath()+'/images/' + res.path+'"><img src="'+getPath()+'/default/style/images/photo02.gif"/>原图</a> <a href="javascript:deletePhoto(\''+res.id+'\',\''+res.uploadType+'\')"><img src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a></dd>').appendTo(im);
					EnlargerImg.init();	//放大图片
				}//onclick="viewLargePhoto(\''+(getPath()+'/images/' + res.path)+'\')"
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_btn.gif',
			button_placeholder_id : "uploadImage",
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {},
			debug: false
		});
}

function loadGardenImages(){
	var utinImgStr="";
	$("#gardenPhotoList").html("");
	$.post(getPath() + '/projectm/pmRoom/loadGardenImages',{id:gardenId,cityId:cityId},function(res){
		$("#gardenPhotoList").html("");
		if(res.unitImages){
			for(var i=0;i<res.unitImages.length;i++){
				var unitImg=res.unitImages[i];
				utinImgStr+="<dl id='"+unitImg.id+"'>";
				utinImgStr+="<dt><div class='imgan'>" +
				"<a href='javascript:void(0)' escape='true'  enlarger='"+getPath()+"/images/"+unitImg.url.replace("size","origin")+"'>"+
				"<img src='"+getPath()+"/default/style/images/garden/ico2.png'/>修改</a>"+
				"<a href='javascript:deletePhoto(\""+unitImg.id+"\",\"PLOTFIGURE\")'>"+
				"<img src='"+getPath()+"/default/style/images/garden/ico3.png'/>删除</a></div></h3>"+
				"<img width='220' height='120' id='"+unitImg.id+"' enlarger='"+getPath()+"/images/"+unitImg.url.replace("size","origin")+"'" +
				" src='"+getPath()+"/images/"+unitImg.url.replace("size","100X75")+"' onmouseover='showImgInfo(this)'  onmouseout='hideImgDiv()'/></dt>";
				utinImgStr+= "<dd><h3>";
				if(unitImg.auditer == null || unitImg.auditer.name==""){
					utinImgStr += "<a href='javascript:void(0);' onclick='audit(\""+unitImg.id+"\",this)'>审核</a>";
				}
				utinImgStr += "<lable style=\"cursor: pointer;\" onclick='cancelImage(\""+unitImg.id+"\")'>取消关联</lable></h3>";
				if(unitImg.upLoadPerson != null){
					utinImgStr += "<ul><li><span>"+unitImg.upLoadPerson.name+" 上传</span>"+unitImg.upLoadTime+"</li> ";
				}else{
					utinImgStr += "<ul><li><span>未知上传</span>"+unitImg.upLoadTime+"</li> ";
				}
				
				if(unitImg.auditer != null && unitImg.auditer.name!=""){
					utinImgStr += "<li><span>"+unitImg.auditer.name+" 审批</span>"+unitImg.auditDate+"</li>";
				}
				utinImgStr += "</ul></dd></dl>";
			}
			$("#gardenPhotoList").append(utinImgStr);
			EnlargerImg.init();	//放大图片
		}
	},'json');
}

//加载户型图
function loadUnitImages(){
	var utinImgStr="";
	$("#unitPhotoList").html("");
	$.post(getPath() + '/projectm/pmRoom/loadUnitImage',{id:gardenId,cityId:cityId},function(res){
		$("#unitPhotoList").html("");
		if(res.unitImages){
			for(var i=0;i<res.unitImages.length;i++){
				var unitImg=res.unitImages[i];
				utinImgStr+="<dl id='"+unitImg.id+"'>";
				utinImgStr+="<dt><div class='imgan'>" +
				"<a href='javascript:void(0)' escape='true'  enlarger='"+getPath()+"/images/"+unitImg.url.replace("size","origin")+"'>"+
				"<img src='"+getPath()+"/default/style/images/garden/ico2.png'/>修改</a>"+
				"<a href='javascript:deletePhoto(\""+unitImg.id+"\",\"UNITFIGURE\")'>"+
				"<img src='"+getPath()+"/default/style/images/garden/ico3.png'/>删除</a></div></h3>"+
				"<img width='220' height='120' id='"+unitImg.id+"' enlarger='"+getPath()+"/images/"+unitImg.url.replace("size","origin")+"'" +
				" src='"+getPath()+"/images/"+unitImg.url.replace("size","100X75")+"' onmouseover='showImgInfo(this)'  onmouseout='hideImgDiv()'/></dt>";
				utinImgStr+= "<dd><h3>";
				if(unitImg.auditer == null || unitImg.auditer.name==""){
					utinImgStr += "<a href='javascript:void(0);' onclick='audit(\""+unitImg.id+"\",this)'>审核</a>";
				}
				utinImgStr += "<lable style=\"cursor: pointer;\" onclick='cancelImage(\""+unitImg.id+"\")'>取消关联</lable></h3>";
				if(unitImg.upLoadPerson != null){
					utinImgStr += "<ul><li><span>"+unitImg.upLoadPerson.name+" 上传</span>"+unitImg.upLoadTime+"</li> ";
				}else{
					utinImgStr += "<ul><li><span>未知上传</span>"+unitImg.upLoadTime+"</li> ";
				}
				
				if(unitImg.auditer != null && unitImg.auditer.name!=""){
					utinImgStr += "<li><span>"+unitImg.auditer.name+" 审批</span>"+unitImg.auditDate+"</li>";
				}
				utinImgStr += "</ul></dd></dl>";
			}
			$("#unitPhotoList").append(utinImgStr);
			EnlargerImg.init();	//放大图片
		}
	},'json');
}

function cancelImage(imageId){
	$.post(base+"/projectm/pmRoom/cancelImage",{imageId:imageId},function(res){
		if(res.STATE=="SUCCESS"){
			art.dialog.tips("操作成功！");
		}
	},"json");
}

function loadDistImages(){
	var utinImgStr="";
	$("#distPhotoList").html("");
	$.post(getPath() + '/projectm/pmRoom/loadDistImage',{id:gardenId},function(res){
		$("#distPhotoList").html("");
		if(res.unitImages){
			for(var i=0;i<res.unitImages.length;i++){
				var unitImg=res.unitImages[i];
				utinImgStr+="<dl id='"+unitImg.id+"'>";
				utinImgStr+="<dt><div class='imgan'>" +
				"<a href='javascript:void(0)' escape='true'  enlarger='"+getPath()+"/images/"+unitImg.url.replace("size","origin")+"'>"+
				"<img src='"+getPath()+"/default/style/images/garden/ico2.png'/>修改</a>"+
				"<a href='javascript:deletePhoto(\""+unitImg.id+"\",\"PLOTFIGURE\")'>"+
				"<img src='"+getPath()+"/default/style/images/garden/ico3.png'/>删除</a></div></h3>"+
				"<img width='220' height='120' id='"+unitImg.id+"' enlarger='"+getPath()+"/images/"+unitImg.url.replace("size","origin")+"'" +
				" src='"+getPath()+"/images/"+unitImg.url.replace("size","100X75")+"' onmouseover='showImgInfo(this)'  onmouseout='hideImgDiv()'/></dt>";
				utinImgStr+= "<dd><h3>";
				if(unitImg.auditer == null || unitImg.auditer.name==""){
					utinImgStr += "<a href='javascript:void(0);' onclick='audit(\""+unitImg.id+"\",this)'>审核</a>";
				}
				utinImgStr += "<lable style=\"cursor: pointer;\" onclick='cancelImage(\""+unitImg.id+"\")'>取消关联</lable></h3>";
				if(unitImg.upLoadPerson != null){
					utinImgStr += "<ul><li><span>"+unitImg.upLoadPerson.name+" 上传</span>"+unitImg.upLoadTime+"</li> ";
				}else{
					utinImgStr += "<ul><li><span>未知上传</span>"+unitImg.upLoadTime+"</li> ";
				}
				
				if(unitImg.auditer != null && unitImg.auditer.name!=""){
					utinImgStr += "<li><span>"+unitImg.auditer.name+" 审批</span>"+unitImg.auditDate+"</li>";
				}
				utinImgStr += "</ul></dd></dl>";
			}
			$("#distPhotoList").append(utinImgStr);
			EnlargerImg.init();	//放大图片
		}
	},'json');
}

function deletePhoto(id,uploadType){
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/projectm/pmRoom/deleteGardenImage?imageType='+uploadType,{id:id,cityId:cityId},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
				art.dialog.tips("删除成功!",null,"succeed");
				window.location.reload();
			}else if(res.STATE=="ERROR"){
				art.dialog.tips("户型图已经被设置,不能删除!");
			}else{
				art.dialog.tips("删除失败!");
			}
		},'json');
	});
}
//显示图片详细信息
function showImgInfo(obj){
	$("#showInfoDiv").html("");
	//图片的上方距离
	var X = $(obj).offset().top;
	//图片的左方距离
	var Y = $(obj).offset().left;
	var width_div=$(window).width();
	var height_div=$(window).height();
	//div的宽度
	var imgInfo_width=$("#showInfoDiv").width();
	//div的高度
	var imgInfo_height=$("#showInfoDiv").height();
	var y_width=0;
	var x_height=0;
	var imgSrc=$(obj).attr("src");
	//图片加上显示图片详细信息层的宽度大于当前弹出层的宽度
	if((Y+imgInfo_width)>width_div){
		y_width=Y-70;
	}else{
		y_width=Y;
	}
	//图片加上显示图片详细信息层的宽度大于当前弹出层的高度
	/*if((X+imgInfo_height)>height_div){
		x_height=X-150;
	}else{
		x_height=X;
	}*/
	var id=$(obj).attr("id");
	//alert($(window).height());
	$("#showInfoDiv").css({left:y_width,top:X+100});
	$.post(getPath() + '/projectm/pmRoom/showImageInfo',{id:id,cityId:cityId},function(res){
		var imgInfoStr="";
		$("#showInfoDiv").html("");
		if(res.imageInfo){
			imgInfoStr+="<span>"+res.imageInfo.name+"</span><br>";
			if(res.imageInfo.upLoadPerson.userName&&res.imageInfo.upLoadPerson.phone&&res.upLoadTime){
				imgInfoStr+="<span>上传人:"+res.imageInfo.upLoadPerson.userName+"</span>&nbsp;&nbsp;<span>电话:"+res.imageInfo.upLoadPerson.phone+"</span>"+"<br><span>上传时间:"+res.upLoadTime+"</span>"
			}
			$("#showInfoDiv").html(imgInfoStr);
			$("#showInfoDiv").show();
		}
	},'json');
}
//隐藏div
function hideImgDiv(){
	$("#showInfoDiv").hide();
}
/*function viewPhoto(id){
	art.dialog.open(getPath() + '/projectm/pmRoom/view?id='+id,{
		title:'图片查看',
		lock:true,
		height:'auto',
		width:'auto',
		id:'viewPhoto',
		button:[{name:'关闭'}]
	});
}*/
//显示原图
function viewLargePhoto(path){
	window.open(path,'_blank','top=0,left=0,scrollbars=yes,resizable=true,toolbar=no,location=no');//,height='+screen.height+',width='+screen.width);
}

function audit(id,obj){
	$.post(base+"/projectm/pmRoom/audit",{id:id,cityId:cityId},function(res){
		if(res.STATE == "SUCCESS"){
			art.dialog.tips('审核成功！');
			window.location.reload();
		}
	},"json");
}