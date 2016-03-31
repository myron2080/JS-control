function setPersonInfo(oldValue,newValue,doc){
	if(newValue){
		$(doc).find("input[dataPicker=number]").val(newValue.number);
		$("#personName").val(newValue.name);
		$("#personDept").val(newValue.personPosition.position.belongOrg.name);
		$("#applyOrg").val(newValue.personPosition.position.belongOrg.id);
		$("#personPsition").val(newValue.personPosition.position.name);
		$("#applyPosition").val(newValue.personPosition.position.id);
		$("#jobLeavel").val(newValue.personPosition.jobLevel.name);
		$("#applyJoblevel").val(newValue.personPosition.jobLevel.id);
		$("#personStatus").val(newValue.personStatusName);
		$("#innerDate").val(newValue.innerDate);
	}
}
//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatus").attr("value",statu);
	var validateTime = $("#validateTime").val();
	var innerDate = $("#innerDate").val();
	if(innerDate && validateTime.trim()<innerDate.trim()){
		 art.dialog.tips('离职生效日期不能小于入职日期！');
		 return ;
	}
	$("form").submit();
}