$(document).ready(function(){
	initUpload();
});

var upload;
var uploadArr=[upload];
var uploadImages = {};
function initGardenUpload(str,type){
    var i=str;
    if(str==""){
    	i=0;
    }	
	$('uploadImage'+str).empty();
	var objId=$("#dataId").val();
	if(objId==''){
		objId=$("#tempId").val();
	}
	uploadArr[i] = new SWFUpload({
		upload_url: getPath() + '/ebhouse/images/uploadsave?type='+type+'&objId='+objId,
		file_post_name:'image',
		post_params: {direct:'zxslc/images/base'},
		file_size_limit : "10240",
		file_types : "*.jpg;*.gif;*.png",
		file_types_description : "images/*",
		file_upload_limit : "0",
		file_queue_limit : "0",
		file_queued_handler: function(file){
			var f;
				f = $('<li></li>').appendTo($('#imageInfoList1'+str));
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
				uploadArr[i].startUpload();
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
				im.attr('id',res.ID);
				
				$('<img width="100px" height="75px" src="'+getPath()+'/images/'+res.PATH.replace("size","100X75")+'" /><input type="text"  value="'+res.FILENAME+'" onchange="updateImageName(\"'+res.id+'\",this)"/><a href="javascript:deleteNarratorPhoto(\''+res.ID+'\',this)">删除</a>').appendTo(im);
				//EnlargerImg.init();	//放大图片
			}
		},
		upload_complete_handler : null,
		button_image_url:getPath()+'/default/style/images/add_btn.gif',
		button_placeholder_id : "uploadImage"+str,
		button_width: 83,
		button_height: 29,
		button_cursor:SWFUpload.CURSOR.HAND,
		flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
		custom_settings : {},
		debug: false
	});
}
function updateBase(dig){
	$.post(getPath() + '/ebhouse/onlinesale/updateBase',{id:$("#dataId").val(),prjLight:$("#prjLight").val(),lookCount:$("#lookCount").val(),recordName:$("#recordUrl").val(),recordUrl:$("#recordUrlData").val()},function(res){
		if(res.STATE=="SUCCESS"){
			art.dialog({icon: 'succeed',close:function(){
				dig.close();
			}, time: 1,content: "修改成功!"});
		}else{
			
			art.dialog({icon: 'warning', time: 1,content: "修改失败!"});
		}
	},'json');
}
function deleteNarratorPhoto(idx,obj){
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/ebhouse/onlinesale/delNarrator',{id:idx},function(res){
			if(res.STATE=="SUCCESS"){
				$("#"+idx).closest("li").remove();
				art.dialog({icon: 'succeed', time: 1,content: "删除成功!"});
			}else{
				art.dialog({icon: 'warning', time: 1,content: "删除失败!"});
			}
		},'json');
	});
}

function clearRecorUrl(){
	$("#recordUrl").val("");
}

var uploadFiles = {};

//初始化上传图片插件
function initUpload(){
		$('uploadFile').empty();
		var upload_a = new SWFUpload({
			upload_url: getPath() + '/ebhouse/images/upload',
			file_post_name:'image',
			post_params: {direct:'markAudio'},
			file_size_limit : "20480",
			file_types : "*.3gp;*.wav;*.mp3;*.midi;*.mid;*.mmf",
			file_types_description : "audios/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var f = $('<dl></dl>').appendTo($('#loading'));
					$('<dt><img src="'+getPath()+'/default/style/images/loading.gif" /></dt>').appendTo(f);
				uploadFiles[file.id] = f;
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
					upload_a.startUpload();
				}
			},
			upload_start_handler : null,
			upload_progress_handler : null,
			upload_error_handler : null,
			upload_success_handler : function(file, serverData, responseReceived){
				if(uploadFiles[file.id]){
					var res = eval('(' + serverData + ')');
					$('#loading').hide();
					$("#recordUrl").val(res.FILENAME);
					$("#recordUrlData").val(res.PATH);
				}
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_music.gif',
			button_placeholder_id : "uploadFile",
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {},
			debug: false
		});
}
