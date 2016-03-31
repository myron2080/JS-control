$(document).ready(function(){
		var d = $("#applyPosition");
		d.unbind('change');
		d.bind('change',changeJobLevelByPosition);
		if(d.val()){
			changeJobLevelByPosition();
		}
});

function changeJobLevelByPosition(){
	var jl = $("#applyChangeJoblevelId");
	var notJobLevel = $("#notJobLevel").val();
	var changeJoblevelId = $("#changeJoblevelId").val();
	var d = $("#applyPosition");
	jl.val(null);
	jl.html('');
	if($(d).val()){
		$.post(getPath()+'/basedata/position/getJobLevelByPosition',{position:d.val()},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++){
					if(res[i] && res[i].level == notJobLevel){
						continue;
					}
					if(changeJoblevelId==res[i].id){
						$('<option value="'+res[i].id+'" selected="selected">'+res[i].name+'</option>').appendTo(jl);
					}else{
					 $('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(jl);
					}
				}
			}
		},'json');
	}
}

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
		$("#applyOrgName").val(newValue.personPosition.position.belongOrg.name);
		$("#applyPositionName").val(newValue.personPosition.position.name);
		changeJobLevelByPosition();
	}
}
//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatus").attr("value",statu);
	var jl = $("#applyChangeJoblevelId");
	if(!jl.val()){
		art.dialog.tips('职级不能为空！');
		return ;
	}
	$("form").submit();
}

function saveSubmit(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/affair/reinstatement/updateSubmit");
	saveAdd(dlg,'SUBMIT');
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/affair/reinstatement/cancleBill");
	saveAdd(dlg,'REVOKE');
}
