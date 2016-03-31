var upload;
var uploadImages = {};
var gardenId="";
$(document).ready(function(){
	//initUploadImage("firstPic","firstPicName","firstPicImg");
	//initUploadImage("secondPic","firstPicName","firstPicImg");
	uploadImage("firstPic","PIC4GOODS");
	uploadImage("secondPic","PIC4GOODS");
});


function deletePhoto(id,uploadType){
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/lunch/counterpoint/deleteProjectImage',{id:id,photo:uploadType},function(res){
			if(res.STATE=="SUCCESS"){
				if(uploadType == 'firstPic'){
					var html = '<img style="border:1px solid #fa8919;display:block;" id="firstPic" alt="效果图片" src="'+base+'/default/style/images/common/add-icon.png"  width="100" height="75">';
					$("#imgpath1").val("");
					$("#fristdiv").html(html);
				}else{
					var html='<img style="border:1px solid #fa8919;display:block;" id="secondPic" alt="效果图片" src="'+base+'/default/style/images/common/add-icon.png"  width="100" height="75">';
					$("#imgpath2").val("");
					$("#seconddiv").html(html);
				}
					
				art.dialog.tips("删除成功!",null,"succeed");
				
			}else if(res.STATE=="ERROR"){
				art.dialog.tips("图已经被设置,不能删除!");
			}else{
				art.dialog.tips("删除失败!");
			}
		},'json');
	});
}


/**
 * 上传图片的方法
 * @param button_id
 * @param type
 */
function uploadImage(button_id,type){
	new AjaxUpload($("#"+button_id), {
    	action:getPath() + '/framework/images/compressUpload?direct=lunch/counterpoint/'+type,
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
        onComplete: function(file, res){ 
			if(res.STATE == "SUCCESS"){
				if(button_id == "firstPic"){
					var html ='';
					html+='<dd>';
					html+='<input type="hidden" key="'+type+'" value="'+res.PATH+'"/>';
					var showPath = base+'/images/'+res.PATH.replace("size","150X100");
					html+='<img class="bor3" src="'+showPath+'" width="100" height="75">';
					html+='<span class="delBtn" onclick="deletePhoto(\''+projectId+'\',\''+button_id+'\');"><img src="'+base+'/default/style/images/eb_back/icon_close.png"></span>';
					html+='</dd>';
					
					$("#fristdiv").html(html);
					$("#imgpath1").val(res.PATH);
				}else if(button_id =="secondPic") {
					var html ='';
					html+='<dd>';
					html+='<input type="hidden" key="'+type+'" value="'+res.PATH+'"/>';
					var showPath = base+'/images/'+res.PATH.replace("size","150X100");
					html+='<img class="bor3" src="'+showPath+'" width="100" height="75">';
					html+='<span class="delBtn" onclick="deletePhoto(\''+projectId+'\',\''+button_id+'\');"><img src="'+base+'/default/style/images/eb_back/icon_close.png"></span>';
					html+='</dd>';
					
					$("#seconddiv").html(html);
					$("#imgpath2").val(res.PATH);
				}
			} else {
				art.dialog.alert(res.MSG);
			}
        }
	 });
}