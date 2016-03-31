$(document).ready(function(){
	if(!$('#dataId').val()){
		$('#isPublish').val('N');
	}
	addPhotoButton("uploadImage","wechatPhotonames","image");
//	addPhotoButton("uploadImage2","wechatPhotonames2","image");
	$("input[type='button']").bind("click",function(){
		art.dialog.close();
	});
	EnlargerImg.init();
});

function beforesave(){
	var flag =true;
	var title = $("input[name='title']").val();
	title = $.trim(title);
	if(null==title || ""==title){
		$("#titleStr").show();
		$("#contentStr").show();
		$("#contentStr").text("标题不能为空");
		flag = false;
		return ;
	}else{
		$("#titleStr").hide();
	}
	if(!contentEditor.hasContents()){
		$("#contentStr").show();
		$("#contentStr").text("内容不能为空");
		art.dialog.tips("内容不能为空");
		flag = false;
		return ;
	}else{
		$("#contentStr").hide();
	}
	
	var content = $.trim(contentEditor.getContentTxt());
	if(content.length>5000){
		flag = false;
		art.dialog({icon: 'warning',time: 1, content: "文本不能超过5000字!"});
		return ;
	}
	var dary = $("#wechatPhotonames").find("div");
	var imgstr = "";
	for(var i=0;i<dary.length;i++){
		var imgid = $(dary[i]).attr("imgid");
		if(imgid) imgstr += imgid+",";
	}
	$("#wechatPhotoids").val(imgstr);
	return flag;
	
}

function saveEdit(dlg){
	if(beforesave()){
		$('form').submit();
	}
}

function delphoto(id,type,parentdiv){
	if(parentdiv=="wechatPhotonames"){
 	   $("#picUrl").val('');
    }else{
 	   $("#picUrlT").val('');
    }
	$("#"+id+"div").remove();
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

addPhotoButton=function(id,parentdiv,type){
	var url = "/basedata/photo/upload?direct=wechat";
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	//图片上传时做类型判断
        	if(type=='image'){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        	
        	var length = $("#"+parentdiv).find("div").length;
        	if(length>=1){
        		alert("最多只允许上传1张照片");
        		return false;
        	}
        	}
        },
        onComplete: function(file, json){  
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
           var pdiv = $("<div style='float:left;margin-left:10px;' id='"+json.id+"div' imgid='"+json.id+"'><span>"+name+"</span><a href='javascript:void(0)' onclick=delphoto('"+json.id+"','"+type+"','"+parentdiv+"')>删除</a></div>");
           $("#"+parentdiv).append(pdiv);
           
           if(parentdiv=="wechatPhotonames"){
        	   $("#picUrl").val(url);
        	   $('[editImg1]').remove();
           }else{
        	   $("#picUrlT").val(url);
        	   $('[editImg2]').remove();
           }
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
	