/**
 ***************************
 ** 上传图片
 ***************************
 */

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
function initUploadImage(button_id,gardeType,countType,append_id){	
	var gardeId = $("input[key='dataId_" + gardeType + "']").val();
	var upload = new SWFUpload({
		upload_url: getPath() + '/ebhouse/images/compressUpload?type=' + append_id + "&objId=" + gardeId,
		file_post_name:'image',
		post_params: {direct:'garde',type:append_id,objId: $("#onlineSaleId").val()},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var f = $('<dl></dl>').appendTo($('#sightList'));
				$('<dt><img src="'+getPath()+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
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
//				$("#loading_firstPicName").css("display","none");
				var res = eval('(' + serverData + ')');
				if(countType == 'single'){
//					$("#"+fileName_id).val(file.name);
//					$("#"+filePath_id).val(res.PATH);
//					if("firstPicName"==fileName_id){ 
//						$("#firstPicImg").attr("src",base+'/images/'+(res.PATH?res.PATH.replace("size","75X75"):""));
//					}
//					art.dialog.tips(res.MSG);
				}else{
					
					var res = eval('(' + serverData + ')');
					var idx = $("#" + append_id).find("input[name^='imgDesc_']").length;
					idx++;
					$('<div class="mark-pic" key="mark_pic"><div class="mark-pictop"><a key="mark-pic-del" class="mark-pic-del" href="javascript:void(0)"></a><img enlarger="'+getPath()+'/images/' + res.PATH.replace("size","origin")+'" key="' + 
					res.PATH + '" src="'+getPath()+'/images/'+res.PATH.replace("size","70X70")+'"/></div><div class="mark-picbottom"><input name="imgDesc_' + 
					gardeType +'_' + idx +'" value=""  style="width: 70px;" type="text" /></div>').prependTo($("#" + append_id));
					$("a[key='mark-pic-del']").bind("click", function(){
						$(this).parent().parent().remove();
					});
					EnlargerImg.init();	//放大图片
				}
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/image-add.png',
			button_placeholder_id : button_id,
			button_width: 70,
			button_height: 70,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {
			},
			debug: false
		});
}