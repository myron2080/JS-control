var moreOperate;
$(document).ready(function(){
	
	$("div[key='content']").find("div[key='dataDetail']").each(function(idx, ele){
		var templateObj = $(this);
		
		templateObj.find("input[name^='modelType']").click(function(){
			if(this.value == 'VIDEO'){
				templateObj.find("div[key^='vodeoData']").show();
				templateObj.find("div[key^='up_div']").hide();
				templateObj.find("div[id^='sightList']").html("").hide();
			}else{
				templateObj.find("div[key^='vodeoData']").hide();
				templateObj.find("input[name^='videoPic']").val("");
				var file = templateObj.find("input[name^='videoUrl']");
				file.after(file.clone().val(''));
				file.remove();
				templateObj.find("div[key^='up_div']").show();
				templateObj.find("div[id^='sightList']").show();
			}
		});
		templateObj.find("input[name^='modelType']").parent().click(function(){
			var chk_obj = $(this).find("input[name^='modelType']");
			chk_obj.attr("checked", true);
			if(chk_obj.get(0).value == 'VIDEO'){
				templateObj.find("div[key^='vodeoData']").show();
				templateObj.find("div[key^='up_div']").hide();
				templateObj.find("div[id^='sightList']").html("").hide();
			}else{
				templateObj.find("div[key^='vodeoData']").hide();
				templateObj.find("input[name^='videoPic']").val("");
				templateObj.find("input[name^='videoUrl']").val("");
//				var file = templateObj.find("input[name^='videoUrl']");
//				file.after(file.clone().val(''));
//				file.remove();
				templateObj.find("div[key^='up_div']").show();
				templateObj.find("div[id^='sightList']").show();
			}
		});
		initSightUpload("uploadSightmage" + (idx + 1),"sightList" + (idx + 1));
		vodoeAjaxupload("videoPicImg" + (idx + 1),'ebhouse/images/compressUpload?direct=vodeo',(idx + 1));
		
	});
	
	$("a[key='delOperate']").bind("click", function(){
		 var dataDetial = $(this).parent().parent();
		 $(this).parent().remove();
		 dataDetial.find("div[key='up_div']").hide();
		 dataDetial.find("div[id^='sightList']").remove();
		 dataDetial.attr("key", "remove_dataDetail").hide();
		 $.post(getPath()+"/ebhouse/onlinesale/delOnlineSaleModel",{id:$(this).attr("id")},function(data){
			 if(data.STATE=="SUCCESS"){
				 art.dialog.tips(MSG,null,"succeed");
			 }else{
				 art.dialog.alert("删除失败!");
			 }
		 },"json");
	 });
	
	var initIndex = $("#content").find("div[key='dataDetail']").length;
	moreOperate = new MoreOperate({
		id : "Operate",
		count : 100,
		initCount : 1,
		index : initIndex 
	});
//	initSightUpload();
	initNarratorUpload();
	$("input[name='narratorName']").bind("blur",function(){
		var id = $(this).attr("key");
		var val = this.value;
		$.post(getPath()+"/ebhouse/onlinesale/saveNarrator",{id:id,description:val},function(data){
			if(data.STATE=="SUCCESS"){
//				art.dialog.tips("讲解员名称保存成功!",null,"succeed");
			}else{
//				art.dialog.alert("讲解员名称保存失败!");
			}
		},'json');
	});
	
	$("span[key='sp_postion']").click(function(){
		var ipt = $(this).find("input[name='position']");
		if(!ipt.attr("checked")){
			ipt.attr("checked",true);
		}
	});
	
	EnlargerImg.init();	//放大图片

});

