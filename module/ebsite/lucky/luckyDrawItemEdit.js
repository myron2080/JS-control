var uploadType = 1;
$(function() {
	uploadImage("uploadImage");
});

function getValue(){
	$("#prizeCount").val($("#pCount").val());
}

//上传图片
function uploadImage(button_id){
	var id = $("#id").val();
	new AjaxUpload($("#"+button_id), {
    	action:getPath() + '/ebsite/luckDraw/upload?direct=Lucky/LuckyDrawItem&uploadType='+uploadType+ "&id="+id,
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
        	var url=json.path;
			if(json.STATE == "SUCCESS"){
			/*	var showPath = base+'/images/'+res.PATH.replace("size","100X75");
				$("#presalePic").val(res.PATH);
				$("#presalePicShow").attr("src",showPath);*/
				$('#presalePic').val(url);
            	$('#presalePicShow').attr('src',getPath() + '/images/' + url.replace('size','100X75'));
			} else {
				art.dialog.alert("<br>上传失败:" +"<br><br>&nbsp;" + json.MSG);
			}
        }
	 });
}
