/**
 * 房间列表
 */
var num=0;
var upload_a;
var uploadImages = {};
$(document).ready(function(){
	EnlargerImg.init();	//放大图片
	initRoomUpload();
	//楼层设置
	$("#roomList").delegate("td","click","",function(event){
		  if (event.ctrlKey) { //  ctrl
		      	//设置元素的class
			  
			      	if("undefined" != typeof $(this).attr('title')){
			      		//如果样式已经设置，则取消
			      		if($(this).hasClass("selected")){
			      			$(this).removeClass("selected");
			      		}else{
			      			$(this).addClass("selected");
			      		}
			      	}else{
			      		if($(this).hasClass("seleTD")){
			      			$(this).siblings("td").removeClass("selected");
			      			$(this).removeClass("seleTD");
			      		}else{
			      			$(this).siblings("td").addClass("selected");
			      			$(this).addClass("seleTD");
			      		}
			      		
			      	}
		      } else {
		      	//移除元素class
		      	$('#roomList td').removeClass("selected");
			      	if("undefined" != typeof $(this).attr('title')){
			      		$(this).addClass("selected");
			      	}else{
			      		$(this).parent().find('td').addClass("selected");
			      		$(this).removeClass("selected");
			      	}
			  }
	 });
	
	$('#roomList th:eq(0)').text(parent.$("p[class='mostest current']").text());
	$('#roomList th:eq(0)').click(function(event) {
		if($(this).hasClass("allselected")){
			$('#roomList td').removeClass("selected");
			$(this).removeClass("allselected");
		}else{
			$("#roomList td").each(function(){
				if("undefined" != typeof $(this).attr('title')){
					$(this).addClass("selected");
				}
			});
			$(this).addClass("allselected");
		}
	});
	$('#roomList th:gt(0)').click(function(event) {
		if (!event.ctrlKey) {
			$('#roomList td').removeClass("selected");
		}
		var seq = $(this).text();
		if($(this).hasClass("selectTH")){
			$("#roomList td").each(function(){
				if(seq==$(this).attr('seq')){
					$(this).removeClass("selected");
				}
			} 
			);
			$(this).removeClass("selectTH");
		}else{
				$("#roomList td").each(function(){
					if(seq==$(this).attr('seq')){
						$(this).addClass("selected");
					}
				} 
				);
				$(this).addClass("selectTH");
		}
		
	});
	$("#floorSet").click(function(){
		floorSet();
	});
	$("#batchFloorSet").click(function(){
		batchFloorSet();
	});
	$("#batchAdd").click(function(){
		batchAdd();
	});
	$("#batchSet").click(function(){
		batchSetView();
	});
	$("#deleteRooms").click(function(){
		deleteRooms();
	});
	$("#addRoom").click(function(){
		addRoomView();
	});
	$("#moveRoom").click(function(){
		moveRoom();
	});
	$("#insertNum").click(function(){
		insertNum();
	});
	initType($("#property").val());
	$("#property").bind("change",function(){
		/*if($(this).val()=="SHOP"){
			$("#roomst").css("display","none");
			$("#prof").css("display","none");
			$("#proshop").css("display","");
		}else if($(this).val()=="FACTORY"){
			$("#roomst").css("display","none");
			$("#prof").css("display","");
			$("#proshop").css("display","none");
		}else{
			$("#roomst").css("display","");
			$("#prof").css("display","none");
			$("#proshop").css("display","none");
		}*/
		var proval=$(this).val();
		initType(proval);
	});
	//小区图库
	$("#gardenImage").click(function(){
		uploadGardenImage();
	});
	//批量设置户型图
	$("#roomImageSet").click(function(){
		roomImageSet();
	});
	//关联户型图
	$("#unitImageBtn").click(function(){
		unitImageSet();
	});
	//批量锁定
	$("#lock").click(function(){
		lockSet(1);
	});
	//批量解锁
	$("#unlock").click(function(){
		lockSet(0);
	});
	//设置默认选中
	$("#roomStructural").val("PLANE");
	$("#propertyType").val("APARTMENT");
	 var array = new Array();
	var min= $("#startfloor option:last").val();
	$("#startfloor").val(min);
});

