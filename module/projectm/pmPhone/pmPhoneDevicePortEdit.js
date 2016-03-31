$(function(){
	 
});

function changeNumberF7(){
	$("#showNumber").val("");
}


function beforesave(dlg){
	var phoneMemberId = $("#phoneMemberId").val();
	if(!phoneMemberId){
		art.dialog.tips("请输入已开通的号码!");
		return false;
	}
	return true;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(typeof(beforesave) == "function"){
		if(!beforesave(dlg)){
			return ;
		}
	}
	currentDialog = dlg;
	$('form').submit();
	return false;
}
 


/**
 * 校验分配号码
 */
function getDistributePhoneNum(iptObj){
	iptObj.value = $.trim(iptObj.value);
	if(!iptObj.value){
		return ;
	}
	var para = {};
	var customerId = $("#customerId").val();
	para['customerId'] = customerId;
	 
	para['statesIn'] = "'USE','UNUSE'";//已分配 +已分配
	para['notDistributed'] = 'Y';//未匹配端口TT号
	para['showNumberEq'] = iptObj.value;
	showload();
	$.post(base+'/projectm/pmPhonemember/listAllData',para,function(showList){
		hideload(); 
		if(showList  && showList.length>0){
			if(showList.length==1){
				var obj=showList[0];
				$("#phoneMemberId").val(obj.id);
				$("#phoneMsg").text(" 正确");
				$("#phoneMsg").show();
			}else{
				$("#phoneMemberId").val('');
				//art.dialog.tips("存在重复的电话号!");
				$("#phoneMsg").text(" 存在重复的电话号!");
				$("#phoneMsg").show();
				$(iptObj).focus();
			}
		}else{
			$("#phoneMemberId").val('');
			//art.dialog.tips(" 不存在该电话号或者已分配给其它端口TT号!");
			$("#phoneMsg").text(" 不存在该电话号或者已分配给其它端口TT号!");
			$("#phoneMsg").show();
			$(iptObj).focus();
		} 
	},'json');
}
