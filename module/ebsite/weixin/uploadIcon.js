
var upload;
var uploadImages = {};
var gardenId="";
$(document).ready(function(){
	initUploadImage("btn_upload");
});

function deletePhoto(className){
	$("."+className).empty();
	$("#iconPath").val("");
//	var imgPath = $("#iconPath").val();
//	if(imgPath==""){
//		return;
//	}
//	//根据路径移除本地图片
//	$.post(getPath() + '/ebbase/goodsCategory/deleteByPath', {
//		path : imgPath
//	}, function(res) {
//		if(res.STATE=='SUCCESS'){
//			$("."+className).empty();
//			$("#iconPath").val("");
//		}else{
//			art.dialog.alert("移除图片失败，请重试");
//		}
//	}, 'json');
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
function initUploadImage(button_id){	
	$('#'+button_id).empty();
	var IMAGE_SIZE_THIRTY = $("#IMAGE_SIZE_THIRTY").val();
	var upload = new SWFUpload({
			upload_url: getPath() + '/ebsite/weixin/participants/upload',
			file_post_name:'image',
			post_params: {direct:'ebsite/weixin/participants/upload'},
			file_size_limit : IMAGE_SIZE_THIRTY+"kb",
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
							art.dialog.alert('所选择的图片中，存在内存大小超出设定范围的图片');
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
				//上传成功
				var res = eval('(' + serverData + ')');
				var html = '<img class="bor3" src="'+base+'/images/'+res.PATH.replace('size','150X100')+'" width="120" height="120" />';
				  	html += '<span class="delBtn" onclick="deletePhoto(\'innerImage\');"><img src="'+base+'/default/style/images/eb_back/icon_close.png"></span>';
			  	deletePhoto("innerImage");
				$('.innerImage').append(html);
				$("#iconPath").val(res.PATH);
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
