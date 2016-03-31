$(document).ready(function(){

});

valiData = function(){
		
		if(!contentEditor.getContentTxt()){
			art.dialog.tips("内容不能为空");
			return;
		}
	$("#dataForm").submit();
};

function saveEdit(dlg){
	currentDialog = dlg;
	$("#dataForm").submit();
}

