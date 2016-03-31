$(function(){
	
});


function saveEdit(dlg){
	var name = $("#name").val();
	var number = $("#number").val();
	if(name == ""){
		art.dialog.tips("名称不能为空");
		return;
	}
	if(number == ""){
		art.dialog.tips("编码不能为空");
		return;
	}else{
		currentDialog = dlg;
		$('form').submit();
		return false;
	}
}