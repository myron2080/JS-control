var upload;
var uploadImages = {};
var gardenId="";
$(document).ready(function(){
	initGardenUpload();
	EnlargerImg.init();	//放大图片
});
function initGardenUpload(){
		$('uploadImage').empty();
		upload = new SWFUpload({
			upload_url: base + '/p2p/investmentProject/updateProjectPhoto',
			file_post_name:'image',
			post_params: {direct:'plot/images',belong:projectId,uploadType:"PLOTFIGURE"},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var f;
					f = $('<li></li>').appendTo($('#imageInfoList'));
					$('<dt><img src="'+base+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
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
					
					$('<img width="100px" height="75px" id='+res.id+' enlarger="'+base+'/images/' + res.path.replace("size","origin")+'" src="'+base+'/images/'+res.path.replace("size","100X75")+'" /><input type="text"  value="'+file.name+'" onchange="updateImageName(\''+res.id+'\',this)"/><a href="javascript:deletePhoto(\''+res.id+'\',\''+res.uploadType+'\')"><img src="'+base+'/default/style/images/photo03.gif"/>删除</a>').appendTo(im);
					EnlargerImg.init();	//放大图片
				}
			},
			upload_complete_handler : null,
			button_image_url:base+'/default/style/images/add_btn.gif',
			button_placeholder_id : "uploadImage",
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : base+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {},
			debug: false
		});
}
//加载户型图
function loadUnitImages(){
	var utinImgStr="";
	$("#unitPhotoList").html("");
	$.post(base + '/broker/room/loadUnitImage',{id:gardenId},function(res){
		$("#unitPhotoList").html("");
		if(res.unitImages){
			for(var i=0;i<res.unitImages.length;i++){
				var unitImg=res.unitImages[i];
				utinImgStr+="<dl id='"+unitImg.id+"'>";
				utinImgStr+="<dt><img id='"+unitImg.id+"' enlarger='"+base+"/images/"+unitImg.url.replace("size","origin")+"' src='"+base+"/images/"+unitImg.url.replace("size","100X75")+"' onmouseover=\"showImgInfo(this)\" onmouseout=\"hideImgDiv()\" /></dt>";
				utinImgStr+="<dd><a href='javascript:void(0)'  escape='true' enlarger='"+base+"/images/"+unitImg.url.replace("size","origin")+"'><img src='"+base+"/default/style/images/photo02.gif'/>原图</a> " ;
				utinImgStr+="<a href=\"javascript:deletePhoto('"+unitImg.id+"','UNITFIGURE')\"><img src='"+base+"/default/style/images/photo03.gif'/>删除</a></dd>";
				utinImgStr+="</dl>";//onclick=\"viewLargePhoto('"+base+"/images/"+unitImg.url+"')\"
			}
			$("#unitPhotoList").append(utinImgStr);
			EnlargerImg.init();	//放大图片
		}
	},'json');
}
function deletePhoto(id,uploadType){
	art.dialog.confirm('确定删除?',function(){
		$.post(base + '/p2p/investmentProject/deleteProjectImage?',{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
				art.dialog.tips("删除成功!",null,"succeed");
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
	$.post(base + '/broker/room/showImageInfo',{id:id},function(res){
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
	art.dialog.open(base + '/broker/room/view?id='+id,{
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