function MoreOperate(config){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='template']");
	var content = operateObj.find("div[key='content']");
	var idx = content.find("div[key='dataDetail']").length;
	// 添加内容
	_addContent = function() {
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		// 绑定删除事件
		templateObj.find("a[key='delOperate']").click(function() {
			_removeContent($(this));
		});
		config.index ++;
		idx++;
		
		
		templateObj.find("input[id='modelId']").attr("id", "modelId" + idx);
		$.post(getPath()+"/ebhouse/onlinesale/getUUID?random=" +  Math.round(Math.random()*100),function(res){
			templateObj.find("input[id='modelId" + idx + "']").val(res.UUID);
		},'json');
		
//		templateObj.find("p[id='modelType_idx']").html("模块" + idx);
		
		templateObj.find("input[id='idx']").val(idx);
		templateObj.find("input[id='idx']").attr("name" ,"idx" + idx);
		templateObj.find("input[id='idx']").attr("id" ,"idx" + idx);
		
		templateObj.find("p[id='modelType_idx']").attr("id" ,"modelType_idx" + idx);
		templateObj.find("input[id='modelType_VIDEO']").attr("name" ,"modelType" + idx);
		templateObj.find("input[id='modelType_VIDEO']").attr("id" ,"modelType_VIDEO" + idx);
		
		templateObj.find("input[id='modelType_PIC']").attr("name" ,"modelType" + idx);
		templateObj.find("input[id='modelType_PIC']").attr("id" ,"modelType_PIC" + idx);
		
		templateObj.find("input[id='modelName']").attr("name" ,"modelName" + idx);
		templateObj.find("input[id='modelName']").attr("id" ,"modelName" + idx);
		
		templateObj.find("input[id='englishName']").attr("name" ,"englishName" + idx);
		templateObj.find("input[id='englishName']").attr("id" ,"englishName" + idx);
		
		templateObj.find("select[id='colorType']").attr("name" ,"colorType" + idx);
		templateObj.find("select[id='colorType']").attr("id" ,"colorType" + idx);
		
		templateObj.find("img[id='icoUrl']").attr("id" ,"icoUrl" + idx);
		templateObj.find("span[id='uploadSightIcon']").attr("id" ,"uploadSightIcon" + idx);
		
		
		templateObj.find("input[id='title']").attr("name" ,"title" + idx);
		templateObj.find("input[id='title']").attr("id" ,"title" + idx);
		
		templateObj.find("input[id='videoUrl']").attr("videoUrl" ,"title" + idx);
		templateObj.find("input[id='videoUrl']").attr("id" ,"videoUrl" + idx);
		
		templateObj.find("div[key='vodeoData']").attr("key" ,"vodeoData" + idx);
		
		templateObj.find("input[id='videoPic']").attr("name" ,"videoPic" + idx);
		templateObj.find("input[id='videoPic']").attr("id" ,"videoPic" + idx);
		
		templateObj.find("input[id='videoPicName']").attr("name" ,"videoPicName" + idx);
		templateObj.find("input[id='videoPicName']").attr("id" ,"videoPicName" + idx);
		
		templateObj.find("input[id='vodeoContent']").attr("name" ,"contentDesc" + idx);
		templateObj.find("input[id='vodeoContent']").attr("id" ,"vodeoContent" + idx);
		if(idx == 1){
			contentEditor1 = contentEditor;
		}else if(idx == 2){
			contentEditor2 = contentEditor;
		}else if(idx == 3){
			contentEditor3 = contentEditor;
		}else if(idx == 4){
			contentEditor4 = contentEditor;
		}else if(idx == 5){
			contentEditor5 = contentEditor;
		}else if(idx == 6){
			contentEditor6 = contentEditor;
		}else if(idx == 7){
			contentEditor7 = contentEditor;
		}else if(idx == 8){
			contentEditor8 = contentEditor;
		}else if(idx == 9){
			contentEditor9 = contentEditor;
		}else if(idx == 10){
			contentEditor10 = contentEditor;
		}
		
		templateObj.find("span[id='videoPicImg']").attr("id" ,"videoPicImg" + idx);
		
		
		templateObj.find("div[id='sightList']").attr("id" ,"sightList" + idx);
		templateObj.find("p[id='uploadSightmage']").attr("id" ,"uploadSightmage" + idx);
		
		content.append(templateObj);
		
		
		templateObj.find("input[name='modelType" + idx + "']").click(function(){
			if(this.value == 'VIDEO'){
				templateObj.find("div[key^='vodeoData']").show();
				templateObj.find("div[key^='up_div']").hide();
				templateObj.find("div[id^='sightList']").html("").hide();
			}else{
				templateObj.find("div[key^='vodeoData']").hide();
				templateObj.find("input[name^='videoPic']").val("");
				var file = templateObj.find("input[name^='videoUrl']");
				file.after(file.clone().val(''));
				file.remove();
				templateObj.find("div[key^='up_div']").show();
				templateObj.find("div[id^='sightList']").show();
			}
		});
		templateObj.find("input[name='modelType" + idx + "']").parent().click(function(){
			var chk_obj = $(this).find("input[name^='modelType']");
			chk_obj.attr("checked", true);
			if(chk_obj.get(0).value == 'VIDEO'){
				templateObj.find("div[key^='vodeoData']").show();
				templateObj.find("div[key^='up_div']").hide();
				templateObj.find("div[id^='sightList']").html("").hide();
			}else{
				templateObj.find("div[key^='vodeoData']").hide();
				templateObj.find("input[name^='videoPic']").val("");
				templateObj.find("input[name^='videoUrl']").val("");
//				var file = templateObj.find("input[name^='videoUrl']");
//				file.after(file.clone().val(''));
//				file.remove();
				templateObj.find("div[key^='up_div']").show();
				templateObj.find("div[id^='sightList']").show();
			}
		});
		
		
		
		initSightUpload("uploadSightmage" + idx,"sightList" + idx);
//		initIconUpload("videoPicImg" + idx,"icoUrl" + idx);
		vodoeAjaxupload("videoPicImg" + idx,'ebhouse/images/compressUpload?direct=vodeo',idx);
		
		
	}
	// 删除内容
	_removeContent = function(obj) {
		var size = content.find("div[key='dataDetail']").length;
		 var dataDetial = obj.parent().parent();
		 obj.parent().remove();
		 dataDetial.find("div[key='up_div']").hide();
		 dataDetial.find("div[id^='sightList']").remove();
		 dataDetial.attr("key", "remove_dataDetail").hide();
	}
	$("a[key='addOperate']").bind("click", function() {
		var size = content.find("div[key='dataDetail']").length;
		if (config.count > size) {
			_addContent();
		} else {
			art.dialog.tips("最多只能添加 " + config.count + " 个!");
		}
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='dataDetail']").length;
		for ( var i = size; i < config.initCount; i++) {
			_addContent();
		}
	}
}
function save(){
	var id = $("#onlineSaleId").val();
	/*var qq = $("#qq").val();
	if(qq.length>11){
		art.dialog.tips("QQ号最长为11位");
		return;
	}*/
	var position = "left";
	$("input[name='position']").each(function(){
		if(this.checked){
			position =  this.value;
		}
	});
	var idx = $("input[name='narratorPic'][checked]").attr("idx");
	$("input[name='narratorPic']").each(function(){
		if(this.checked){
			idx =  $(this).attr("idx");
		}
	});
	var narratorName = $("#narratorName" + idx).val();
	var imgUrl = $("img[narratorKey='keySet" + idx + "']").attr("url");
	var backCount = $("#sightList dl").length;
	var modelTypeJson = getModelTypeJson();
	//jsonsSightImgStr
	/*$('uploadSightmage').empty();
	$('uploadNarratorImage').empty();
	SWFUpload.prototype.cleanUp();*/
	$.post(getPath()+"/ebhouse/onlinesale/saveSetOnlineSale?random=" +  Math.round(Math.random()*100),
			{id:id,narratorName:narratorName,imgUrl:imgUrl,backCount:backCount,modelTypeJson:modelTypeJson,jsonsSightImgStr:jsonsSightImgStr},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				art.dialog({
					content: res.MSG,
					time:1,
					close:function(){
//						art.dialog.close();
					},
					width:200
				});
				window.location.reload(true);
				
			}
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
			
}