function change(obj){
	$(obj).closest('ul').find('li').removeClass('hover');
	$(obj).closest('li').addClass('hover');
	var divId=$(obj).attr('divId');
	initChange(divId);
}

function initChange(divId){
	var divs=$('[divId]');
	$.each(divs,function(){
		var divStr=$(this).attr('divId');
		$('#'+divStr).hide();
	});
	$('#'+divId).show();
//	if(divId=='addDiv'){
//		art.dialog.list['EF893L'].button({
//			name: '保存',
//			focus: true,
//			callback: function () {
//				addRoom();
//				return false;
//			}
//		},{
//			name: '取消',
//			callback:function(){}
//		});
//	}else{
//		art.dialog.list['EF893L'].button(null);
//	}
}

function initType(obj){
	$('[APARTMENT],[LIVINGBUILDING],[SHOP],[VILLA],[BUILDING],[GROUND],[FACTORY],[OTHER],[OTHERS]').hide().find('select,input');
	if(obj){
		$('['+obj+']').show();
	}
	if(obj!='GROUND'){
		$('[OTHERS]').show();
	}
}

//初始化上传图片插件
function initRoomUpload(){
		$('uploadRoomImage').empty();
		upload_a = new SWFUpload({
			upload_url: getPath() + '/projectm/pmRoom/propertyUploadImage?currentUserId='+$("#currentUserId").val()+"&cityId="+cityId,
			file_post_name:'image',
			post_params: {direct:'room/images',belong:"",uploadType:"ROOMFIGURE"},
			file_size_limit : "10240",
			file_types : "*.jpg;*.gif;*.png",
			file_types_description : "images/*",
			file_upload_limit : "0",
			file_queue_limit : "0",
			file_queued_handler: function(file){
				var f = $('<dl></dl>').appendTo($('#roomPhotoList'));
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
				if(uploadImages[file.id]){
					var res = eval('(' + serverData + ')');
					var im = uploadImages[file.id];
					im.empty();
					im.attr('id',res.id);
					$('<dt><img id='+res.id+' enlarger="'+getPath()+'/images/' + res.path.replace("size","origin")+'" src="'+getPath()+'/images/'+res.path.replace("size","100X75")+'"/></dt>').appendTo(im);
					$('<dd><a href="javascript:void(0)" enlarger="'+getPath()+'/images/' + res.path.replace("size","origin")+'"><img src="'+getPath()+'/default/style/images/photo02.gif"/>原图</a> <a href="javascript:deletePhoto(\''+res.id+'\')"><img src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a></dd>').appendTo(im);
					EnlargerImg.init();	//放大图片
				}//onclick="viewLargePhoto(\''+(getPath()+'/images/' + res.path)+'\')"
				var imageTypeVal=$("#roomImageType").val();
				
				if(imageTypeVal=="ROOMPHOTO"){
					var roomId=$("#roomImageIdVal").val();
					$.post(getPath()+"/projectm/pmRoom/updateRoomImageId",{roomId:roomId,imageId:res.id,imageUrl:res.path,cityId:cityId},function(data){
						if(data.STATE=="SUCCESS"){
							art.dialog.tips("上传成功!",null,"succeed");
						}else{
							art.dialog.alert("上传失败!");
						}
					},'json');
				}
			},
			upload_complete_handler : null,
			button_image_url:getPath()+'/default/style/images/add_btn.gif',
			button_placeholder_id : "uploadRoomImage",
			button_width: 83,
			button_height: 29,
			button_cursor:SWFUpload.CURSOR.HAND,
			flash_url : getPath()+"/default/js/control/SWFUpload/Flash/swfupload.swf",
			custom_settings : {},
			debug: false
		});
}
function updateRoom(fid){
	if('undefind' == typeof(fid)||!fid){
		$("#addRoom").click();
	}else{
		$.post(getPath()+"/projectm/pmRoom/getRoomInfoById",{fid:fid,cityId:cityId},function(data){
			if(data.result){
				$('#addForm').resetForm();
				var room = data.result;
				$("#addForm").resetForm();
				$("#addForm #roomId").val(room.id);
				$("#addForm #legalNumber").val(room.legalNumber);
				$("#addForm #roomNumber").val(room.roomNumber);
				$("#addForm #seq").val(room.seq);
				$("#addForm #property").val(room.propertyType);
				$("#addForm #roomStructural").val(room.roomStructural);
				$("#addForm #buildArea").val(room.buildArea);
				$("#addForm #roomArea").val(room.roomArea);
				$("#addForm #direction").val(room.direction);
				$("#addForm #floorId").val(room.floor.id);
				$("#addForm #bedRoom").val(room.bedRoom);
				$("#addForm #livingRoom").val(room.livingRoom);
				$("#addForm #bathRoom").val(room.bathRoom);
				$("#addForm #balcony").val(room.balcony);
				$("#addForm #kitchen").val(room.kitchen);
				$("#addForm #propertyRight").val(room.propertyRight);
				if(room.unitFigureUrl){
					$("#unitFigureDiv").html("<img  enlarger='"+getPath()+"/images/"+room.unitFigureUrl.replace("size","origin")+"'  src='"+getPath()+"/images/"+room.unitFigureUrl.replace("size","400X300")+"'/>");
				    //onclick=\"viewLargePhoto('"+getPath()+"/images/"+art.dialog.data('unitImageUrl')+"')\"
					EnlargerImg.init();	//放大图片
					$("#cancelImage").click(function(){
						$.post(base+"/projectm/pmRoom/cancelImage",{id:room.id},function(res){
							if(res.STATE=="SUCCESS"){
								art.dialog.tips("操作成功！");
								$("#unitFigureDiv").html("");
								$("#cancelImage").hide();
								setTimeout(function(){window.location.reload();},1000)
							}
						},"json");
						
					});
					$("#cancelImage").show();
				}else{
					$("#unitFigureDiv").html("<img src='"+getPath()+"/default/style/images/garden/no_picture_big.gif'/>");
				}
				$("#roomImageIdVal").val(room.id);
				$("#roomImageType").val("ROOMPHOTO");
				/*if(room.propertyType=="SHOP"){
					$("#roomst").css("display","none");
					$("#prof").css("display","none");
					$("#proshop").css("display","");
					$("#addForm #shopType[value='"+room.roomPattern+"']").attr("checked","checked");
				}else if(room.propertyType=="FACTORY"){
					$("#roomst").css("display","none");
					$("#prof").css("display","");
					$("#proshop").css("display","none");
					$("#addForm #factoryType[value='"+room.roomPattern+"']").attr("checked","checked");
				}else{
					$("#roomst").css("display","");
					$("#prof").css("display","none");
					$("#proshop").css("display","none");
				}*/
				initType(room.propertyType);
				$("#roomPhotoList").html("");
				if(room.splitSale==1){
					$('#splitSale').attr('checked','checked');
				}
				$("#addForm #bunkType").val(room.bunkType);
				$("#addForm #facadeCase").val(room.facadeCase);
				$("#addForm #officeBuildType").val(room.officeBuildType);
				$("#addForm #officeBuildLv").val(room.officeBuildLv);
				$("#addForm #villaType").val(room.villaType);
				$("#addForm #villaStyle").val(room.villaStyle);
				$("#addForm #otherType").val(room.otherType);
				$("#addForm #landType").val(room.landType);
				$("#addForm #decoration").val(room.decoration);
				$("#addForm #toiletCase").val(room.toiletCase);
				if(data.roomImageList){
					//房间照片
					var roomImgStr="";
					for(var i=0;i<data.roomImageList.length;i++){
						var gardenImage=data.roomImageList[i];
						roomImgStr+="<dl id='"+gardenImage.id+"'>";
						roomImgStr+="<dt><img id='"+gardenImage.id+"' enlarger='"+getPath()+"/images/"+gardenImage.url.replace("size","origin")+"' src='"+getPath()+"/images/"+gardenImage.url.replace("size","100X75")+"'/></dt>";
						roomImgStr+="<dd><a href='javascript:void(0)'  escape='true' enlarger='"+getPath()+"/images/"+gardenImage.url.replace("size","origin")+"' ><img src='"+getPath()+"/default/style/images/photo02.gif'/>原图</a> " ;
						roomImgStr+="<a href=\"javascript:deletePhoto('"+gardenImage.id+"')\"><img src='"+getPath()+"/default/style/images/photo03.gif'/>删除</a>";
						if(gardenImage.auditer=="" || gardenImage.auditer==null){
							roomImgStr += "<br><ul><li class='bluebtn btn'><a onclick='audit(\""+gardenImage.id+"\")' style='cursor:pointer;'>审核</a></li></ul></dd>";
						}else{
							roomImgStr += "<br>审核人"+gardenImage.auditer.name+",审核时间"+gardenImage.auditDate+"</dd>";
						}
						roomImgStr+="</dl>";//onclick=\"viewLargePhoto('"+getPath()+"/images/"+gardenImage.url+"')\"
					}
					$("#roomPhotoList").html(roomImgStr);
					EnlargerImg.init();	//放大图片
				}
	//			art.dialog({
	//				title:"修改房间",
	//					content: $("#addRoomPannel").get(0),
	//					width:480,
	//					height:380,
	//					//zIndex:9999,
	//					lock : true,
	//					id: 'EF893L',
	//					ok: function () {
	//						addRoom();
	//						return false;
	//					}, 
	//		   			cancelVal: '关闭',
	//					cancel:function(){
	//						window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId;
	//					}
	//			});
				$("#photoAlbumli").show();
				roomDialog("修改房间");
			}else{
				art.dialog.alert("房间可能已经被删除！");
			}
		});
	}
}
/**
 * 审核图片
 */
