$(document).ready(function(){
	$("#cancel").click(function(){
		art.dialog.close();
	});
	$("#saveBtn").click(function(){
		saveImageSet();
	});
});
//保存户型图设置
function saveImageSet(){
	var imgLenth=$("input[name='setUnitImg']:checked").length;
	if(imgLenth==0){
		art.dialog.alert('请选择户型图');
		return;
	}
	var imageId=$("input[name='setUnitImg']:checked").attr("id");
	var roomImageIds=art.dialog.data("roomImageId");
	art.dialog.data("unitImageUrl",$("input[name='setUnitImg']:checked").attr("furl"));
	$.post(getPath()+"/projectm/pmRoom/updateRoomImage",{roomImageIds:roomImageIds,imageId:imageId,cityId:cityId},function(res){
		if(res!=null){
			if(res.STATE=="1"){
				art.dialog.data("result","success");
				art.dialog.close();
			}else{
				art.dialog.alert(res.MSG);
			}
		}
	},'json');
	
}
//设置id
function unitSetId(id){
	$("input[key='"+id+"']").attr("checked",true);
}