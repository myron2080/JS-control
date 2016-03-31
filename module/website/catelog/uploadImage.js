
var upload;
var uploadImages = [];
var uploadFiles = [];
$(document).ready(function(){
	 initUploadImage("uploadImg");
});


function imgObj(path , objId){
	return {
		"path":path,
		"id":objId
		}
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
function initUploadImage(button_id){
	 upload = new SWFUpload({
			upload_url: getPath() + '/website/dataAttachment/compressUpload',
			file_post_name:'image',
			post_params: {direct:'website/catelog/images'},
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
				if(res.STATE == "SUCCESS"){
				uploadImages[(uploadImages.length)++] = imgObj(res.PATH,"");
				fillHtml();
				}else{
					art.dialog.alert(res.MSG);
				}
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

function fillArr(id){
	//获取附件
	$.post(getPath() + '/website/dataAttachment/findAttachments', {
		objId : id
	}, function(res) {
		if (res.STATE == 'SUCCESS' && res.data.length>0) {
			for(var i = 0 ;i<res.data.length ; i++){
				uploadImages[i] = imgObj(res.data[i].path,res.data[i].id);
			}
			fillHtml();
		}
	}, 'json');
}
//填充图片显示区域
function fillHtml(){
	$(".log_div_imgs").empty();
	var resHtml = "";
	var showPath = "";
	for(i = 0 ; i<uploadImages.length ; i++){
		if(uploadImages[i]!=null && uploadImages[i].path!=''){
			showPath =  base+'/images/'+ (uploadImages[i].path.replace("size","150X100"));
			resHtml+= '<div>'
				+'<img src="'+showPath+'"/>'
				+'<a href="javascript:iamgeDelete(\''+uploadImages[i].path+'\');" style="color: red">删</a> | '
				+'<a href="javascript:imageMove(\''+uploadImages[i].path+'\',1);">前</a> | <a href="javascript:imageMove(\''+uploadImages[i].path+'\',-1);">后</a>'
				+'</div>';
		}
	}
	$(".log_div_imgs").append(resHtml);
}

//移动顺序
//imgPath ：图片路径
//type 移动类型  -1 向后移动 ，1:向前移
function imageMove(imgPath , type){
	for(i = 0 ; i<uploadImages.length ; i++){
		if(uploadImages[i]!=null && uploadImages[i].path==imgPath){
			if(type==1 && i>0){
				var temp = uploadImages[i-1];
				uploadImages[i-1] = uploadImages[i];
				uploadImages[i] =temp;
				fillHtml();
			}else if(type==-1 && i< uploadImages.length-1){
				var temp = uploadImages[i+1];
				uploadImages[i+1] = uploadImages[i];
				uploadImages[i] =temp;
				fillHtml();
			}
		}
	}
}
//移除图片  0 1 2 3   ===4
function iamgeDelete(imgPath,id){
	$.ajax({ url: base+"/website/dataAttachment/deleteImageByPath",type:"post", data:{imgPath:imgPath},dataType:"json", success: function(data){
		for(i = 0 ; i<uploadImages.length ; i++){
			if(uploadImages[i]!=null &&uploadImages[i].path==imgPath){
				if(uploadImages[i].id!='' ||uploadImages[i].id!=null ){
					$.post(getPath() + '/website/dataAttachment/delete', {
						id : uploadImages[i].id
					}, function(res) {
						
					}, 'json');
				}
				uploadImages[i] = null;
			}
		}
		fillHtml();
	},error:function(){
		art.dialog.alert("移除失败！");
	}});
	
}

/**
 * 上传附件
 */
addFileFn=function(id){
	var url = "/website/dataAttachment/uploadFile";
	var a = new AjaxUpload($("#"+id),{
    	action: getPath()+url,
    	data: {direct:'website/attach/files'},
        autoSubmit: true,
        name: "file",
        responseType: "json",
        onSubmit: function(file, extension){
        	
        },
        onComplete: function(file, data){  
        	if(data.STATE=='FAIL'){
        		art.dialog.alert(data.MSG);
        		return;
        	}else{
        		uploadFiles[(uploadFiles.length)++]=imgObj(data.PATH,$("#id").val());
        		art.dialog.confirm("上传成功！",function (){return true;});
	        }
        }
    });
}
