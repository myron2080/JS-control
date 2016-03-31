$(document).ready(function(){
	var businessType = $("a[name=businessType]").first().attr("value");
	$("#"+businessType).addClass("hover");
	$("span[key=module]").each(function(){
		if($(this).attr("name")==businessType){
			$(this).show();
		}else{
			$(this).hide();
		}
	});
	
	var moduleStr = $("#moduleStr").val();
	$("#moduleStr").val(moduleStr);
	$("input[key=moduleInput]").each(function(){
		if($(this).is(':checked')==true){
			moduleStr += $(this).attr("id")+",";
		}else{
			moduleStr = moduleStr.replace($(this).attr("id")+",","");
		}
	});
	$("#moduleStr").val(moduleStr);
	
});

/**
 * 根据行业现实模块
 */
function showModule(businessType){
	$("li[name=moduleLi]").each(function(){
		$(this).removeClass("hover")
	});
	$("#"+businessType).addClass("hover");
	$("span[key=module]").each(function(){
		if($(this).attr("name")==businessType){
			$(this).show();
		}else{
			$(this).hide();
		}
	});
}

function setValue(obj){
	var moduleStr = $("#moduleStr").val();
	if($(obj).is(':checked')==true){
		moduleStr += $(obj).attr("id")+",";
	}else{
		moduleStr = moduleStr.replace($(obj).attr("id")+",","");
	}
	$("#moduleStr").val(moduleStr);
}

function isValid(obj){
	var type = $(obj).attr("key");
//	if(type=="computer"){
		if($(("input[key=computer]")).is(':checked')==true){
			$("#computer").val(1);
		}else{
			$("#computer").val(0);
		}
//	}else{
		if($("input[key=mobile]").is(':checked')==true){
			$("#mobile").val(1);
		}else{
			$("#mobile").val(0);
		}
//	}
}

function beforesave(dlg){
	if($('#gardenFlagInput').attr("checked")){
		$('#gardenFlag').val("YES");
	}else{
		$('#gardenFlag').val("NO");
	}
}

function saveEdit(dlg){
	currentDialog = dlg;
	$.post(getPath()+"/projectm/customer/licenseNo",{neId:$("input[name='id']").val(),licenseNo:$("input[name='licenseNo']").val()},function(res){
		if(res.MSG){
			$("input[name='licenseNo']").parent().addClass("l-text-invalid");
			$("input[name='licenseNo']").attr("title", res.MSG);
			$("input[name='licenseNo']").poshytip();
        }else{
        	$("form").submit();
        }
	},"json");
	return false;
}