$(document).ready(function(){
	addPhotoButton("uploadImage","wxQphotonames");
	
	if($('#dataId').val()){
		
		var imgArrStr="";
		var dary = $("#wxQphotonames").find("dl");
		for(var i=0;i<dary.length;i++){
			var imgStr = $(dary[i]).attr("src");
			if(imgStr) imgArrStr+=','+imgStr;
		}
		EnlargerImg.init({
			type:'str',
			imgUrlStr:imgArrStr
		});
	}
});
 
/**
 * id 点击触发上传时间的按钮ID
 * parentdiv 图片名字上传后显示所在的div
 */
var index=0;
addPhotoButton=function(id,parentdiv){
	var url = '/basedata/photo/upload?direct=wxQuestion';
	
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	index=index+1;
        	showload();    	
        	//图片上传时做类型判断
        	 
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
 
        	if(index>5){
        		alert("最大只允许上传5张照片");
        		hideload();
        		return false;
        	}
        	
        },
        onComplete: function(file, json){  
        	hideload();
        	if(json.STATE=='FAIL'){
        		art.dialog.tips(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
            
   			$('<dl id="'+json.id+'"><dt><img id="img'+json.id+'" src="'+imgBase+'/'+url.replace("size","origin")+'" /></dt>'+
   					'<a href="javascript:delphoto(\''+json.id+'\')"><img style="width:15px;height:15px" src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a></dd></dl>').appendTo($("#"+parentdiv));
          
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

function beforesave(){
	if(!isNotNull($('#companyName').val())){
		art.dialog.tips("公司名称不能为空!");
		$('#companyName').select();
		return false;
	}
	
	var phone=$("#telNumber").val();
	if(!isNotNull(phone)){
		art.dialog.tips("联系方式不能为空!");
		$("#telNumber").select();
		return false;
	}
	var telNo=phone.replace('\\s','').trim();
	if(!(/^([+])?([0][8][6]|[8][6]|[0][0][8][6])?([-])?(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/).test(telNo)){
		art.dialog.tips("请填写正确的手机号码!");
		$("#telNo").select();
		return false;
	}
	
	if(!isNotNull($('#content').val())){
		art.dialog.tips("内容不能为空!");
		$("#content").select();
		return false;
	}
	return true ;
}
//保存编辑数据
function saveEdit(dlg){
	var dary = $("#wxQphotonames").find("dl");
	var imgstr = "";
	for(var i=0;i<dary.length;i++){
		var imgid = $(dary[i]).attr("id");
		if(imgid) imgstr += imgid+",";
	}
	$("#wxQphotoids").val(imgstr);

	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}


$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		return false;
     }
}); 