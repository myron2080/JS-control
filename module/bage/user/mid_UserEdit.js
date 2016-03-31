var phoneFlag =  true;
var idCardFlag = true;
function saveEdit(){
	if(checkForm()){
		$("form").submit();
	}
	return false;
}
function checkForm(){
	checkExistPhone($("#phone"));
	checkExistIdCard($("#idCard"))
	if(!phoneFlag){
		return false;
		}
	if(isNotNull($("#name").val())&&isNotNull($("#nickName").val())&&isNotNull($("#phone").val()))
	if($("#isAlone").attr("checked")!="checked"&&($("#companyId").val()==null||$("#companyId").val()=="")){
			//art.dialog.tips("请选择公司");
		    var obj = $("#companyName");
			$(obj).parent().addClass("l-text-invalid");
			$(obj).attr("title", "必填字段");
			$(obj).poshytip();
			return false;
	}
	var idCard =  $("#idCard").val();
	if(!idCardFlag){
		return false;
		}
	return true;
	
}
function saveAdd(){
	saveEdit();
}

$(document).ready(function(){
	
	$.validator.addMethod('idCard',function(value,element){
		return IdCardValidate.validate(value);
	},'身份证号码格式不正确');
	$.validator.addMethod("isPhone", function(value,element) { 
		var length = value.length; 
		var mobile = /^(\d{11})$/; 
		//var tel = /(^(0\d{2})-(\d{8})$)|(^(0\d{3})-(\d{7})$)|(^(0\d{2})-(\d{8})-(\d+)$)|(^(0\d{3})-(\d{7})-(\d+)$)/;//固定电话
		//var tel = /^\d{3,4}-?\d{7,9}$/; 
		return this.optional(element) || (mobile.test(value)); 
		}, "请正确填写手机号码");
	$.validator.addMethod("bankCard", function(value,element) { 
		var length = value.length; 
		var bankCard = /^\d{19}$/g; 
		return this.optional(element) || (bankCard.test(value)); 
		}, "请正确填写银行卡号");
	checkCompanyTag($("#isAlone"));
	$("#isAlone").click(function(){
		checkCompanyTag($(this));
	});
	
/*	//编辑状态下，禁用选择推荐人的操作；
	if(viewstate=='EDIT'){
		//F7
		$('div[class="f7"]').each(function(){
			$(this).attr('disabled','disabled');
			$(this).find('span').each(function(){
				$(this).removeAttr('onclick');
			});
			$(this).find('strong').each(function(){
				$(this).removeAttr('onclick');
			});
		});
	}*/
	
});

function checkCompanyTag(obj){
	if($(obj).attr("checked")=="checked"){
		$("#companyTag").hide();
		}else{
		$("#companyTag").show();
		}
}

function checkExistIdCard(obj){
	var param = {};
	var idCard =  $(obj).val();
	param.id = $("#dataId").val();
	param.idCard = idCard;
	if(idCard){
		$.ajaxSetup({
			  async: false
			  });
		$.post(getPath()+"/bage/user/judgeIdCard",param,function(res){
			if(res.STATE=='SUCCESS'){
				idCardFlag = true;
			
					var v = idCard;
					if(IdCardValidate.validate(v)){
						var sex = IdCardValidate.getSexByIdCard(v);
						$('#'+sex).attr('checked','checked');
						/*var bday = IdCardValidate.getBirthdayByIdCard(v);
						$('#birthday').val(bday);*/
					}
				
			}else{
				idCardFlag = false;
				$(obj).parent().addClass("l-text-invalid");
				$(obj).attr("title", res.MSG);
				$(obj).poshytip();
			}
		},'json');
		$.ajaxSetup({
			  async: true
			  });
	}
}

function checkExistPhone(obj){
	var param = {};
	var phone = $(obj).val();
	param.id =  $("#dataId").val();
	param.phone = phone;
	if(phone){
		$.ajaxSetup({
			  async: false
			  });
		$.post(getPath()+"/bage/user/judgePhone",param,function(res){
			if(res.STATE=='SUCCESS'){
				phoneFlag =  true;
			}else{
					phoneFlag =  false;
					$(obj).parent().addClass("l-text-invalid");
					$(obj).attr("title", res.MSG);
					$(obj).poshytip();
					//art.dialog.tips("该电话号码已经存在");
				}
		},'json');
		$.ajaxSetup({
			  async: true
			  });
	}
}
function setRef(oldvalue,newvalue,doc){
	if(newvalue){
	if(newvalue.name){
	}else{
	$("#refereeName").val(newvalue.phone);
	}
	}
	}
function afterSelect(oldvalue,newvalue,doc){
   $("#companyName").parent().removeClass('l-text-invalid');
   $("#companyName").parent().removeAttr("title");
}