function getDataJson(){
	 var jsonsStr="[";
	 $("#narratorList").find("dl").each(function(i,ele){
		 jsonsStr+="{";
			var jsonStr="";
			var imgId = $(ele).find("img[narratorKey]").attr("id");
			var narratorName = $(ele).find("input[name^='narratorName']").val();
			jsonStr+="\"id\":\""+imgId+"\",";
			jsonStr+="\"narratorName\":\"" + narratorName+"\",";
			if(jsonStr.indexOf(",")!=-1){
				jsonStr=jsonStr.substring(0,jsonStr.length-1);
			}
			jsonsStr+=jsonStr;
			jsonsStr+="},";
	 });
	 if(jsonsStr.indexOf(",")!=-1){
		jsonsStr=jsonsStr.substring(0,jsonsStr.length-1);
		}
	 jsonsStr+="]";
	 jsonsStr.replace("undefined","");
	return jsonsStr;
}


//初始化上传图片插件
function initSightUpload(id, appendId){
	var uploadImages = {};
		$('#' + id).empty();
		var upload_a = new SWFUpload({
			upload_url: getPath() + '/ebhouse/images/compressUpload',
			file_post_name:'image',
			post_params: {direct:'sight',belong:"",type:"SIGHT"},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var f = $('<dl></dl>').appendTo($('#' + appendId));
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
					upload_a.startUpload();
				}
			},
			upload_start_handler : null,
			upload_progress_handler : null,
			upload_error_handler : null,
			upload_success_handler : function(file, serverData, responseReceived){
				var rdnum = Math.floor(Math.random() * 999999999);
				var res = eval('(' + serverData + ')');
				var im = uploadImages[file.id];
				var idx = $("#" + appendId).find("img[key='sightKey']").length;
				idx++;
				im.empty();
				im.attr('id',"imgSight" + rdnum);
				$('<dt><img keySet="keySet' + idx + '" key="sightKey" enlarger="'+getPath()+'/images/' + res.PATH.replace("size","origin")+'" src="'+getPath()+'/images/'+res.PATH.replace("size","150X100")+'"/></dt>').appendTo(im);
				$('<dd><input style="border:1px solid #ccc; height:16px; text-align:center; color:#ff0000; font-family:Arial; width:15px; margin-right:2px;" type="text" name="idx" value="' + idx+ '" onblur="changeSightIdx(\''+res.ID+ '\',this)" onkeyup="onlyPutNum(this)"/> <a href="javascript:deletePhotoData(\'' + rdnum + '\')">删除</a></dd>').appendTo(im);
				EnlargerImg.init();	//放大图片
				var onlineSaleId=$("#onlineSaleId").val();
				var houseProjectId = $("#houseProjectId").val();
				var index = $("#" + id).find("img[key='sightKey']").length;
				$("img[keySet='keySet" + index + "']").attr("id",res.ID);
				$.post(getPath()+"/ebhouse/onlinesale/saveSight",{id:res.ID,onlineSaleId:onlineSaleId,houseProjectId:houseProjectId,imageUrl:res.PATH,index:index},function(data){
					if(data.STATE=="SUCCESS"){
						art.dialog.tips("上传成功!",null,"succeed");
					}else{
						art.dialog.alert("上传失败!");
					}
				},'json');
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_btn.gif',
			button_placeholder_id : id,
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {},
			debug: false
		});
}