function audit(id){
	$.post(base+"",{id:id},function(res){
		
	},"json");
}

function batchFloorSet(){
	if(buildingId==''){
		art.dialog.alert("请选择楼栋！");
		return;
	}
	art.dialog.open(getPath()+"/projectm/pmFloor/getList?buildingId="+buildingId+"&gardenId="+gardenId+"&cityId="+cityId, {
		title : '批量楼层设置',
		lock : true,
		id: 'FLOORSETV',
		padding : 0,
		width : 320,
		height : 400,
		close:function(){
			window.parent.document.getElementById("roomLists").contentDocument.location.reload();
		}
	});
}

function floorSet(){
	if(buildingId==''){
		art.dialog.alert("请选择楼栋！");
		return;
	}
	var dlg=art.dialog.open(getPath()+"/projectm/pmFloor/floorSet?buildingId="+buildingId+"&gardenId="+gardenId+"&cityId="+cityId, {
		title : '楼层设置',
		lock : true,
		id: 'FLOORSETV',
		padding : 0,
		width : 690,
		height : 400,
		button : [ {
			className : 'aui_state_highlight',
			name : '确定',
			callback : function() {
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveData){
					dlg.iframe.contentWindow.saveData(dlg);
				}
				return false;
			}
		} , {
			name : '取消',
			callback : function() {
			}   
		}],
		close:function(){
			window.parent.document.getElementById("roomLists").contentDocument.location.reload();
		}
	});
}

