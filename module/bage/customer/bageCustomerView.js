var keyVal='公司名称/联系电话';
$(document).ready(function(){
	initUploadImage("uploadImage","logoURL");
	initUploader("addUploadImage");
	
});

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


function initUploadImage(button_id,filePath_id){
	var upload = new SWFUpload({
			upload_url: getPath() + '/framework/images/compressUpload',
			file_post_name:'image',
			post_params: {direct:'bageCompany/images'},
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
				$("#"+filePath_id).val(res.PATH);
				$("#logoURLImg").attr("src",base+'/images/'+(res.PATH?res.PATH.replace("size","150X100"):""));
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




var uploadImages = {};
var photoNum=0;
var fileNames='';
var urls='';
var i=0;
var fileIds='';
function initUploader(butten_id){
		$('#addUploadImage').empty();
		upload = new SWFUpload({
			upload_url: base + '/framework/images/compressUpload',
			file_post_name:'image',
			post_params: {direct:'bageCompany/images'},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			button_disabled:butten_id,
			file_queued_handler: function(file){
				var f = $('<dl key="loadImg"></dl>').appendTo($('#photoList'));
				$('<dt><img src="'+getPath()+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
				uploadImages[file.id] = f;
				fileIds+=file.id;
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
					photoNum=selectNum + i;
					upload.startUpload();
//					i=selectNum;
				}
			},
			upload_start_handler : null,
			upload_progress_handler : null,
			upload_error_handler : null,
			upload_success_handler : function(file, serverData, responseReceived){
				i++;
				var res = eval('(' + serverData + ')');
				fileNames+=','+file.name;
				urls+=','+res.PATH;
				if(i==photoNum){
					afterUpload();
					fileNames= "";
					urls= "";
				}
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_btn.gif',
			button_placeholder_id : butten_id,
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {
			},
			debug: false
		});
	
}

function viewLargePhoto(path){
	window.open(path,'_blank','top=0,left=0,scrollbars=yes,resizable=true,toolbar=no,location=no');//,height='+screen.height+',width='+screen.width);
}


//上传完所有照片后调用方法
function afterUpload(){
	var albumId =$("#id").val();
	$.post(base + "/bagePhotoList/photo/addPhotoToAlbum",{albumId:albumId,fileNames:fileNames,paths:urls},function(list){
		$("dl[key='loadImg']").remove();
		for(var i=0;i<list.length;i++){
			var pho=list[i];
			$('<dl id="'+pho.id+'"><dt><img src="'+imgBase+'/'+pho.path.replace("size","150X100")+'" /></dt>'+
					'<dd><a href="javascript:void(0)" escape="true" onclick="viewLargePhoto(\'' + imgBase + '/' + pho.path.replace("size","origin") + '\')"><img src="'+ base + '/default/style/images/photo02.gif"/>原图</a>' +
							'<a href="javascript:deletePhoto(\''+pho.id+'\')"><img style="width:15px;height:15px" src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a></dd></dl>').appendTo('#photoList');
		}
		i=0;
	},'json');
}

function deletePhoto(id){
	var arrUrls = urls.split(",");
	var arrFileNames = fileNames.split(",");
	var tempUrls = [];
	var tempNames = [];
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/bagePhotoList/photo/delete',{id:id},function(res){
			var photoUrl = res.path;
			$('#'+id).remove();
			art.dialog.tips("删除成功.");
		},'json');
	});
}


function savebageCompany(currentDialog){
	if(!checkValidate()){
		return;
	}else{
		$.post(getPath()+"/bageCompanyEdit/save",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
					
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	}
	if(currentDialog){
		currentDialog.button({name:"取消",disabled:true});
		currentDialog.button({name:"保存",disabled:true});
	}
}


function checkValidate(){
	
	if(!isNotNull($.trim($("#name").val()))){
		art.dialog.tips("公司名称不能为空!");
		$("#name").select();
		return false;
	}
	
	
	if(!isNotNull($.trim($("#legalPerson").val()))){
		art.dialog.tips("公司法人不能为空!");
		$("#legalPerson").select();
		return false;
	}
	
	if(!isNotNull($.trim($("#foundingDate").val()))){
		art.dialog.tips("公司成立时间不能为空!");
		$("#foundingDate").select();
		return false;
	}
	
	
	if(!isNotNull($.trim($("#address").val()))){
		art.dialog.tips("总部地址不能为空!");
		$("#address").select();
		return false;
	}

	if(!isNotNull($.trim($("#foundingDate").val()))){
		art.dialog.tips("公司成立时间不能为空!");
		$("#foundingDate").select();
		return false;
	}
	
	if(!isNotNull($.trim($("#introduction").val()))){
		art.dialog.tips("公司介绍不能为空!");
		$("#introduction").select();
		return false;
	}
	
	if(!isNotNull($.trim($("#logoURL").val()))){
//		art.dialog.tips("请上传公司LOGO!");
//		return false;
	}
	return true;

}