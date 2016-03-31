$(document).ready(function(){
	if(!$('#dataId').val()){
		addVoiceButton("uploadVoice");
	}
});

addVoiceButton=function(id){
	var url = '/projectm/pmPhoneVoice/upload?configId='+artDialog.open.origin.$list_dataParam.configId;
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "voice",
        responseType: "json",
        onSubmit: function(file, extension){
        	//图片上传时做类型判断
        	$('#loadingDiv').show(); 
        	if (extension && /^(mp3|wav)$/.test(extension)) {
            }
            else {
                alert("只允许上传 mp3,wav格式文件");
                return false;
            }
        },
        onComplete: function(file, json){  
        	$('#loadingDiv').hide();
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        	}else{
	           $('#dataId').val(json.dataId);
	           art.dialog.tips('上传成功');
	           artDialog.open.origin.resetList();
        	}
        	return;
        }
    });
}