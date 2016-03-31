
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

function clickOwner(obj){
	var val=$(obj).val();
	var phone=$("#acceptPhone").val();//接收人电话
	if($(obj).attr("checked")){//选中
		phone=val+","+phone;
	}else{
		phone=phone.replace(val+",","");
	}
	$("#acceptPhone").val(phone);
}

checkForm = function(){
	var chartLen=$("#chartLen").text();
	 if(parseInt(chartLen,10) < 0){
		 art.dialog.tips("短信内容不能超过70字符!",1.5);
		 return false;
	 }
	
	 var content = $("textarea[name='content']").val();
	 if(parseInt(chartLen,10) == 70){
		 art.dialog.tips("发送内容不能为空！",1.5);
		 return false;
	 }
	 var sendTime=$("#sendTime").val();//发送时间  (选择 定时发送 时为必选项)
     var val;
 	$("input[name='dataType']").each(function(){
 		if($(this).attr("checked")){
 			val=$(this).val();
 		}
 	});
 	if(!isNotNull($("#acceptPhone").val())){
		 art.dialog.tips("请选择接收人!",1.5);
		 return false;
	 }
 	if(val == 'time'){//选择 定时短信
 		if(!isNotNull(sendTime)){
 			art.dialog.tips("请选择发送时间!",1.5);
			 return false;
		 }
 	}
	 
	 return true;
}

/**
 * 发送操作
 * @param dlg
 */
function sendMessageForm(dlg){
	if(checkForm()){
		submitForm(dlg);
	}
}

/**
 ***************************
 ** 提交验证处理
 ***************************
 */
function submitForm(currentDialog){
	   if(currentDialog){
			currentDialog.button({name:"发送",disabled:true});
		}
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: res.MSG
					});
					setTimeout(function(){art.dialog.close();},1000);
				}else{
					art.dialog.close();
				}
				if(art.dialog.data("messageCallFun")){
					art.dialog.data("messageCallFun")();
				}
			}else{
				if(currentDialog){
					currentDialog.button({name:"发送",disabled:false});
				}
				art.dialog.alert(res.MSG);
			}
	    },'json');
}
