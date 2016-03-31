$(function(){
	var messageSetId = $("#messageSetId").val();
	$("#msgType").get(0).value = messageSetId;
//    alert($("#msgType").val());
});
//类型的选择receiveType
function selectReceiveType(){
	
	//得到选中的类型
	var resultType=$('input:radio[name=receiveType]:checked').val();
	if(resultType=='all'){
		$('#receiveDiv').hide();
	}else if(resultType=='single'){
		$('#receiveDiv').show();
	}else{
		$('#receiveDiv').show();
	}
	
	
	
}

function saveEdit(dlg){
	currentDialog = dlg;
	var url=$("#url").val();
	var realName=$("#realName").val();
	if(url==""){
		art.dialog.tips('标题不能为空。');
		return ;
	}
	var content=$("#content").val();
	if(content==""){
		art.dialog.tips('消息内容不能为空');
		return ;
	} else if(content.length > 200){
		art.dialog.tips('消息内容不能大于200个字');
		return;
	}
	if($("#receiveType").val()!="all" && realName==""){
		art.dialog.tips('接收人不能为空');
		return;
	}
	$('#dataForm').submit();
	return false;
	
	
}



