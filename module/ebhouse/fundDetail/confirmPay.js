function saveEdit(dlg){
	/*if(null != $("select[name='myAccount'] option:selected") && $("select[name='myAccount'] option:selected").length > 0){	//如果不是退到账面余额上去
		var myAccount = $("select[name='myAccount']").val();
		if(null == myAccount || "" == $.trim(myAccount)){
			art.dialog.tips("收款账户不能为空!!");
			return;
		}
		
		$("#settleRemark").val($("select[name='myAccount'] option:selected").html());
	}*/
	$("form").submit();
}