function batchAdd(){
	if(buildingId==''){
		art.dialog.alert("请选择楼栋！");
		return;
	}
	$('#batchAddForm #endnum').val($("td[class='selected']").length-1);
	art.dialog({
		title:"批量新增",
			content: $("#batchAddView").get(0),
			width:500,
			height:150,
			id: 'EF893L',
			ok: function () {
				if($("#batchAddForm #startnum").val()==''){
					art.dialog.tips("起始编号不能为空！");
					return false;
				}
				if($("#batchAddForm #endnum").val()==''||$("#batchAddForm #endnum").val()=='-1'){
					art.dialog.tips("结束编号不能为空！");
					return false;
				}
				$("#loading").show();
				$("#batchAddForm").ajaxSubmit(function(message) {
					window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId;
					$("#loading").hide();
				});
			}, 
			cancelVal: '关闭',
		    cancel: true 
		});
}

//迁移
function moveRoom(){
	art.dialog.data("flag",false);
	var roomIds = getSelectIds();
	if(buildingId==''){
		art.dialog.alert("请选择楼栋！");
		return;
	}
	
	if(roomIds==""){
		art.dialog.alert("你没有选择任何房间！");
		return;
	}
	art.dialog.data("roomIds",roomIds);
	var dlg=art.dialog.open(getPath()+'/projectm/pmRoom/moveRoom?buildingId='+buildingId+'&gardenId='+gardenId+'&type=mr'+'&roomIds='+roomIds+'&cityId='+cityId,
			 {
		title:"迁移",
		id : 'moveTo',
		width : 480,
		height :150,
		close:function(){
			if(art.dialog.data("flag")){
				window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+'&cityId='+cityId;
			}
		},
		button : [ {
			className : 'aui_state_highlight',
			name : '确定',
			callback : function() {
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.submitMove){
					dlg.iframe.contentWindow.submitMove(dlg);
				}
				return false;
			}
			}
		 , {
			name : '取消',
			callback : function() {
			}   
		}]
		
	});
	
}

