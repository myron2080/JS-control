function beforesave(){
	var setType=$('#setType option:selected').val();
	if(setType!='SHAR'){
		if($("#onlyUserId").val() == null || $("#onlyUserId").val()==''){
			art.dialog.tips("选择专用时,专用人不能为空");
			return false 
		}
	}
	
	if($("#showPhone").val() == null || $("#showPhone").val()==''){
		art.dialog.tips("电话号码不能为空");
		return false
	}
	
	return true
}

function saveEdit(dlg){
	currentDialog = dlg;
	var var1 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/ ;
	var var2 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{3}$/ ;
	
	var mobileEq = /^1[3|5|8]\d{9}$/ , phoneEq = /^0\d{2,3}-?\d{7,8}$/;
	var phone=$("input[name='showPhone']").val();
	var id=$("input[name='id']").val();
	var mac=$("input[name='mac']").val();
	//如果是修改已分配的号码.只要检验mac地址是否重复,
	if(id){
		if(!(mobileEq.test(phone) || phoneEq.test(phone))){
			art.dialog.tips("请填写正确的电话号码");
			return false;
		}
		$('#dataForm').attr('action',getPath()+"/cmct/phonemember/updateMatch");
		$.post(getPath()+"/cmct/phoneUnmatch/checkMac",{phone:phone,mac:mac},function(res){
			if(res.STATE!='SUCCESS'){
				$("input[name='mac']").parent().addClass("l-text-invalid");
				$("input[name='mac']").attr("title", res.MSG);
				$("input[name='mac']").poshytip();
				art.dialog.alert('该绑定地址已经绑定 '+res.MSG);
	        }else {
	        	if(beforesave()){
	        		$('form').submit();
	        	}
	        }
		},"json");
	}else{
		$('#dataForm').attr('action',getPath()+"/cmct/phonemember/batchMatchPhone");
		if(!(mobileEq.test(phone) || phoneEq.test(phone))){
			$.post(getPath()+"/cmct/phoneUnmatch/checkPhone",{phone:phone},function(res){
				if(res.STATE!='SUCCESS'){
					$("input[name='showPhone']").parent().addClass("l-text-invalid");
					$("input[name='showPhone']").attr("title", res.MSG);
					$("input[name='showPhone']").poshytip();
					art.dialog.tips(res.MSG);
					
		        }else {
		        	$('#pmJson').val("["+JSON.stringify(res.pmJson)+"]");
		        	if(beforesave()){
		        		$.post(getPath()+"/cmct/phoneUnmatch/checkMac",{phone:phone,mac:mac},function(res){
		        			if(res.STATE!='SUCCESS'){
		        				$("input[name='mac']").parent().addClass("l-text-invalid");
		        				$("input[name='mac']").attr("title", res.MSG);
		        				$("input[name='mac']").poshytip();
		        				art.dialog.alert('该绑定地址已经绑定 '+res.MSG);
		        	        }else {
		        	        	$('form').submit();
		        	        }
		        		},"json");
		        		
		        	}
		        }
			},"json");
		}else{
			art.dialog.tips("用户号码格式错误");
		}
	}
	return false
}

function changeSetType(){
	var setType=$('#setType option:selected').val();
	if(setType=='SHAR'){
		$("#changeCols").attr('colspan',"3");
		$('#matchOne td :eq(2)').hide();
		$('#matchOne td :eq(3)').hide();
	}else{
		$("#changeCols").attr('colspan',"1");
		$('#matchOne td :eq(2)').show();
		$('#matchOne td :eq(3)').show();
	}
}

//手机号码匹配格式
function checkMobile(phoneNo){
	if (phoneNo)
		phoneNo = phoneNo.replace('\\s', '');
	return /^([+])?([0][8][6]|[8][6]|[0][0][8][6])?([-])?(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/
			.test(phoneNo);
}
//座机，固话匹配格式,格式必须为：0755-36510001
function checkPhone(phoneNo){
	if (phoneNo){
		phoneNo = phoneNo.replace('\\s','');
	}
	var var1 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/ ;
	var var2 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{3}$/ ;
	return var1.test(phoneNo) || var2.test(phoneNo);
}

function changeOrgNumber(oldObj,newObj,doc){
	if(newObj){
		orgLongNumber=newObj.longNumber;
		$('#defaultShowPhone').val('');
		$('#defaultShowPhoneId').val('');
	}
}

function setOrgNumber(){
	return {orgLongNumber:!orgLongNumber?"-1":orgLongNumber};
}
