
var upload;
var uploadImages = {};
var gardenId="";
$(document).ready(function(){
	initGardenUpload();
	initUploadImage("uploadImage1","firstPicName","firstPicImg");

});

/**
 * 上传相关附件的方法
 */
function initGardenUpload(){
		$('uploadImage').empty();
		upload = new SWFUpload({
			upload_url: getPath() + '/lunch/dishes/upload?direct=lunch/lunch_images&belong='+projectId+"&uploadType=PLOTFIGURE",
			file_post_name:'image',
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var f;
					f = $('<li></li>').appendTo($('#imageInfoList'));
					$('<dt><img src="'+getPath()+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
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
					$('<img width="100px" height="75px" id='+res.id+' enlarger="'+getPath()+'/images/' + res.path.replace("size","origin")+'" src="'+getPath()+'/images/'+res.path.replace("size","100X70")+'" /><a href="javascript:deletePhoto(\''+res.id+'\',\''+res.uploadType+'\')"><img src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a>').appendTo(im);
					EnlargerImg.init();	//放大图片
				}
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

function deletePhoto(id,uploadType){
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/lunch/dishes/deleteProjectImage',{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
				art.dialog.tips("删除成功!",null,"succeed");
			}else if(res.STATE=="ERROR"){
				art.dialog.tips("图已经被设置,不能删除!");
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
	$.post(getPath() + '/broker/room/showImageInfo',{id:id},function(res){
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
	art.dialog.open(getPath() + '/broker/room/view?id='+id,{
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

function getFormatPercent(value){
	value += "";
	var re = /([0-9]+\.[0-9]{2})[0-9]*/;
	return value.replace(re,"$1");
}

/**
 * 上传项目图片的方法
 * @param button_id
 * @param fileName_id
 * @param filePath_id
 */
function initUploadImage(button_id,fileName_id,filePath_id){	
	var upload = new SWFUpload({
			upload_url: getPath() + '/framework/images/compressUpload',
			file_post_name:'image',
			post_params: {direct:'lunch/lunch_images'},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
//				$("#loading_firstPicName").css("display","inline");
			},
			file_queue_error_handler : function(file, errorCode, message){
				try {
					if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
						art.dialog.alert('上传的文件太多啦');
						return;
					}
					switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							art.dialog.alert('上传的文件太大:'+file.name);
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
							art.dialog.alert('上传的文件为空:'+file.name);
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
							art.dialog.alert('上传的文件类型不符:'+file.name);
							break;
						case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
							art.dialog.alert('上传的文件太多啦:'+file.name);
							break;
						default:
							art.dialog.alert('未知错误');
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
			upload_start_handler : function(){
				$("#firstPicProgress").show();
			},
			upload_progress_handler : function(file, bytesComplete, bytesTotal){
				var percent = getFormatPercent((bytesComplete/bytesTotal).toFixed(4)*100)+"%";
				$("#firstPicProgress span").css("width",percent).html(percent);
				if(bytesComplete == bytesTotal){
					$("#firstPicProgress").hide();
				}
			},
			upload_error_handler : function(file, errorCode, message){
				art.dialog.alert("图片上传报错，请重新上传！异常详细信息："+message);
				$("#firstPicProgress").hide();
			},
			upload_success_handler : function(file, serverData, responseReceived){
				$("#loading_firstPicName").css("display","none");
				var res = eval('(' + serverData + ')');
				$("#"+fileName_id).val(file.name);
				$("#"+filePath_id).val(res.PATH);
				$("#effectChartUrl").val(res.PATH);
				if("firstPicName"==fileName_id){ 
					$("#firstPic").attr("src",base+'/images/'+(res.PATH?res.PATH.replace("size","150X100"):""));
				}
				art.dialog.tips(res.MSG);
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/liulan_btn.png',
			button_placeholder_id : button_id,
			button_width: 48,
			button_height: 22,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {
			},
			debug: false
		});
}