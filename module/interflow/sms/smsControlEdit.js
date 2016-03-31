$(function(){ 
	
	checkStrategy("balanceStrategyFlag",'balanceLi','balanceAmoutLi');
	checkStrategy("limitStrategyFlag",'limitStrategyType','topLimitAmountLi');
});

//检查是否为正数
function checkNumber(obj,maxVal){
	var value = obj.value ;
	if(isNaN(value) || value < 0){
		obj.value = '0';
		obj.focus();
		return ;
	}
	value = parseInt(value);
	//最大值
	if(maxVal){
		if(value>maxVal){
			obj.value = maxVal;
			obj.focus();
		}
	}
}

function checkStrategy(objId,disId,disId2){
	var obj = $("#"+objId+"Temp");
	if(obj.attr("checked")){
		if(objId == "balanceStrategyFlag"){
			//设置 页面不能直接输入余额
			$("#"+disId).hide();
			$("#"+disId2).hide();
		}else{
			$("#"+disId).show();
			$("#"+disId2).show();
		}
		
		$("#"+objId).val("true");
	}else{
		$("#"+disId).hide();
		$("#"+disId2).hide();
		$("#"+objId).val("false");
	}
}

/**
 * 选择控制人
 * @param oldValue
 * @param newValue
 * @param doc
 */
function choosePerson(oldValue,newValue,doc){
	 $("#objectId").val(newValue.id||"");
	 $("#objectNumber").val(newValue.number||"");
	 $("#objectName").val(newValue.name||"");
}

function changeBalance(dlg){
	currentDialog = dlg;
	var balanceAmout = $("#balanceAmout").val();
	if(balanceAmout==0){
		art.dialog.tips("条数为0，不能保存");
		return ;
	}
	$('form').submit();
	return false;
}