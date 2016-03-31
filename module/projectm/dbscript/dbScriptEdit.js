$(function(){
	$("#businessType").change(function(){
		getModule($(this).val());
	});
	getModule($("#businessType").val());
	
	$(":radio").each(function(){
		$(this).next("b").click(function(){
			$(this).prev(":radio").attr("checked","checked");
		});
	});
});

function saveEdit(dlg){
	if(null == $("#module").val() || '' == $("#module").val()){
		art.dialog.tips("所属模块不能为空");
		return;
	}
	currentDialog = dlg;
	$('form').submit();
	return false;
}

/**
 * 得到模块
 * @param parent
 */
function getModule(parentValue){
	$.post(getPath()+"/projectm/dbscript/getModule",{parentValue:parentValue},function(result){
		var $moduleComp = $("#module");
		removeOption($moduleComp);
		var moduleList = result.moduleList;
		for(var i =0; i< moduleList.length; i++){
			var moduleMap = moduleList[i];
			if(moduleMap.value == $("#moduleTmpValue").val()){
				$moduleComp.append("<option value='"+moduleMap.value+"' selected='selected'>"+moduleMap.name+"</option>");
			} else {
				$moduleComp.append("<option value='"+moduleMap.value+"'>"+moduleMap.name+"</option>");
			}
		}
	},"json");
	
}

/**
 * 删除选项
 * @param selectComp
 */
function removeOption(selectComp){
	selectComp.children("option").each(function(){
		$(this).remove();
	});
}