function batchSetView(){
	if(buildingId==''){
		art.dialog.alert("请选择楼栋！");
		return;
	}
	var roomIds = getSelectIds();
	if(roomIds==""){
		art.dialog.alert("你没有选择任何房间！");
		return;
	}
	art.dialog.data("roomIds",roomIds);
	var dlg=art.dialog.open(getPath()+'/projectm/pmRoom/roomBatchSetcoView?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId,
			 {
		title:"批量设置",
		id : 'opernbatchSetWindow',
		width : 850,
		height :450,
		close:function(){
			window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId;
		},
		button : [ {
			className : 'aui_state_highlight',
			name : '确定',
			callback : function() {
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveData){
					dlg.iframe.contentWindow.saveData(dlg);
				}
				return false;
			}
		} , {
			name : '取消',
			callback : function() {
			}   
		}]
		
	});
}

/**
 * 得到选中的id
 * 
 */
function getSelectIds(){
	var roomIds="";
	$("td").each(function(){
    	if($(this).hasClass("selected") && $(this).attr('title')==1)
		{ 
    		var obj = $(this).find(".roomId");
    		roomIds+=obj.val()+",";
		} 
  	});
	
	return roomIds;
}

/**
 * 得到选中的格子数据
 * */
function getTdInfo(){
	var arr =new Array();
	$("td").each(function(){
    	if($(this).hasClass("selected") && $(this).attr('title')==0)
		{ 
    		var tdInfo={};
    		var obj = $(this).closest("tr").find("#nfloorId");
    		tdInfo.floorId=obj.val();
    		tdInfo.seq =$('#roomList th:eq('+($(this).index()-1)+')').find("#nseq").val();
    		arr.push(tdInfo);
		} 
  	});
	return arr;
}

/**
 * 添加单个房间
 * 
 */
function clearNoNum(obj)
{
	//先把非数字的都替换掉，除了数字和.
	obj.value = obj.value.replace(/[^\d.]/g,"");
	//必须保证第一个为数字而不是.
	obj.value = obj.value.replace(/^\./g,"");
	//保证只有出现一个.而没有多个.
	obj.value = obj.value.replace(/\.{2,}/g,".");
	//保证.只出现一次，而不能出现两次以上
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
}

function addRoom(){
	if($("#addForm #roomNumber").val()==''){
		art.dialog.tips("房号不能为空！");
		return;
	}
	if($("#addForm #seq").val()==''){
		art.dialog.tips("序号不能为空！");
		return;
	}	
	$("#addForm").ajaxSubmit(function(data) {
		if(data){
			if(data.ret=="1"){
				art.dialog.tips(data.msg,null,"succeed");
				art.dialog.list["EF893L"].close();
				parent.displayLoading();
				
				window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId;
			}else{
				art.dialog.alert(data.msg);
			}
		}
	});
}
function addRoomView(){
	$('#addForm').resetForm();
	$("#photoAlbumli").hide();
//	$('#property').trigger('change',['SHOP']);
	roomDialog("新增房间");
}

