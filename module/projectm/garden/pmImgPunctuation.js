var dlg;
var flag = false;
var unit;
var bid;
var dragging = false;
var iX, iY;
var onckId;
var imgId;
$(document).ready(function() {
	
	init();

	$("#mainPic").click(function(event) {
		var scroolLeft = $(document).scrollLeft();
		var scrollTop = $(document).scrollTop();
		var left = getX(event);
		var top = getY(event);
		if (flag) {
			$("#markData").show();
			$("#markData").css("left", left);
			$("#markData").css("top", top);
			$("#markData").css("position", "absolute");
		}
	});
	initUploadImage("uploadImage", "showPic", "image");
});

function initUploadImage(button_id,fileName_id,filePath_id){	
	var upload = new SWFUpload({
			upload_url: getPath() + "/broker/room/propertyUploadImage?direct=dist/images&belong="+ gardenId + "&uploadType=DISTTFIGURE",
			file_post_name:'image',
			post_params: {direct:'myProject/images'},
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
			upload_error_handler : function(file, errorCode, message){
				art.dialog.alert("图片上传报错，请重新上传！异常详细信息："+message);
			},
			upload_success_handler : function(file, serverData, responseReceived){
				var res = eval('(' + serverData + ')');
				if("showPic"==fileName_id){ 
					$("#showPic").attr("src",base+'/images/'+(res.path?res.path.replace("size","origin"):""));
					$("#showPic").attr("enlarger",base+'/images/'+(res.path?res.path.replace("size","origin"):""));
				}
				index = "xiugai.gif";
				art.dialog.tips(res.MSG);
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/'+index,
			button_placeholder_id : button_id,
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {
			},
			debug: false
		});
}

addPhotoButton = function(id, parentdiv, type) {
	var url = "/broker/room/propertyUploadImage?direct=dist/images&belong="
			+ gardenId + "&uploadType=DISTTFIGURE";
	new AjaxUpload($("#" + id), {
		action : getPath() + url,
		autoSubmit : true,
		name : "image",
		responseType : "json",

		onSubmit : function(file, extension) {
			// 图片上传时做类型判断
			if (type == 'image') {
				if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
				} else {
					alert("只允许上传jpg|png|jpeg|gif图片");
					return false;
				}
			}
		},
		onComplete : function(file, json) {
			if (json.STATE == 'FAIL') {
				alert(json.MSG);
				return;
			} else {
				// 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
				var url = json.path;
				var id = json.id;
				var name = json.fileName;

				var path = url;
				path = path.replace('size', 'origin');
				$("#showPic").attr("src", base + "/images/" + path);
				$("#showPic").attr("enlarger", base + "/images/" + path);
				$("#addPhoto").html("修改图片");
				/*art.dialog({
					content : json.MSG,
					time : 1,
					close : function() {
						return true;
					},
					width : 200
				});*/
			}
		}
	});
}

function init() {
	var _move=false;//移动标记
	var _x,_y;//鼠标离控件左上角的相对位置
    $(".feature-photol-link").mousedown(function(e){
    	$(".feature-photol-link").removeClass("current_element");
    	$(this).addClass("current_element");
        _move=true;
        _x=e.pageX-parseInt($(this).css("left"));
        _y=e.pageY-parseInt($(this).css("top"));
        imgId = $(this).attr("id");
    });

	 $(document).mousemove(function(e){
	        if(_move){
	        	iX=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
	        	iY=e.pageY-_y;
	            $(".current_element").css({top:iY,left:iX});//控件新位置
	        }
	    }).mouseup(function(){
	    	$.post(getPath() + "/broker/garden/savePunctuation",{gardenId : gardenId,x : iX,y : iY,imgId : imgId},function(data){
				
			}, "json");
	    	_move=false;
	   });
}

function toPunctuation(id, name) {
	unit = name;
	bid = id;
	flag = true;
}

function markData(obj) {
	var left = $("#markData").position().left - 195;
	var top = $("#markData").position().top - 50;
	$.post(getPath()+"/broker/garden/getImgCount",{fid:gardenId},function(data){
		if(data.count == 0){
			art.dialog.tips("请上传楼栋分布图！");
			return false;
		}else{
			flag = false;
			$("#markData").hide();
			$.post(getPath() + "/broker/garden/savePunctuation",
							{
								gardenId : gardenId,
								unit : unit,
								x : left,
								y : top,
								bid : bid
							},
							function(data) {
								var list = data.list;
								var tempMark = "";
								$("a[key='markKey']").remove();
								for ( var i = 0; i < list.length; i++) {
									tempMark += '<a id="'
											+ list[i].id
											+ '" key="markKey" class="feature-photol-link mapinfo" href="javascript:void(0);" style="position: absolute;left: '
											+ list[i].mapx + 'px; top: ' + list[i].mapy
											+ 'px;">';
									tempMark += '<div class="feature-photo-house">';
									tempMark += '<div class="mark-red"></div>';
									tempMark += '</div>';
									tempMark += '<span>'+list[i].build.name+' - '+ list[i].build.unitName+'</span>';
									tempMark += '</a>';
								}
								$("#"+bid).attr("color","blue");
								$("#markList").append(tempMark);
								init();
							}, "json");
		}
	},"json");
	
}

function getX(e) {
	e = e || window.event;

	return e.pageX || e.clientX + document.body.scroolLeft;
}

function getY(e) {
	e = e || window.event;
	return e.pageY || e.clientY + document.body.scrollTop;
}