//初始化上传图片插件
function initIconUpload(id, appendId){
		$('#' + id).empty();
		var upload = new SWFUpload({
			upload_url: getPath() + '/ebhouse/images/compressUpload',
			file_post_name:'image',
			post_params: {direct:'sight',belong:"",type:"SIGHT"},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : 1,
			file_queue_limit : "0",
			file_queued_handler: function(file){
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
				var res = eval('(' + serverData + ')');
				$("#" + appendId).attr("alt", res.PATH);
				$("#" + appendId).attr("imgId", res.ID);
				$("#" + appendId).attr("src", base + "/" + res.ID);
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_btn.gif',
			button_placeholder_id : id,
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {},
			debug: false
		});
}


function markPic(ele){
	var sightId = $(ele).parent().parent().find("img[keySet^='keySet']").attr("id");
	var dlg =art.dialog.open(base +"/ebhouse/onlinesale/toMarkSight?sightId="+sightId,
		{
			id : "markSight",
			title : "场景锚点",
			background : '#333',
			width : 730,
			height : 450,
			lock : true,
			button : [/* {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveMark){
						dlg.iframe.contentWindow.saveMark(dlg);
					}
					return false;
				}
			} ,*/ {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){					
			 }
		});			
}




function deletePhoto(ele,id){
	art.dialog.confirm('确定删除?',function(){
		$(ele).parent().parent().remove();
		$.post(getPath()+"/ebhouse/onlinesale/delSight",{id:id},function(data){
			if(data.STATE=="SUCCESS"){
				art.dialog.tips(MSG,null,"succeed");
			}else{
				art.dialog.alert("删除失败!");
			}
		},"json");
		
	});
}

function deletePhotoData(rmd){
	art.dialog.confirm('确定删除?',function(){
		$("#imgSight" + rmd).remove();
		
	});
}

var upload_b;
//初始化上传图片插件
function initNarratorUpload(){
	var uploadImages = {};
		$('uploadNarratorImage').empty();
		upload_b = new SWFUpload({
			upload_url: getPath() + '/ebhouse/images/uploadsave?objId=narratorId',
			file_post_name:'image',
			post_params: {direct:'narrator',belong:"",type:"NARRATOR",objId: "narratorId"},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "4",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var idx = $("#narratorList").find("dl[id^='img_']").length;
				if(idx <4){
					var f = $('<dl></dl>').appendTo($('#narratorList'));
					$('<dt key="loading"><img src="'+getPath()+'/default/style/images/loading_img01.gif" /></dt>').appendTo(f);
					uploadImages[file.id] = f;
				}
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
					var idx = $("#narratorList").find("dl[id^='img_']").length;
					if(idx <4){
						upload_b.startUpload();
					}else{
						art.dialog.alert("只能上传四个讲解员!");
					}
				}
			},
			upload_start_handler : null,
			upload_progress_handler : null,
			upload_error_handler : null,
			upload_success_handler : function(file, serverData, responseReceived){
				var idx = $("#narratorList").find("dl[id^='img_']").length;
				if(idx <4){
					if(uploadImages[file.id]){
						var res = eval('(' + serverData + ')');
						var im = uploadImages[file.id];
						im.empty();
						idx++;
						im.attr('id',"img_" + idx);
						$('<dt><img id="' + res.ID + '" narratorKey="keySet' + idx + '" key="narratorKey" enlarger="'+getPath()+'/images/' + res.PATH.replace("size","origin")+'" src="'+getPath()+'/images/'+res.PATH.replace("size","150X100")+'"/></dt>').appendTo(im);
						$('<dd><p><input type="text" style="width:116px; height:20px; line-height:20px;margin-bottom:3px; border:1px solid #ccc;" id="narratorName' + idx + '" name="narratorName" value="讲解员' + idx + '"/></p><p><input type="radio" name="narratorPic"> <a href="javascript:deleteNarratorPhoto(\'' + idx + '\')">删除</a></p></dd>').appendTo(im);
//						$("img[narratorKey='keySet" + idx + "']" + idx).attr("id", res.ID);
						$("input[name='narratorName" + idx + "']" + idx).attr("key", res.ID);
					}
					var onlineSaleId=$("#onlineSaleId").val();
					var houseProjectId = $("#houseProjectId").val();
					var idx = $("#narratorList").find("dl[id^='img_']").length;
					var description = $("#narratorName" + idx).val();
					$.post(getPath()+"/ebhouse/onlinesale/saveNarrator",{id:res.ID,photoName:file.name,description:description,imageUrl:res.PATH},function(data){
						if(data.STATE=="SUCCESS"){
//							$("img[narratorKey='keySet" + idx + "']" + idx).attr("id", data.id);
//							$("img[input='narratorName" + idx + "']" + idx).attr("key", data.id);
							art.dialog.tips("上传成功!",null,"succeed");
						}else{
							art.dialog.alert("上传失败!");
						}
					},'json');
				}else{
					art.dialog.alert("只能上传四个讲解员!");
				}
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_btn.gif',
			button_placeholder_id : "uploadNarratorImage",
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {},
			debug: false
		});
}
function deleteNarratorPhoto(idx){
	art.dialog.confirm('确定删除?',function(){
		var stats = upload_b.getStats();
		var numb=stats.successful_uploads;
		var obj = { "successful_uploads": numb-1};
		upload_b.setStats(obj);
		var dataId = $("img[narratorKey='keySet" + idx +"']").attr("id");
		$.post(getPath() + '/ebhouse/onlinesale/delNarrator',{id:dataId},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog({icon: 'succeed', time: 1,content: "删除成功!"});
			}else{
				art.dialog({icon: 'warning', time: 1,content: "删除失败!"});
			}
		},'json');
		$('#img_'+idx).remove();
	});
}



