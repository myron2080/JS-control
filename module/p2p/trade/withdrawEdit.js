function checkmoney(){
	var t = $("#money").val();
	var leftmoney = $("#leftmoney").val();
	var tf = parseFloat(t); 
	var lf = parseFloat(leftmoney); 
	if(tf>lf) {
		art.dialog.tips("提现金额不可大于可使用余额");
		 $("#money").val('');
	}
	
}