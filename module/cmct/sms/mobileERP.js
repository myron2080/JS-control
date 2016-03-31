


function validatePhone(obj){
	var value = $(obj).val();
	var mobile = /^\d{11}$/; 
	if(mobile.test(value)){
		return true;
	}else{
		return false;
	}
}

/**
 * 短信发送
 */
function sendMessage(){
	$("#submitBtn").attr("disabled",true);
	if(validatePhone($("#phone"))){
		submitForm();
	}else{
		alert("请输入正确的手机号码");
		$("#submitBtn").attr("disabled",false);
	}
}

/**
 ***************************
 ** 提交验证处理
 ***************************
 */
function submitForm(){
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					alert("下载地址已发送到您的手机,请及时查收信息!");
					setTimeout(function(){
						parent.closeMobileERPPage();
					},1000);
					
				}else{
						parent.closeMobileERPPage();
				}
			}else{
				alert(res.MSG);
				$("#submitBtn").attr("disabled",false);
			}
	    },'json');
}