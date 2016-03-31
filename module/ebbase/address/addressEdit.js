
function saveEdit(dlg){
	var number = $("#number").val();
	
		//检查编码是否已存在
	if(status!="ADD"){
		$.post(getPath() + '/ebbase/address/checkNumber', {
			number : number
		}, function(res) {
			if (res.STATE == 'SUCCESS') {
				art.dialog.alert("该编码已存在！");
				return;
			}else{
				$("form").submit();
			}
		}, 'json');
	}
	else{
		$("form").submit();
	}
	return false;
}