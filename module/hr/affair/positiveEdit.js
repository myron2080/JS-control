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
		$("#inputdate").val(newValue.innerDate);
	}
}
//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatus").attr("value",statu);
	//$("#remark").val(CKEDITOR.instances.remark.getData());
	$("form").submit();
}

/*var config={
		 toolbar: [['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
	               ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'], 
	               ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], 
	               ['Link', 'Unlink'], 
	               ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar'],
	               '/', ['Styles', 'Format', 'Font', 'FontSize'],
	               ['TextColor', 'BGColor'], 
	               ['Maximize', 'ShowBlocks', '-', '-', 'Undo', 'Redo']],
	     width: "830", //文本域宽度
	     height: "185"//文本域高度     
	}

$(document).ready(function(){
	CKEDITOR.replace('remark', config);
	CKEDITOR.instances.remark.setData($("#remark").val());
});*/


function saveSubmit(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/affair/positive/updateSubmit");
	saveAdd(dlg);
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/affair/positive/cancleBill");
	saveAdd(dlg);
}
