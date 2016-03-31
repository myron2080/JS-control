
function saveEdit(dlg){
//	currentDialog = dlg;
//	var idcardVal = $("#idCard").val();
//	var cardType = $("#cardType").val();
//	var birthday=$("#birthday").val();
//	if(!birthday){
//		art.dialog.tips('出生日期不能为空。');
//		return ;
//	}
//	if(idcardVal != null && idcardVal != ""){
//		idcardVal = idcardVal.trim();
//		$("#idCard").val(idcardVal);
//		var param = {};
//		param.idcard = idcardVal;
//		param.id=$("#applyPersonId").val();
//		param.cardType=cardType;
//		$.post(getPath()+"/hr/person/idcard/judge",param,function(res){
//			if(res.ret=="1"){
//				$("input[name='idCard']").parent().addClass("l-text-invalid");
//				$("input[name='idCard']").attr("title", res.MSG);
//				$("input[name='idCard']").poshytip();
//	        } else {
//	        	if(combinePostionJson() && combineWorkExperienceJson() 
//	        			&& combineEducationJson() && combineRewardPunishmentJson()
//	        			&& combineAgentCertificateJson()){
//	        		$("form").submit();
//	        	}
//	        }
//		},"json");
//	} else {
//		if(combinePostionJson() && combineWorkExperienceJson() 
//    			&& combineEducationJson() && combineRewardPunishmentJson()
//    			&& combineAgentCertificateJson()){
//    		$("form").submit();
//    	}
//	}
	var phone = $("#contactPhone").val();
	var mreg=/^1\d{10}$/;
	if(!mreg.test(phone)){
		art.dialog.tips("请输入合法的手机号码！")
		return false;
	}
	$("form").submit();
	return false;
}

//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatu").attr("value",statu);
	saveEdit(dlg);
}

//批量添加显示
function sBatch(obj){
	if ($("input[type='checkbox']").attr("checked")) {
		$("#batchNum").removeAttr("disabled");
	}else{
		$("#batchNum").val("");
		$("#batchNum").attr("disabled","disabled");
	}
}