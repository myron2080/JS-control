
var upload;
var uploadImages = {};
var gardenId="";
$(document).ready(function(){
	initUploadImage("logoPathBtn","logPath");
	//initUploadImage("BTN_PIC4GOODS","PIC4GOODS");
	//initUploadImage("BTN_PIC4ACTIVITY","PIC4ACTIVITY");
	
	//uploadImage("BTN_PIC4GOODS","PIC4GOODS");
	
	//实现多图上传功能
	 initUploadImage("BTN_PIC4GOODS","PIC4GOODS");
	 initUploadImage("BTN_PIC4ACTIVITY","PIC4ACTIVITY");
	
});

function deletePhoto(obj){
	$(obj).parent().remove();
	/*art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/ebbase/goods/deleteImageByPath',{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
				art.dialog.tips("删除成功!",null,"succeed");
			}else if(res.STATE=="ERROR"){
				art.dialog.tips("图已经被设置,不能删除!");
			}else{
				art.dialog.tips("删除失败!");
			}
		},'json');
	});*/
}

/*function deletePhoto(id,uploadType){
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
}*/

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
function initUploadImage(button_id,type){	
	$('#'+button_id).empty();
	var IMAGE_SIZE_HUNDRED = $("#IMAGE_SIZE_HUNDRED").val();
	var upload = new SWFUpload({
			upload_url: getPath() + '/ebbase/goods/compressUpload',
			file_post_name:'image',
			post_params: {direct:'ebbase/goodsPhoto/'+type},
			file_size_limit : IMAGE_SIZE_HUNDRED+"kb",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
//				$("#loading_firstPicName").css("display","inline");
				var f;
				f = $('<dd></dd>').appendTo($("#DL_"+type));
				$('<dt><img src="'+getPath()+'/default/style/images/loading44.gif" /></dt>').appendTo(f);
			uploadImages[file.id] = f;
			},
			file_queue_error_handler : function(file, errorCode, message){
				try {
					if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
						art.dialog.alert('上传的文件太多啦');
						return;
					}
					switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							art.dialog.alert('<br>上传失败:<br><br>&nbsp;所选择的图片中，存在内存大小超出设定范围的图片');
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
				//上传开始
			},
			upload_progress_handler : function(file, bytesComplete, bytesTotal){
				
				//上传进程
				var percent = getFormatPercent((bytesComplete/bytesTotal).toFixed(4)*100)+"%";
				if(bytesComplete == bytesTotal){
				}
			},
			upload_error_handler : function(file, errorCode, message){
				art.dialog.alert("图片上传报错，请重新上传！异常详细信息："+message);
			},
			upload_success_handler : function(file, serverData, responseReceived){
						
				var res = eval('(' + serverData + ')');
				if(type=="logPath"){
				$("#logoPath").val(res.PATH);
				$("#logoPath_img").attr("src",base+'/images/'+(res.PATH?res.PATH.replace("size","150X100"):""));
				}else {
					var im = uploadImages[file.id];
					im.empty();
					im.attr('id',res.id);
					var html ='';
					html+='<input type="hidden" key="'+type+'" value="'+res.PATH+'"/>';
					var showPath = base+'/images/'+res.PATH.replace("size","150X100");
					html+='<img class="bor3" enlarger="'+base+'/images/' + res.PATH.replace("size","origin")+'" src="'+showPath+'" width="120" height="120">';
					html+='<span class="delBtn" onclick="deletePhoto(this);"><img src="'+base+'/default/style/images/eb_back/icon_close.png"></span>';
					$(html).appendTo(im);
				}
				//上传成功
			/*	var res = eval('(' + serverData + ')');
				if(type=="logPath"){
				$("#logoPath").val(res.PATH);
				$("#logoPath_img").attr("src",base+'/images/'+(res.PATH?res.PATH.replace("size","150X100"):""));
				}else {
					
					var html ='';
					html+='<dd>';
					html+='<input type="hidden" key="'+type+'" value="'+res.PATH+'"/>';
					var showPath = base+'/images/'+res.PATH.replace("size","150X100");
					html+='<img class="bor3" enlarger="'+base+'/images/' + res.PATH.replace("size","origin")+'" src="'+showPath+'" width="120" height="120">';
					html+='<span class="delBtn" onclick="deletePhoto(this);"><img src="'+base+'/default/style/images/eb_back/icon_close.png"></span>';
					html+='</dd>';
					$("#DL_"+type).append(html);
				}*/
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

function uploadImage(button_id,type){
	new AjaxUpload($("#"+button_id), {
    	action:getPath() + '/ebbase/goods/compressUpload?direct=ebbase/goodsPhoto/'+type,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|gif图片");
                return false;
            }
        },
        onComplete: function(file, res){   
			if(res.STATE == "SUCCESS"){
				var html ='';
				html+='<dd>';
				html+='<input type="hidden" key="'+type+'" value="'+res.PATH+'"/>';
				var showPath = base+'/images/'+res.PATH.replace("size","150X100");
				html+='<img class="bor3" src="'+showPath+'" width="120" height="120">';
				html+='<span class="delBtn" onclick="deletePhoto(this);"><img src="'+base+'/default/style/images/eb_back/icon_close.png"></span>';
				html+='</dd>';
				$("#DL_"+type).append(html);
			} else {
				art.dialog.alert(res.MSG);
			}
        }
	 });
}