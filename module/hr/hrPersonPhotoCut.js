$(document).ready(function(){
	uploadImage();
})


//更新头像
function uploadImage(){
	var belong = $('#dataId').val();
	new AjaxUpload($("#uploadImage"), {
    	action: getPath()+'/hr/person/uploadAndCut?direct=person/head'+'&belong='+$('#dataId').val(),
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|gif图片");
                return false;
            }
        },
        onComplete: function(file, json){   
        	if(json.error){
        		alert('图片要求宽大于320，或者高大于240');
        		return;
        	}
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
        	var url=json.path;
        	var photoPath=json.photoPath;
			if(json.STATE == "SUCCESS"){
				if(jcrop_api){
				jcrop_api.destroy();}
				var suffix = url.substr(url.indexOf("."));
				var name  = url.substr(0,url.indexOf("."));
				//url = name+"_origin"+suffix;
				url = name+suffix;
				$("#photoPath").val(photoPath);
				var photoPath = getPath() + '/images/'+url;
				$("#target").attr("src",photoPath);
				$("#img180").attr("src",photoPath);
				$("#img50").attr("src",photoPath);
				$("#img30").attr("src",photoPath);
				initJcrop();
			} else {
				art.dialog.alert(json.MSG);
			}
        }
	 });
}

function save(dlg){
	currentDialog = dlg;
	if($("#photoPath").val()==null||$("#photoPath").val()==''){
		art.dialog.alert("请上传您要裁剪的图片……");
		return;}
	$.post($('form').attr('action'),$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			//art.dialog.alert(res.MSG);
			var photoPath = getPath()+"/images/"+$("#photoPath").val();
			$(top.window.document).find(".head_photo").find("img").attr("src",photoPath);
			$("#personPhoto", parent.document).attr("src",base+'/images/'+dlg.iframe.contentWindow.getPhotoPath());
			$("#photo", parent.document).val(dlg.iframe.contentWindow.getPhotoPath());
			
			dlg.close();
		}else{
			art.dialog.alert(res.MSG);
			return;
		}
    },'json');
}
function getPhotoPath(){
	return $("#photoPath").val();
}