function roomDialog(tile){
	//判读是否选中格子
	var arr = getTdInfo();
	if(arr.length>0){
		$("#addForm").find("#floorId").val(arr[0].floorId);
		$("#addForm").find("#seq").val(arr[0].seq);
		var tempSeq=arr[0].seq
		if(arr[0].seq<10){
			tempSeq="0"+arr[0].seq;
		}
		$("#addForm").find("#roomNumber").val($("#addForm").find("#floorId option:selected").text().trim()+tempSeq);
//		var doc=$("td[class='selected']");
//		if(doc){
//			var prevDoc=doc.prev();
//			var nextDoc=doc.next();
//			if(prevDoc && nextDoc){
//				var pervNumber=prevDoc.find("#numberIndex").text();
//				var nextNumber=nextDoc.find("#numberIndex").text();
//			}
//			
//		}
	}
	art.dialog({
		title:tile,
		content: $("#addRoomDiv").get(0),
		width:450,
		height:180,
		id: 'EF893L',
		ok: function () {
			addRoom();
			return false;
		}, 
		cancelVal: '关闭',
	    cancel: true 
	});
	initChange('addDiv');
}
function showViaKeypress(type){
	//复制
	var roomIds = getSelectIds();
	if(type==1){
		//给表格加样式
		$("#roomList .selected[title=1]").find(".hook").css("display","block");
		$("#roomList .selected[title=1]").find(".beforSel").val("1");
	}
	//粘贴
	if(type==2){
		var emptyc = $("#roomList .selected[title=0]").length;
		var selectc = $(".beforSel[value=1]").length;
		if(selectc==0){
			return;
		}
		//得到之前选中的表格
		if(emptyc!=selectc){
			art.dialog.alert("数据不能复制！原因【复制数据数("+selectc+")与目标格子数("+emptyc+")不相等】");
			return;
		}
		art.dialog.confirm("确定将房间复制到此位置？",function(){
			//判断选中表格数和目标表格数是否一致
			$(this).hasClass("selected") && $(this).attr('title')==1
			var empty = $("#roomList .selected[title=0]").length;
			var arr = getTdInfo();
			//如果一致遍历选中的格子
			var seArr = new Array();
			$(".beforSel[value=1]").each(function(){
				var roomId = $(this).closest("td").find(".roomId").val();
				seArr.push(roomId);
			});
			 var i=0;
			 parent.displayLoading();
			 $(arr).each(function(index){
				 var floorId=this.floorId;
				 var seq=this.seq;
				 var roomId =  seArr[index];
				 $.post(getPath()+"/projectm/pmRoom/copyOrMove",{roomId:roomId,floorId:floorId,seq:seq,type:'C'},function(data){
					 i++;
					 if(i==arr.length){
						 art.dialog.tips("复制完成",null,"succeed");
						 window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId;
					 }
				 },"json");
			 });
		});
	}
	
	//剪切
	if(type==3){
		var emptyc = $("#roomList .selected[title=0]").length;
		var selectc = $(".beforSel[value=1]").length;
		if(selectc==0){
			return;
		}
		//得到之前选中的表格
		if(emptyc!=selectc){
			art.dialog.alert("数据不能复制！原因【移动数据("+selectc+")与目标格子数("+emptyc+")不相等】");
			return;
		}
		art.dialog.confirm("确定将房间移动到此位置？",function(){
			//判断选中表格数和目标表格数是否一致
			$(this).hasClass("selected") && $(this).attr('title')==1
			var empty = $("#roomList .selected[title=0]").length;
			var arr = getTdInfo();
			//如果一致遍历选中的格子
			var seArr = new Array();
			$(".beforSel[value=1]").each(function(){
				var roomId = $(this).closest("td").find(".roomId").val();
				seArr.push(roomId);
			});
			 var i=0;
			 parent.displayLoading();
			 $(arr).each(function(index){
				 var floorId=this.floorId;
				 var seq=this.seq;
				 var roomId =  seArr[index];
				 $.post(getPath()+"/projectm/pmRoom/copyOrMove",{roomId:roomId,floorId:floorId,seq:seq,type:'M'},function(data){
					 i++;
					 if(i==arr.length){
						 art.dialog.tips("移动完成",null,"succeed");
						 window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId;
					 }
				 },"json");
			 });
		});
	}
	if(type==4){
		$("#roomList .selected[title=1]").find(".hook").css("display","none");
		$("#roomList .selected[title=1]").find(".beforSel").val("0");
	}
}
/**
 * 删除房间
 * 
 */

function deleteRooms(){
	var roomIds = getSelectIds();
	if(roomIds==""){
		art.dialog.alert("你没有选择任何房间！");
		return;
	}
	art.dialog.confirm("是否确定删除选中房间?",function(){
	$("#loading").show();
	$.post(getPath()+"/projectm/pmRoom/deleteRoom",{roomIds:roomIds,cityId:cityId},function(res){
		if(res!=null){
			if(res.STATE=="1"){
				window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId;
				$("#loading").hide();
			}else{
				$("#loading").show();
				art.dialog.alert(res.MSG);
			}
		}
	});
	});
}

