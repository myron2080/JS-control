$(document).ready(function(){
	changeEvent();
	jQuery.validator.addMethod("checkPhone", function(value, element) {
		var length = value.length;
	    var mobile =  /^([+])?([0][8][6]|[8][6]|[0][0][8][6])?([-])?(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;
	    return this.optional(element) || (length == 11 && mobile.test(value));
	}, "手机号码格式错误");
});
function changeEvent(){
	var setType=$("#setType").val();
	if(setType == 'PERSONAL'){
		$("#userShowName").show();
		$("#userShowId").show();
		$("#onlyUserName").attr("validate","{required:true,maxlength:50}");
		$("#onlyUserId").attr("validate","{required:true,maxlength:50}");
	}else{
		$("#userShowName").hide();
		$("#userShowId").hide();
		$("#onlyUserName").attr("validate","");
		$("#onlyUserId").attr("validate","");
	}
}

/**
 * 保存选择电话号码
 * @param oldVal
 * @param newVal
 */
function saveSelect(oldVal,newVal){
	//phoneNo,currentPackName
	$("#showPhone").val(newVal.phoneNo);
}

/**
 * 
 * @param type
 * @param f7Id
 */
function clickNumberList(type,f7Id){
	var orgInterfaceId = $("#orgInterfaceId").val();
	if(orgInterfaceId == ''){
		art.dialog.tips("请先选择核算渠道");
		return false ;
	}
	if(type == 'open'){
		var tagUrl = getPath()+"/interflow/callNew/numberList";
		tagUrl += "?orgInterfaceId="+orgInterfaceId ;
		$("#f7GetNumberList").attr("datapickerurl",tagUrl);
		openDataPicker(f7Id);
	}else if(type == 'clear'){
		clearDataPicker(f7Id);
	}
}

function changeNumberF7(){
	$("#showPhone").val("");
}
