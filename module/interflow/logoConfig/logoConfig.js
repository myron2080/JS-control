$(document).ready(function(){
	//addLogoPhotoButton("uploadLogoImage","logoImg","logoUrl");
	addLogoPhotoButton("uploadLogoImageLogin","logoImgLogin","logoUrl4Login");
	addPhotoButton("uploadImage","logoConfigphotonames");
	addLogoPhotoButton("uploadQuickMarkUrl","quickMarkUrlImg","quickMarkUrl");
	$("#logoConfigphotonames").find("img").each(function(idx,el){
		setImgSizeFun(el);
	});
	EnlargerImg.init();	
});
	
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
		var imgstr = "[";
		for(var i=0;i<dary.length;i++){
			var imgid = $(dary[i]).attr("id");
			//if(imgid) imgstr += imgid+",";
			if(imgstr!="["){
				imgstr+=",";
			}
		     imgstr+='{id:"'+imgid+'",description:"'+$("#dp"+imgid).val()+'"}';
		}
		imgstr+="]";
		$("#logoConfigphotoids").val(imgstr);
		 
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
 
/**
 * id 点击触发上传时间的按钮ID
 * parentdiv 图片名字上传后显示所在的div
 */
addPhotoButton=function(id,parentdiv){
	
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
            
/*   			$('<dl id="'+json.id+'"><dt><img id="img'+json.id+'" src="'+imgBase+'/'+url.replace("size","origin")+'" /></dt>'+
   					'<dd><a href="javascript:toDescEdit(\''+json.id+'\')"><img src="'+getPath()+'/default/style/images/remark.png"/>描述</a>&nbsp;&nbsp;'+
   					'<a href="javascript:delphoto(\''+json.id+'\')"><img style="width:15px;height:15px" src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a></dd></dl>').appendTo($("#"+parentdiv));
*/          
  			 $('<tr id=\''+json.id+'\'> <td> <img enlarger="'+imgBase+'/'+url.replace("size","origin")+'" parentComp="td" id="img'+json.id+'" src="'+imgBase+'/'+url.replace("size","origin")+'" pwidth="200" pheight="50" />'
				 +'</td> <td> <input name="dp'+json.id+'" id="dp'+json.id+'" value="" style="height:25px;width:250px"/>'
				 +'</td> <td> <a href="javascript:delphoto(\''+json.id+'\')">删除</a>'
				 +'  <a href="javascript:downOrUp(\''+json.id+'\',1)">上移</a> <a href="javascript:downOrUp(\''+json.id+'\',-1)">下移</a>'
				 +'</td> </tr>').appendTo($("#"+parentdiv));
  			 
  			setImgSizeFun($("#img"+json.id));
  			EnlargerImg.init();	
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

