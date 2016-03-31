$(document).ready(function(){
	if(type=='PHOTO'){
		addPhotoButton("uploadImage","noticephotonames","image");	
	}else{
		addFileButton("uploadAttach","noticeattachnames","file");
	}
	
});

/**
 * id 点击触发上传时间的按钮ID
 * parentdiv 图片名字上传后显示所在的div
 */
addFileButton=function(id,parentdiv,type){
	
	var url = "";
	if(type=='image'){url = '/basedata/photo/upload?direct=p2pweb';}
	else if(type=='file'){url = '/basedata/attach/upload?direct=p2pweb';}
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	showload();    	
        	//图片上传时做类型判断
        	if(type=='image'){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        	}
        },
        onComplete: function(file, json){  
        	hideload();
        	//$("#loading").hide();
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
           var pdiv = $("<div style='float:left;margin-left:10px;' id='"+json.id+"div' imgid='"+json.id+"'><span>"+name+"</span><a href='javascript:void(0)' onclick=delphoto('"+json.id+"','"+type+"')>删除</a></div>");
           $("#"+parentdiv).append(pdiv);
          
          
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

/**
 * id 点击触发上传时间的按钮ID
 * parentdiv 图片名字上传后显示所在的div
 */
addPhotoButton=function(id,parentdiv,type){
	
	var url = "";
	if(type=='image'){url = '/basedata/photo/upload?direct=p2pweb';}
	else if(type=='file'){url = '/basedata/attach/upload?direct=p2pweb';}
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	showload();    	
        	//图片上传时做类型判断
        	if(type=='image'){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        	}
        },
        onComplete: function(file, json){  
        	hideload();
        	//$("#loading").hide();
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
           
           var pdiv = $("<div style='float:left;margin-left:10px;' id='"+json.id+"div' imgid='"+json.id+"'><span>"+name+"</span><a href='javascript:void(0)' onclick=delphoto('"+json.id+"','"+type+"')>删除</a></div>");
           
           $("#"+parentdiv).append(pdiv);
          
          
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

function delphoto(id,type){
	$("#"+id+"div").remove();
	var url = "";
	if(type=="image") url = "/basedata/photo/delete";
	else if(type=="file") url = "/basedata/attach/delete";
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

valiData = function(){
	if(type=='PHOTO'){
		
		var dary = $("#noticephotonames").find("div");
		if(dary.length==0){
			art.dialog.tips("请上传照片");
			return;
		}
		if(dary.length>1){
			art.dialog.tips("只可上传一张照片");
			return;
		}
		var imgstr = "";
		for(var i=0;i<dary.length;i++){
			var imgid = $(dary[i]).attr("imgid");
			if(imgid) imgstr += imgid+",";
		}
		$("#noticephotoids").val(imgstr);
		
	}else{
		
		var dary = $("#noticeattachnames").find("div");
		var attstr = "";
		for(var i=0;i<dary.length;i++){
			var imgid = $(dary[i]).attr("imgid");
			if(imgid) attstr += imgid+",";
		}
		$("#noticeattachids").val(attstr);
		
		if(!$("#dataname").val()){
			art.dialog.tips("请填写标题");
			return;
		}

		if(!$("#endTime").val()){
			art.dialog.tips("请填写失效时间");
			return;
		}
		
		if(!contentEditor.getContentTxt()){
			art.dialog.tips("内容不能为空");
		}else{
			var content = $.trim(contentEditor.getContentTxt());//获得编辑器的纯文本内容	
			var str = '';
			var ind = 1;
			while(str.length==0){
				if(100*(ind-1)>content.length){
					break;
				}else{
				var contemp = content.length>100*ind?content.substr(0,100*ind):content;
				if(contemp.lastIndexOf('&'))
				var andind = contemp.lastIndexOf('&');
				var fenind = contemp.lastIndexOf(';');
				if(andind>fenind) contemp+=';';
				andind = contemp.lastIndexOf('<');
				fenind = contemp.lastIndexOf('>');
				if(andind>fenind) contemp+='>';
				str = contemp.replace(/<.*>/g,'').replace(/&.*;/g,'').replace(/\s/g,'');
				}
				ind++;
			}
			$('#preview').val(str+'...');
		}
	}
	
	$("#dataForm").submit();
};

function saveEdit(dlg){
	currentDialog = dlg;
	valiData();
}