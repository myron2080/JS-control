var sizeWidth=380;
var sizeHeight=300;
function saveEdit(){
	if(checkForm()){
		$("form").submit();
	}
	return false;
}


function checkForm(){
	var title =  $("#title").val();
	if(!title){
		art.dialog.tips("标题不能为空");
		return false;
	}
	var sortNum =  $("#sortNum").val();
	if(!sortNum){
		art.dialog.tips("序号不能为空");
		return false;
	}
	var picPath =  $("#picPath").val();
	if(!picPath){
		art.dialog.tips("请上传一张一张图片为空");
		return false;
	}
	
	return true;
	
}
$(document).ready(function(){
	if($("#VIEWSTATE").val()=="VIEW"){
		$("#upload").css("display","none")
	}else{
		initUploadImage("upload","","");
	}
	
});

/**
 * 上传图片功能代码
 * */
function initUploadImage(button_id,fileName_id,filePath_id){
	var curindex;
	var upload = new SWFUpload({
		upload_url: base + '/lunch/banner/uploadImage',
		file_post_name:'image',
		post_params: {direct:'lunch_Banner/images'},
			file_size_limit : "51200",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var swfUpload = this;
//				adddl(file.id);
				$("#"+file.id+" .uploadClose").click(function(e){
					swfUpload.cancelUpload(file.id);
					$("#"+file.id).remove();
				});
				index++;
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
			upload_start_handler : function(file){
				 if (file) { 
					 $("#"+file.id+" b").html("0%"); 
				 }
			},
			upload_progress_handler : function(file, bytesComplete, bytesTotal){
			 	var percent = getFormatPercent((bytesComplete/bytesTotal).toFixed(4)*100)+"%";
				$("#"+file.id+" dd").html(file.name);
				$("#"+file.id+" span").css("width",percent);
				$("#"+file.id+" b").html(percent);
				if(bytesComplete == bytesTotal){					
					$("#"+file.id+" b").html("完成");
				} 
			},
			upload_error_handler : function(file, errorCode, message){
				art.dialog.alert("图片上传报错，请重新上传！异常详细信息："+message);
				$("#"+file.id).remove();
			},
			upload_success_handler : function(file, serverData, responseReceived){
				var res = eval('(' + serverData + ')');
				$("#pathImg").attr("src",base+'/images/'+(res.PATH?res.PATH.replace("size","150X100"):""));
				$("#pathImg").css("display","block");
				$("#picPath").attr("value",res.PATH?res.PATH:"");
				art.dialog.tips(res.MSG);
			},
			upload_complete_handler : function(file){this.startUpload(); },
			button_image_url:getPath()+'/default/style/images/add_uploadn.gif',
			button_placeholder_id : button_id,
			button_width: 85,
			button_height: 27,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {
			},
			debug: false
		});
}
