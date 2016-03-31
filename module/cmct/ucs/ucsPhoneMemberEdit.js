$(document).ready(function(){
	checkDelaType();
});
/**
 * 保存电信号码之前.初始化加密吃符key
 */
function beforesave(){
	var telNo=$('#telNo').val();	
	/*var ps1=$('#passwd1').val();
	var ps2=$('#passwd2').val();
	if(ps1!=ps2){
		art.dialog.tips("两次密码不一致!");
		return false;
	}*/
	
	if(!(UcsCall.checkMobile(telNo) || UcsCall.checkPhone(telNo))){
		art.dialog.tips("坐席电话格式不正确");
		return false ;
	}
	
	return true;
};

/**
 * 限制输入数字
 * @param obj
 */
function checkNaN(obj){
	var val=$(obj).val();
	if(isNaN(val)){
		$(obj).val('');
		return false
	}
	if(val.length>11){
		$(obj).val(val.substring(0,11));
	}
}
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}

function checkUserType(oldValue,newValue,doc){
	var agentId=newValue.agentId;
	$('#agentId').val(agentId);
	var dealType=newValue.dealerType;
	changeDealtype(dealType);
}

function checkDelaType(){
	var dealType=$("#dealType").val();
	changeDealtype(dealType);
}


function changeDealtype(dealType){
	if(dealType!=2){
		$('#tr_ucs_telAndorg td :eq(2)').hide();
		$('#tr_ucs_telAndorg td :eq(3)').hide();
		$('#tr_ucs_telAndorg td :eq(1)').attr("colspan",3);
	}else{
		$('#tr_ucs_telAndorg td :eq(1)').attr("colspan",0);
		$('#tr_ucs_telAndorg td :eq(2)').show();
		$('#tr_ucs_telAndorg td :eq(3)').show();
	}
}