function saveEdit(dlg){
	
	currentDialog = dlg;
	var realName=$("#realName").val();
	if(realName==""){
		art.dialog.tips('姓名不能为空。');
		return ;
	}
	var mobilePhone=$("#mobilePhone").val();
	if(mobilePhone==""){
		art.dialog.tips('手机号码不能为空。');
		return ;
	}
	var birthday=$("#birthday").val();
	if(!birthday){
		art.dialog.tips('出生日期不能为空。');
		return ;
	}
	var userName=$("#userName").val();
	if(userName==""){
		art.dialog.tips('账号不能为空。');
		return ;
	}
	var email = $("#email").val();
	var pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if(!email.match(pattern) && email != ""){
		art.dialog.tips("邮箱格式不正确");
		return;
	}
	
	var idcardVal = $("#idcardno").val();
	
	var now = new Date();
	if(birthday != null){
		if(parseDate(birthday)>now){
			art.dialog.tips('出生日期不能大于当前日期！');
			return;
		}
	}
	
	$("#dataForm").submit();
}

$(document).ready(function(){
	
	$.validator.addMethod('idCard',function(value,element){
		return IdCardValidate.validate(value);
	},'身份证号码格式不正确');
	$.validator.addMethod("isPhone", function(value,element) { 
		var length = value.length; 
		var mobile = /^(\d{11})$/; 
		var tel = /^\d{3,4}-?\d{7,9}$/; 
		return this.optional(element) || (tel.test(value) || mobile.test(value)); 
		}, "请正确填写手机号码"); 
	
});


function checkExistIdCardNo(obj){
	var id= $("#dataId").val();
	var idcard = $(obj).val();
	if(idcard){
		$.post(getPath()+"/ebsite/memberEdit/checkIdCard",{idcardno:idcard,memberId:id},function(data){
	       if(data.STATE=='SUCCESS'){
	    	   var count = data.COUNT;
	    	   if(count>0) {
	    		   art.dialog.tips("已存在该身份证号的客户");
	    		   $(obj).val('');
	    	   }else{
	    		   var v = idcard;
	    		   if(IdCardValidate.validate(v)){
	    			   var sex = IdCardValidate.getSexByIdCard(v);				
	    			   $('#'+sex).attr('checked','checked');
	    			   var bday = IdCardValidate.getBirthdayByIdCard(v);
	    			   $('#birthday').val(bday);
	    		   }
	    	   }
	       }
		},'json');
	}
}

function checkExistMobilePhone(obj){
	var exid = $("#dataId").val();
	var mobileno = $(obj).val();
	if(mobileno){
		$.post(getPath()+"/ebsite/memberEdit/checkIdCard",{mobilePhone:mobileno,exid:exid},function(data){
			if(data.STATE=='SUCCESS'){
				var count = data.COUNT;
				if(count>0) {
					art.dialog.tips("已存在该手机号的客户");
					 $(obj).val('');
				}else{
					if(!$("#userName").val())
						$("#userName").val(mobileno);
				}
			}
		},'json');
	}
}

function checkExistUserName(obj){
	var exid = $("#dataId").val();
	var userName = $(obj).val();
	if(userName){
		$.post(getPath()+"/ebsite/memberEdit/checkIdCard",{userName:userName,exid:exid},function(data){
			if(data.STATE=='SUCCESS'){
				var count = data.COUNT;
				if(count>0) {
					art.dialog.tips("已存在该账号的客户");
					 $(obj).val('');
				}
			}
		},'json');
	}
}
