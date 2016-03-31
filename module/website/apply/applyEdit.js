
function saveEdit(dlg){
	$("form").submit();
	return false;
}

//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatu").attr("value",statu);
	saveEdit(dlg);
}