function changeSightIdx(id,obj){
//	$.post(getPath() + '/ebhouse/onlinesale/changeSightIdx',{id:id, idx: $(obj).val()},function(res){},'json');
}

function vodoeAjaxupload(id,url,idx){
	new AjaxUpload($("#"+id), {
    	action: getPath()+'/'+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)){
        		
        	}else {
                art.dialog.alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        	
        },
        onComplete: function(file, json){ 
        	if(json.STATE=='FAIL'){
        		art.dialog.alert(json.MSG);
        		return;
        	}else{
	        	var url=json.PATH;
	            var name = json.FILENAME;
	        	$("#videoPic" + idx).val(url);
	        	$("#videoPicName" + idx).val(name);
        	}
        }
    });
}



var jsonsSightImgStr="[";
function getModelTypeJson(){
	 var onlineSaleId = $("#onlineSaleId").val();
	 var houseProjectId = $("#houseProjectId").val();
	 var content = $("#Operate").find("div[key='content']");
	 var jsonsStr="[";
	 content.find("div[key='dataDetail']").each(function(i,ele){
		 jsonsStr+="{";
			var id = $(ele).find("input[id^='modelId']").val();
			var type;
			$(ele).find("input[name^='modelType']").each(function(){
				if(this.checked){
					type = this.value;
				}
			});
			var idx = $(ele).find("input[name^='idx']").val();
			var modelName = $(ele).find("input[name^='modelName']").val();
			var englishName = $(ele).find("input[name^='englishName']").val();
			var colorType = $(ele).find("select[name^='colorType']").val();
			var icoUrl = $(ele).find("img[id^='icoUrl']").attr("alt");
			var title = $(ele).find("input[name^='title']").val();
			var videoUrl = $(ele).find("input[name^='videoUrl']").val();
			var videoPic = $(ele).find("input[name^='videoPic']").val();
			var videoPicName = $(ele).find("input[name^='videoPicName']").val();
			var vodeoContent ;//= $(ele).find("input[name^='videoPicName']").val();
			if((i + 1) == 1){
				vodeoContent = contentEditor1.getContent();
			}else if((i + 1) == 2){
				vodeoContent = contentEditor2.getContent();
			}else if((i + 1) == 3){
				vodeoContent = contentEditor3.getContent();
			}else if((i + 1) == 4){
				vodeoContent = contentEditor4.getContent();
			}else if((i + 1) == 5){
				vodeoContent = contentEditor5.getContent();
			}else if((i + 1) == 6){
				vodeoContent = contentEditor6.getContent();
			}else if((i + 1) == 7){
				vodeoContent = contentEditor7.getContent();
			}else if((i + 1) == 8){
				vodeoContent = contentEditor8.getContent();
			}else if((i + 1) == 9){
				vodeoContent = contentEditor9.getContent();
			}else if((i + 1) == 10){
				vodeoContent = contentEditor10.getContent();
			}
			
			jsonsStr+="\"onlineSale\":{\"id\":\""+onlineSaleId+"\"},";
			jsonsStr+="\"id\":\"" + id + "\",";
			jsonsStr+="\"idx\":\"" + idx + "\",";
			jsonsStr+="\"type\":\"" + type + "\",";
			jsonsStr+="\"name\":\"" + modelName + "\",";
			jsonsStr+="\"englishName\":\"" + englishName + "\",";
			jsonsStr+="\"colorType\":\"" + colorType + "\",";
			jsonsStr+="\"icoUrl\":\"" + icoUrl + "\",";
			jsonsStr+="\"title\":\"" + title + "\",";
			jsonsStr+="\"videoUrl\":\"" + videoUrl + "\",";
			jsonsStr+="\"videoPic\":\"" + videoPic + "\",";
			jsonsStr+="\"description\":\"" + vodeoContent + "\",";
			jsonsStr+="\"number\":\"" + videoPicName + "\",";
			
			jsonsStr+="},";
			var sightList = $(ele).find("div[id^='sightList']");
			if(jsonsSightImgStr.length > 2){
				jsonsSightImgStr+=",";
			}
			sightList.find("dl").each(function(j, ele){
				jsonsSightImgStr+="{";
				var sightId = $(ele).find("img").attr("id");
				var imgSrc = $(ele).find("img").attr("src");
				var imgIdx = $(ele).find("input").val();
				if(sightId){
					jsonsSightImgStr+="\"id\":\""+sightId+"\",";
				}
				jsonsSightImgStr+="\"onlineSaleModel\":{\"id\":\""+id+"\"},";
				jsonsSightImgStr+="\"photoUrl\":\""+imgSrc.replace(base, "").replace()+"\",";
				jsonsSightImgStr+="\"idx\":\""+imgIdx+"\",";
				if(jsonsSightImgStr.indexOf(",")!=-1){
					jsonsSightImgStr=jsonsSightImgStr.substring(0,jsonsSightImgStr.length-1);
				}
				jsonsSightImgStr+="},";
			});	
	 });
	 if(jsonsSightImgStr.indexOf(",")!=-1){
		 jsonsSightImgStr=jsonsSightImgStr.substring(0,jsonsSightImgStr.length-1);
	 }
	 jsonsSightImgStr+="]";
	 
	 if(jsonsStr.indexOf(",")!=-1){
		 jsonsStr=jsonsStr.substring(0,jsonsStr.length-1);
	 }
	 jsonsStr+="]";
	 jsonsStr.replace("undefined","");
	return jsonsStr;
}