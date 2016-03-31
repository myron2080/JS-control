$(document).ready(function(){
	var upload = new SWFUpload({
		upload_url: getPath() + '/framework/images/upload',
		file_post_name:'image',
		post_params: {direct:'photos'},
		file_size_limit : "10240",
		file_types : "*.jpg;*.gif;*.png",
		file_types_description : "images/*",
		file_upload_limit : "10",
		file_queue_limit : "0",
		file_queued_handler: function(file){
			alert(file);
			$('<dl><dt><img src=${base}/default/style/images/photo01.gif" /></dt>'
				+'<dd><a href="javascript:void(0)"><img src="'+getPath()+'/default/style/images/photo02.gif" />原图</a>' 
				+'<a href="javascript:void(0)"><img src="'+getPath()+'/default/style/images/photo03.gif" />删除</a></dd></dl>').appendTo($('#photoList'));
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
			
		},
		upload_complete_handler : null,
		button_image_url:getPath()+'/default/style/images/photo04.gif',
		button_placeholder_id : "uploadContainer",
		button_width: 83,
		button_height: 29,
		button_cursor:SWFUpload.CURSOR.HAND,
		flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
		custom_settings : {
		},
		debug: false
	});
});