function insertNum(){
	var roomIds = getSelectIds();
	if(roomIds==""){
		art.dialog.alert("你没有选择插入位置！");
		return;
	}
	art.dialog.confirm("是否确定插入序号?",function(){
		$("#loading").show();
		$.post(getPath()+"/projectm/pmRoom/insertNum",{roomIds:roomIds,buildingId:buildingId,cityId:cityId},function(res){
			if(res!=null){
				if(res.STATE=="1"){
					window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+'&cityId='+cityId;
					$("#loading").hide();
				}else{
					$("#loading").hide();
					art.dialog.alert(res.MSG);
				}
			}
		});
		});
}

//批量锁定
function lockSet(lock){
	var roomIds = getSelectIds();
	if(roomIds==""){
		art.dialog.alert("你没有选择任何房间！");
		return;
	}
	$("#loading").show();
	$.post(getPath()+"/projectm/pmRoom/lockRoom?lock="+lock,{roomIds:roomIds,cityId:cityId},function(res){
		if(res!=null){
			if(res.STATE=="1"){
				window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId;
				$("#loading").hide();
			}else{
				$("#loading").show();
				art.dialog.alert(res.MSG);
			}
		}
	});
}

//小区图库
function uploadGardenImage(){
	art.dialog.open(getPath()+'/projectm/pmRoom/uploadImageView?gardenId='+gardenId+"&cityId="+cityId,{
		    title:"小区图库上传",
			width:740,
			height:515,
			id: 'uploadGardenImage',
   			cancelVal: '关闭',
   		    cancel: true 
	});
}
//批量设置户型图
function roomImageSet(){
	var roomIds = getSelectIds();
	if(roomIds==""){
		art.dialog.alert("你没有选择任何房间！");
		return;
	}
	art.dialog.data("roomImageId",roomIds);
	$.post(getPath() + '/projectm/pmRoom/loadUnitImage',{id:gardenId,cityId:cityId},function(res){
		if(res.unitImages&&res.unitImages.length>0){
			art.dialog.data("result",null);
			art.dialog.open(getPath()+'/projectm/pmRoom/roomImageSet?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId,
					{title:"批量设置户型图",
					 lock:true,
					 width:800,
					 height:480,
					 id:"roomImageSet",
					 close:function(){
							if(art.dialog.data("result") && ("success" == art.dialog.data("result"))){
								art.dialog.tips("保存成功",null,"succeed");
								window.location.href=getPath()+'/projectm/pmRoom/getList?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId
							}
							return true;
					}
			});
		}else{
			art.dialog.alert("请先上传户型图！");
		}
	},'json');
}
//关联户型图
function unitImageSet(){
	art.dialog.data("result","");
	art.dialog.data("roomImageId",$("#roomImageIdVal").val());
	art.dialog.open(getPath()+'/projectm/pmRoom/roomUnitImageSet?buildingId='+buildingId+'&gardenId='+gardenId+"&cityId="+cityId,
			{title:"关联户型图",
			 lock:true,
			 width:800,
			 height:480,
			 id:"unitImageSet",
			 close:function(){
					if(art.dialog.data("result") && ("success" == art.dialog.data("result"))){
						art.dialog.tips("保存成功",null,"succeed");
						var unitUrl = art.dialog.data('unitImageUrl');
						$("#unitFigureDiv").html("<img  enlarger='"+getPath()+"/images/"+unitUrl.replace("size","origin")+"')\" src='"+getPath()+"/images/"+unitUrl.replace("size","400X300")+"'/>");
						EnlargerImg.init();	//放大图片   //onclick=\"viewLargePhoto('"+getPath()+"/images/"+art.dialog.data('unitImageUrl')+"'
						$("#cancelImage").show();
					}
					return true;
			}
	});
}
//查看原图
function viewLargePhoto(path){
	window.open(path,'_blank','top=0,left=0,scrollbars=yes,resizable=true,toolbar=no,location=no');
}