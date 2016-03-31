$(document).ready(function(){
	addLogoPhotoButton("uploadImage","picUrl");
});


	
addLogoPhotoButton=function(id,logoUrlId){
		var url = '/basedata/photo/upload?direct=blame';
		new AjaxUpload($("#"+id), {
	    	action: getPath()+url,
	        autoSubmit: true,
	        name: "image",
	        responseType: "json",
	        onSubmit: function(file, extension){
	        	//图片上传时做类型判断
	        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
	            }
	            else {
	                alert("只允许上传jpg|png|jpeg|gif图片");
	                return false;
	            }
	        },
	        onComplete: function(file, json){  
	        	if(json.STATE=='FAIL'){
	        		art.dialog.tips(json.MSG);
	        		return;
	        	}else{
		            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
		           var url=json.path;
		           var id = json.id;
		           var name = json.fileName;
		           if(json.STATE == "SUCCESS")
		           {
		        	  
		        	   url=url.split(".")[0]+"_origin."+url.split(".")[1];
		        	   url=url.replace("_size","");
		        	   $("#picUrl").val(url);
		        	  
		        	   $("#showImg").show().attr("src",imgBase + "/" + url.replace("size","150X118"));
		        	  
		       	} else {
					art.dialog.alert(json.MSG);
				}
	        	}
	        }
	    });
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
function save(){
	if(!checkValidate()){
		return;
	}else{
		$("#textContent").val(contentEditor.getContentTxt());
		$.post(getPath()+"/gagDataEdit/save",$('form').serialize(),function(res){
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
}
function cancelData(){
	art.dialog.close();
}
function checkValidate(){
	if(!isNotNull($.trim($("#title").val()))){
		art.dialog.tips("标题不能为空！");
		$("#title").select();
		return false;
	}

	if("" ==($("#picUrl").val())|| null==($("#picUrl").val()) ||($("#showImg").attr("src").length==0)){
		art.dialog.tips("图片不能为空！");
	   return false;
	}
	var content=$.trim(contentEditor.getContentTxt());
	if(null==content || ""== content){
		art.dialog.tips("内容不能为空！");
		return false;
	}else{
		if(content.length>5000){
			art.dialog.tips("输入的内容不能超过5000字！");
			return false;
		}
	} 
	return true;
}
var isNotNull = function(value){
	value = $.trim(value);
	var flag = false;
	if(value==null){
		flag = false;
	}else if(value==""){
		flag = false;
	}else if(value=="null"){
		flag = false;
	}else{
		flag = true;
	}
	return flag;
}
