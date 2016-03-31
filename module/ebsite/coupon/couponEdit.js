$(function (){
	if(!$("#tempType").val()){
		$("#showLowPrice").append(
				"<td align=\"right\" style=\"border: 0\" >最低消费金额：</td>"
			    +"<td align=\"left\" style=\"border: 0\">"
			    +"<input name=\"lowPrice\" id=\"lowPrice\" type=\"text\" value=\"0\" validate=\"{required:true,number:true,min:0}\" />"
			    +"</td>"
			);
	}
	$("#couponType").change(function (){
		if($(this).val()=="CASH"){
			$("#showLowPrice").append(
				"<td align=\"right\" style=\"border: 0\" >最低消费金额：</td>"
			    +"<td align=\"left\" style=\"border: 0\">"
			    +"<input name=\"lowPrice\" id=\"lowPrice\" type=\"text\" value=\"0\" validate=\"{required:true,number:true,min:0}\" />"
			    +"</td>"
			);
		}else{
			$("#showLowPrice").empty();
		}
	});
	
	$("input[name='isBatch']").change(function (){
		if ($(this).val()==1){
			$("#addNumTitle").append("<span class=\"red\">*</span>添加数量：");
			$("#addNum").append("<input name=\"batchNum\" id=\"batchNum\" validate=\"{required:true,maxlength:40,number:true,min:1,max:1000}\" type=\"text\"/>");
		}else{
			$("#addNum").empty();
			$("#addNumTitle").empty();
		}
	});
})
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
	//$("form").submit();
	
	var beginTime = parseDate($("#beginTime").val());
	var endTime = parseDate($("#endTime").val());
	var now = new Date();
	if(beginTime!=null &&　endTime!=null){
		if(beginTime>endTime){
			art.dialog.tips('初始日期不能大于结束日期！');
			return;
		}
	}
	
	if(endTime!=null){
		if(endTime<now){
			art.dialog.tips('结束日期不能小于当前日期！');
			return;
		}
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
function isBatch(obj){
	alert(123)
	var isBatch = $("isBatch").val();
	if (isBatch==1) {
		$("#batchNum").removeAttr("disabled");
	}else{
		$("#batchNum").val("");
		$("#batchNum").attr("disabled","disabled");
	}
}