function beforesave(){
	
	var notes=$('#notes').val();
	
	if(notes.length>200){
		art.dialog.tips("备注字符数量不能超过200个!");
		return false ;
	}
	return true ;
}


function saveEdit(dlg){
	var wordName = $("#wordName").val().trim();
    currentDialog = dlg;
    if(wordName == ""|| wordName.match(/^\s+$/g)){
		art.dialog.tips("名称不能为空");
		return;
	}else{
		
		if(beforesave()){
			
			
			$('#dataForm').submit();
		}
	   
	}
}


