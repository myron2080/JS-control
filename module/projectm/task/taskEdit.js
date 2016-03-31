
$(function(){
	if($("#edit_viewStatus").val() != "VIEW" && (null == $("#personFlag").val() || "" == $("#personFlag").val())){
		getPersonFromOrg();
	}
});

function getPersonFromOrg(oldValue,newValue,doc){
	var orgId = $(":hidden[dataPicker='value']").val();
	if($("#edit_viewStatus").val() == ""){
		removeOption($("select[name='dutyPerson.id'] "));
	}
	$.post(getPath()+"/projectm/task/ajaxgetperson",{orgId:orgId},function(data){
		var personList = data.personList;
		for(var i in personList){
			var tmpPerson = personList[i];
			if(($("#edit_viewStatus").val() == "EDIT" && $("select[name='dutyPerson.id'] option:selected").val() != tmpPerson.id) || ($("#edit_viewStatus").val() == "")){
				$("select[name='dutyPerson.id']").append("<option value='"+tmpPerson.id+"'>"+tmpPerson.name+"</option>");
			}
		}
	},"json");
}


function removeOption(selectComp){
	selectComp.children("option").each(function(){
		$(this).remove();
	});
}

function saveEdit(){
	if(null != $(":text[name='planEndDate']").val() && '' != $(":text[name='planEndDate']").val()){
		if($(":text[name='beginDate']").val() > $(":text[name='planEndDate']").val() ){
			art.dialog.tips("开始时间不能大于计划结束时间！！");
			return;
		}
	}
	$('form').submit();
}

function saveTempo(dialog,flag){
	var id = $("#id").val();
	var tempo = $("#tempo").val();
	var validatedTempo = $("#validatedTempo").val();
	if(flag == 'tempo'){
		if(null == tempo || '' == $.trim(tempo)){
    		art.dialog.tips("工作进度不能为空！");
    		return false;
    	}
    	
    	if(parseFloat(tempo) > 100){
    		art.dialog.tips("工作进度的数字不能够大于100");
    		return false;
    	}
	} else {
		if(null == validatedTempo || '' == $.trim(validatedTempo)){
    		art.dialog.tips("验证进度不能为空！");
    		return false;
    	}
    	
    	if(parseFloat(validatedTempo) > 100){
    		art.dialog.tips("验证进度的数字不能够大于100");
    		return false;
    	}
	}
	
	$.post(getPath()+"/projectm/task/ajaxinputprogress",{id:id,tempo:tempo,validatedTempo:validatedTempo},function(result){
		if(result.STATE=='SUCCESS'){
			art.dialog.tips(result.MSG);
			dialog.close();
		} else {
			art.dialog.alert(result.MSG);
		}
	},"json");
}
