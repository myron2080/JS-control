$(function() {
 
});
// 保存编辑数据
function saveEdit(dlg) {
	
	console.info(dlg);
	if ($("#smsBody").val() == '' || $("#smsBody").val() == undefined) {
		art.dialog.tips('请输入要发送的消息内容！');
		return ;
	}
	currentDialog = dlg;
	// 这里不提交表单。只传入消息
	art.dialog.data("smsBody", $("#smsBody").val());
	//执行传入的方法
	art.dialog.data("sendsms")();
	return false;
	
	
	$("#smsForm")[0].submit();
}