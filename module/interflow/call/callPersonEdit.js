/**
 * 将中文逗号转换为英文逗号
 * @param str
 */
function replaceDot(obj){
     var oldValue=obj.value;
     while(oldValue.indexOf("，")!=-1){
         obj.value=oldValue.replace("，",",");
         oldValue=obj.value;
     }
}

/**
 * 保存新增数据
 * @param dlg
 * @returns {Boolean}
 */
function saveAdd(dlg){
	currentDialog = dlg;
	if($("#loginNumber") && $("#loginNumber").val() == ''){
		art.dialog.tips("注册号码不能为空");
		return false ;
	}else{
		var loginNumber = $("#loginNumber").val() ;
		if(loginNumber && loginNumber!=''){
			if(!checkMobile(loginNumber)){
				art.dialog.tips("注册号码格式不正确，必须为手机号码");
				return false;
			}
		}
	}
	saveEdit(dlg);
	return false;
}

/**
 * 保存编辑数据
 * @param dlg
 * @returns {Boolean}
 */
function saveEdit(dlg){
	currentDialog = dlg;
	if($("#newPhone") &&  $("#newPhone").val() == ''){
		art.dialog.tips("注册号码不能为空");
		return false ;
	}else{
		var newPhone = $("#newPhone").val() ;
		if(newPhone && newPhone!=''){
			if(!checkMobile(newPhone)){
				art.dialog.tips("注册号码格式不正确，必须为手机号码");
				return false;
			}
		}
	}
	if($("#answerPhone").val()!=''){
		var answerPhoneList = $("#answerPhone").val().split(",");
		var isPass = true ;
		for(var i = 0 ; i < answerPhoneList.length ; i ++){
			if(!(checkMobile(answerPhoneList[i]) || checkPhone(answerPhoneList[i]))){
				isPass = false ;
				break ;
			}
		}
		if(!isPass){
			art.dialog.tips("接听话机号码格式不正确");
			return false;
		}
	}
	if($("#showPhone").val()!=''){
		var showPhoneList = $("#showPhone").val().split(",");
		var isPass = true ;
		for(var i = 0 ; i < showPhoneList.length ; i ++){
			if(!(checkMobile(showPhoneList[i]) || checkPhone(showPhoneList[i]))){
				isPass = false ;
				break ;
			}
		}
		if(!isPass){
			art.dialog.tips("去电显示号码格式不正确");
			return false;
		}
	}
	if($("#isAllot").attr("checked")){
		$("#isAllot").val("YES");
	}else{
		$("#isAllot").val("NO");
	}
	$('form').submit();
	return false;
}
/**
 * 手机号码匹配格式
 * @param phoneNo
 * @returns
 */
function checkMobile(phoneNo) {
	if (phoneNo)
		phoneNo = phoneNo.replace('\\s', '');
	return /^([+])?([0][8][6]|[8][6]|[0][0][8][6])?([-])?(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/
			.test(phoneNo);
}
/**
 * 座机，固话匹配格式,格式必须为：0755-36510001
 * @param phoneNo
 * @returns
 */
function checkPhone(phoneNo){
	if (phoneNo)
		 phoneNo = phoneNo.replace('\\s','');
	return /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/.test(phoneNo);
}


