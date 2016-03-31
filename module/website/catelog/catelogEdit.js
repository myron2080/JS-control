function saveEdit(dlg){
	var number = $("#number").val();
	if(number!="" && $("#oldNumber").val()!=number){
		//检查编码是否已存在
		$.post(getPath() + '/website/catelog/checkNumber', {
			number : number
		}, function(res) {
			if (res.STATE == 'SUCCESS') {
				art.dialog.alert("该编码已存在！");
				return;
			}else{
				fillImagesVal();
				$("form").submit();
			}
		}, 'json');
	}else{
		fillImagesVal();
		$("form").submit();
	}
	return false;
}

//填充图片value
function fillImagesVal(){
	$("#dataattachs").val(JSON.stringify(uploadImages));
}
//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatu").attr("value",statu);
	saveEdit(dlg);
}
