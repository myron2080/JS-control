$(document).ready(function(){
				
	addLogoPhotoButton("uploadLogoImage","logoImg","logoUrl");
	//addLogoPhotoButton("uploadLogoImageLogin","logoImgLogin","logoUrl4Login");
	//addPhotoButton("uploadImage","logoConfigphotonames");
	//addLogoPhotoButton("uploadQuickMarkUrl","quickMarkUrlImg","quickMarkUrl");
	initajaxupload("uploadImage","framework/images/upload?direct=shortcuticon",afterupload,showload);
	$("#systemicon").bind("click",function(){
		flag="largeIcon";
		popDialog("/permission/menu","flag=miniIcon");
	});
});
afterupload = function(json){
	hideload();
	if(json.STATE=='FAIL'){
		art.dialog.alert(json.MSG);
		return;
	}else{
	 var url=json.PATH;
     var name = json.FILENAME;
     $("#iocUrl").val(url);
     $("#ioc").attr("src",getPath()+"/images/"+url);
     $("#ioc").show();
     art.dialog.tips(json.MSG);
	}
}

addLogoPhotoButton=function(id,logoUrlId,imgUrl){
		
		var url = '/basedata/photo/upload?direct=logoConfig';
		 
		new AjaxUpload($("#"+id), {
	    	action: getPath()+url,
	        autoSubmit: true,
	        name: "image",
	        responseType: "json",
	        onSubmit: function(file, extension){
	        	showload();    	
	        	//图片上传时做类型判断
	        	 
	        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
	            }
	            else {
	                alert("只允许上传jpg|png|jpeg|gif图片");
	                return false;
	            }
	        	
	        },
	        onComplete: function(file, json){  
	        	hideload();
	        	//$("#loading").hide();
	        	if(json.STATE=='FAIL'){
	        		art.dialog.tips(json.MSG);
	        		return;
	        	}else{
	            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
	           var url=json.path;
	           var id = json.id;
	           var name = json.fileName;
	           $("#"+logoUrlId).attr("src",imgBase+"/"+url.replace("size","origin"));
	           $("#"+logoUrlId).show();
	           $("#"+imgUrl).val(url.replace("size","origin"));
	          
	           art.dialog({
	        	   content:json.MSG,
	        	   time:1,
	        	   close:function(){
	        	   return true;
	        	   },
	        	   width:200
	        	   });

	           
	        }
	        }
	    });
	}
 valiLogoConfig = function(){
		var flag =true;
		
		var dary = $("#logoConfigphotonames").find("dl");
		var imgstr = "";
		for(var i=0;i<dary.length;i++){
			var imgid = $(dary[i]).attr("id");
			if(imgid) imgstr += imgid+",";
		}
		$("#logoConfigphotoids").val(imgstr);
		
		return flag;
		
}
	
 function saveLogoConfig(){
	 var dary = $("#logoConfigphotonames").find("tr");
		var imgstr = "";
		for(var i=0;i<dary.length;i++){
			var imgid = $(dary[i]).attr("id");
			if(imgid) imgstr += imgid+",";
		}
		 
		$("#shortcutids").val(imgstr);
		changeBox();
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				art.dialog({icon: 'succeed', time: 1,content: "保存成功!"});
				setTimeout(function(){
					art.dialog.close();
				},1000);
				parent.toolLoad();//更新数据
			}else{
				art.dialog.tips("保存失败");
			}
	    },'json');
	}
  

function delphoto(id){
	$("#"+id).remove();
	var url = "/basedata/photo/delete";
	 
	$.post(getPath()+url,{id:id},function(json){
		json = eval("("+json+")");
		if(json.STATE=='FAIL'){
    		alert(json.MSG);
    		return;
    	}else{
    		  art.dialog({
           	   content:json.MSG,
           	   time:1,
           	   close:function(){
           	   return true;
           	   },
           	   width:200
           	   });
    	}
	});
	
}
function downOrUp(id,idx){
		var pel=$("#"+id);
		if(idx==1 && pel.prev()){
			var nel=pel.prev();
			nel.before(pel);
		}else if(pel.next()){
			var nel=pel.next();
			pel.before(nel);
		}
}
function toDescEdit(photoId){
	var content = $("#photoDescDiv").html();
	function saveDesc(){
		var _photoDesc = $("input[name='photoDescInpt']",$("#photoDesc").get(0)).val();
		if(!_photoDesc){
			art.dialog.tips("请输入图片描述");
			return false;
		}
		if(_photoDesc.length>40){
			art.dialog.tips("图片描述不能超过40个字符");
			return false;
		}
		$.post(getPath()+"/basedata/photo/save",{id:photoId,description:_photoDesc},function(data){
			$("#img"+photoId).attr("title",_photoDesc);
			art.dialog({icon: 'succeed', time: 1,content: "保存成功!"});
			setTimeout(function(){
				art.dialog.close();
			},1000);
		});
		
		closeSQLDialog();
	}
	var dialog = art.dialog({
		title:"图片描述",
		icon:null,
	    content: '<div id="photoDesc" style="width:400px;height:60px;">'+content+'</div>',
	    id: "photoDesc",
	    lock:true,
	    left:5,
	    button:[{name:"确定",callback:saveDesc},{name:"取消",callback:closeSQLDialog}]
	});
	function closeSQLDialog(){
		dialog.close();
	}
	$("input[name='photoDescInpt']",$("#photoDesc").get(0)).val($("#img"+photoId).attr("title"));
	dialog.show();
}
/**
 * 给首页工具箱 赋值 
 */
