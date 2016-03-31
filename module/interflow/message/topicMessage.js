
function typeChange(){
	var val;
	$("input[name='dataType']").each(function(){
		if($(this).attr("checked")){
			val=$(this).val();
		}
	});
	if(val == 'now'){
		$("#sendTimeLi").hide();
	}else{
		$("#sendTimeLi").show();
	}
}

function signChange(obj){
	if($(obj).attr("checked")){//选中
		$("#signVal").attr("readonly",false);
	}else{
		$("#signVal").attr("readonly",true);
	}
	lenEvent();
}

function submitTheForm(){
	if(checkForm()){
		submitForm();
	}
}

function lenEvent(){
	var content=$("#content").val();
	if($("#addSign").attr("checked")){//选中 附加签名
		content=content+$("#signVal").val()+$("#companySign").text();
	}
	var theLen=parseInt(content.length,10);
//	if(theLen>70){
//		$("#content").val(content.substr(0,70));
//	}else{
		var len=70-theLen;
		$("#chartLen").html(len);
//	}
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
					alert(res.MSG);
					setTimeout(function(){parent.closeMessageDialog();},1000);
					
				}else{
					parent.closeMessageDialog();
				}
			}else{
				alert(res.MSG);
			}
	    },'json');
}

checkForm = function(){
	var chartLen=$("#chartLen").text();
	 if(parseInt(chartLen,10) < 0){
		 alert("短信内容不能超过70字符!",1.5);
		 return false;
	 }
//	 var content = $("textarea[name='content']").val();
	 if(parseInt(chartLen,10) == 70){
		 alert("发送内容不能为空！");
		 return false;
	 }
	 var sendTime=$("#sendTime").val();//发送时间  (选择 定时发送 时为必选项)
     var val;
 	$("input[name='dataType']").each(function(){
 		if($(this).attr("checked")){
 			val=$(this).val();
 		}
 	});
 	if(val == 'time'){//选择 定时短信
 		if(!isNotNull(sendTime)){
			 alert("请选择发送时间!");
			 return false;
		 }
 	}
	 
	 return true;
}

successMsg = function(){
	 alert("发送成功!");
	 parent.closeMessageDialog();
}
faildMsg = function(){
	 alert("发送失败");
}