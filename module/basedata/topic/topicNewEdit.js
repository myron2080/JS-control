var upload;
var uploadImages = {};
$(document).ready(function(){
	$('#modula').bind('change',function(){
		$('#function').html('');
		$.post(getPath()+'/basedata/topicNewList/childMenu',{parent:$(this).val()},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++ ){
					$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo($('#function'));
				}
			}
		},'json');
	});
	initUploader();
	//initCkeditor();
	EnlargerImg.init({type:'enlararr'});
	
	$("#resetBtn").click(function(){
			
	});
	
	
});

function initUploader(){
	var id = $('#dataId').val();
	if(id!=null && id != '' && $edit_viewstate!='VIEW'){
		$('uploadImage').empty();
		upload = new SWFUpload({
			upload_url: getPath() + '/basedata/topicNew/uploadImage',
			file_post_name:'image',
			post_params: {direct:'topic/images',belong:id},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var f = $('<dl></dl>').appendTo($('#photoList'));
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
					$('<dt><img enlarger="'+getPath()+'/images/'+res.path+'" src="'+getPath()+'/images/'+res.path+'" /></dt>').appendTo(im);
					$('<dd><a href="javascript:deletePhoto(\''+res.id+'\')"><img src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a></dd>').appendTo(im);
					
					EnlargerImg.init({type:'enlararr'});
				}
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_btn.gif',
			button_placeholder_id : "uploadImage",
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {
			},
			debug: false
		});
	}
}
var config={
		 toolbar: [['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
	               ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'], 
	               ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], 
	               ['Link', 'Unlink'], 
	               ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar'],
	               '/', ['Styles', 'Format', 'Font', 'FontSize'],
	               ['TextColor', 'BGColor'], 
	               ['Maximize', 'ShowBlocks', '-', '-', 'Undo', 'Redo']],
	     width: "600", //文本域宽度
	     height: "200"//文本域高度     
	}

initCkeditor= function(){
	CKEDITOR.replace('step', config);
	CKEDITOR.instances.step.setData($("#step").val());
}
function viewPhoto(id){
	art.dialog.open(getPath() + '/basedata/photo/view?id='+id,{
		title:'图片查看',
		lock:true,
		height:'auto',
		width:'auto',
		id:'viewPhoto',
		button:[{name:'关闭'}]
	});
}

function viewLargePhoto(path){
	window.open(path,'_blank','top=0,left=0,scrollbars=yes,resizable=true,toolbar=no,location=no');
}

function deletePhoto(id){
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/basedata/photo/delete',{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
			}else{
				art.dialog.tips(res.MSG);
			}
		},'json');
	});
}

function submitForm(){
//	var content = $.trim(CKEDITOR.instances.step.getData());
//	$("#step").val(content);

	
	var moduleValue =  $("#modula").val();
	var functionValue = $("#function").val();
	if(moduleValue==""){
		art.dialog.tips("请选择模块");
		return ;
	}
	if(functionValue==""){
		art.dialog.tips("请选择功能");
		return ;
	}
	var errorRadio = $("#errorDiv").find("input[type='radio']:checked").length;
	if(errorRadio==0){
		art.dialog.tips("请选择错误类型");
		return ;
	}
	
	var desc =$("#description").val();
	
	if(desc==""){
		art.dialog.tips("请录入问题描述");
		return ;
	}
	
	$.post($('form').attr('action'),$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			art.dialog.tips(res.MSG,null,"succeed");
//			$('#dataId').val(res.id);
			setTimeout(function(){art.dialog.close();},1000);
//			initUploader();
		}else{
			if(currentDialog){
				currentDialog.button({name:"提交问题",disabled:false});
			}
			art.dialog.alert(res.MSG);
		}
    },'json');
	
	
	if(currentDialog){
		currentDialog.button({name:"提交问题",disabled:true});
	}
	
}

function removeswf(){
	$("#swfdiv").remove();
}