function changeBox(){
	var value="";
	$("input[name='toolItem']").each(function(){
		if($(this).attr("checked")){
			value+=$(this).val()+",";
		}
	});
	if(value.indexOf(",") != -1){
		value=value.substring(0,value.length-1);
	}
	$("#toolCheck").val(value);
}

//添加快捷
function addShortcut(){
	$("[name=typeOption]").eq(0).attr("selected","true");
	$("[name=menuOption]").eq(0).attr("selected","true");
	 //setSubMenu($("#menu").val(),true,'');
	$("#name").val("");
	$("#url").val("");
	$("#remark").val("");
	$("#shortcutId").val("");
	$("#openType").val("");
	$("#windowRemark").hide();
	$("#ioc").hide();
	$("#iocUrl").val("");
	$("#menuUl").show();
	$("#urlUl").hide();
	art.dialog({
		content:$("#baseBank_edit")[0],
		title:'新建快捷方式',
		id:'shortcutWindow',
		button:[{name:'确定',callback:function(){
			saveShortcut();
			return false;
		}},{name:'取消',callback:function(){
			location.reload(true);
			return true;
		}}]
	});
}

//删除快捷
function deleteRow(id){
	art.dialog.confirm("确认删除该快捷方式？",function(){
		$.post(getPath()+"/basedata/shortcut/delete",{id:id},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips(res.MSG);
				location.reload(true);
			}else{
				art.dialog.tips(res.MSG);
			}
		},"json");
	});
}
 

//修改快捷
function updateRow(id){
	$.post(getPath()+"/basedata/shortcut/getShortcutById",{id:id},function(res){
		if(res.STATE == 'SUCCESS'){
			$("[name=typeOption]").each(function(){
				if($(this).val()==res.shortcut.type){
					$(this).attr("selected","selected");
				}
			});
			$("#shortcutId").val(res.shortcut.id);
			$("#name").val(res.shortcut.name);
			$("#remark").val(res.shortcut.remark);
			$("#openType").val(res.shortcut.openType);
			if(res.shortcut.ioc!=""){
				$("#ioc").attr("src",getPath()+'/images/'+res.shortcut.ioc);
			}else{
				$("#ioc").hide();
			}
			if(res.shortcut.ioc!=''){
				$("#iocUrl").val(res.shortcut.ioc);
				$("#ioc").show();
			}
			if(res.shortcut.openType="WINDOW"){
				$("#windowRemark").show();
			}
			if(res.shortcut.type=="MENU"){
				setSubMenu(res.parentLongNumber,false,res.shortcut.menu.id);
				$("#menu").val(res.parentLongNumber);
				$("#menuUl").show();
				$("#urlUl").hide();
			}else{
				$("#url").val(res.shortcut.url);
				$("#menuUl").hide();
				$("#urlUl").show();
			}
			art.dialog({
				content:$("#baseBank_edit")[0],
				title:'修改快捷方式',
				id:'shortcutWindow',
				button:[{name:'确定',callback:function(){
					saveShortcut();
					return false;
				}},{name:'取消',callback:function(){
					location.reload(true);
					return true;
				}}]
			});
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

function popDialog(moduleUrl,param){
	art.dialog.data("selectedValue",null);
	var dlg = art.dialog.open(getPath()+moduleUrl+"/chooseImage"+(param ? "?"+param : ""),{
		title:'图片选择',
		lock:true,
		width:'800px',
		height:'480px',
		id:"personPermission",
		button:[{name:'确定',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
				dlg.iframe.contentWindow.saveEdit();
			}
			return false;
		}},{name:'取消',callback:function(){
			flag = false;
			return true;
		}}],
	 close:function(){
		 var selectedValue = art.dialog.data("selectedValue");
		 if(selectedValue){
			 $("#ioc").attr("src",getPath()+"/images/"+selectedValue);
			 $("#iocUrl").val(selectedValue);
			 $("#ioc").show();
		 }
	 }
	});
}


//保存编辑
function saveShortcut(){
	var url = $("#url").val();
	var type = $("#type").val();
	var name = $("#name").val();
	var remark = $("#remark").val();
	if(name==""){
		art.dialog.tips("快捷名称不能为空！");
		return;
	}
	if(name.length>5){
		art.dialog.tips("快捷名称最多5字！");
		return;
	}
	if(remark.length>200){
		art.dialog.tips("描述最多输入200字！");
		return;
	}
	if(type!="MENU" && url==""){
		art.dialog.tips("连接url不能为空！");
		return;
	}
	if(url.length>100){
		art.dialog.tips("连接字符最多输入100！");
		return;
	}
	$.post(getPath()+"/basedata/shortcut/save",{id:$("#shortcutId").val(),name:name,type:type,url:url,ioc:$("#iocUrl").val(),openType:$("#openType").val(),remark:remark,isFrameworkShortcut:1},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			art.dialog.list["shortcutWindow"].close();
			location.reload(true);
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}