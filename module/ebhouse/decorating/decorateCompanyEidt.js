$(document).ready(function(){
	initUploadImage("uploadImage","firstPicName","logoUrl");
});

function save(dlg){
	if(!isNotNull($("#name").val())){		
		art.dialog.tips("公司名称!",1.5);
		$("#name").focus();
		return;
	}
	
	if(!isNotNull($("#contectName").val())){		
		art.dialog.tips("请输入联系人！",1.5);
		$("#contectName").focus();
		return;
	}
	
	if(!isNotNull($("#phone").val())){		
		art.dialog.tips("请输入联系电话！",1.5);
		$("#phone").focus();
		return;
	}
	
	if(!isNotNull($("#address").val())){		
		art.dialog.tips("请输入公司地址！",1.5);
		$("#address").focus();
		return;
	}
	
	if(!isNotNull($("#logoUrl").val())){		
		art.dialog.tips("请选择LOGO图片！",1.5);
		return;
	}
	
	if(!contentEditor.getContentTxt()){
		$("#contentStr").show();
		art.dialog.tips("公司简介不能为空");
		return;
	}else{
		$("#contentStr").hide();
	}
	
	if(dlg){
	    dlg.button({name:"关闭",disabled:true});
	    dlg.button({name:"保存",disabled:true});
	}
	$.post($('form').attr('action'),$('form').serialize(),function(res){
		if(dlg){
			dlg.button({name:"关闭",disabled:false});
			dlg.button({name:"保存",disabled:false});
		}
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				art.dialog({
					icon: 'succeed',
				    time: 1,
				    content: res.MSG,
					close:function(){
						art.dialog.close();
					}
				});
			}else{
				art.dialog.close();
			}
		}else{
			art.dialog.alert(res.MSG);
		}
    },'json');
}
	

/**
 * 得到两位数的百分比
 * @param value
 * @returns
 */
function getFormatPercent(value){
	value += "";
	var re = /([0-9]+\.[0-9]{2})[0-9]*/;
	return value.replace(re,"$1");
}

function initUploadImage(button_id,fileName_id,filePath_id){	
	var upload = new SWFUpload({
			upload_url: getPath() + '/ebhouse/images/compressUpload',
			file_post_name:'image',
			post_params: {direct:'decorateCompany/images'},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
//					$("#loading_firstPicName").css("display","inline");
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
				if("firstPicName"==fileName_id){ 
					$("#firstPicImg").attr("src",base+'/images/'+(res.PATH?res.PATH.replace("size","75X75"):""));
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
