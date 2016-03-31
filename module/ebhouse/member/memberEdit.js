$(document).ready(function(){
	getCity($("#province"));
	innitBankCardJson();
	getCity($("#bankProvince_"));
/*	$("#phone").bind("blur",function(){
		judgePhone(param);
	});*/
	//名字输入完之后自动带出简写
	$("#name").bind('change',function(){
		var name =$(this).val();
		$('#name').val(name);
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
			$('#fullPinyin').val(result.full);
		});
	});
	
	jQuery.validator.addMethod("isIdCardNo", function (value, element) {
        return this.optional(element) || isIdCardNo(value);
    }, "请正确输入您的身份证号码");
	if($("#cardType").val()=='IDCARD'){
		$("#cardNumber").attr("validate","{isIdCardNo:true}");
	}else{
		$("#cardNumber").attr("validate","{maxlength:30}");
	}
	$("#cardType").bind("change",function(){
		if($("#cardType").val()=='IDCARD'){
//			$("#cardNumber").attr("validate","{isIdCardNo:true}");
			$("#cardNumber").closest("li").html('<div class="l-text" style="width: 128px;"><input type="text" id="cardNumber" value="'+$("#cardNumber").val()+'"  validate="{isIdCardNo:true}" name="cardNumber" class="l-text-field" style="width: 124px;" ligeruiid="cardNumber" /></div>');
		}else{
//			$("#cardNumber").attr("validate","{maxlength:30}");
			$("#cardNumber").closest("li").html('<div class="l-text" style="width: 128px;"><input type="text" id="cardNumber" value="'+$("#cardNumber").val()+'" validate="{maxlength:30}" name="cardNumber" class="l-text-field" style="width: 124px;" ligeruiid="cardNumber" /></div>');
		}
	});

	jQuery.validator.addMethod("isPhone", function(value,element) { 
		var length = value.length; 
		var mobile = /^[1][3-8]\d{9}$/; 
		//var tel = /^\d{3,4}-?\d{7,9}$/; 
		return this.optional(element) || mobile.test(value); 
		}, "请正确填写手机号码"); 
	bindEvent();
	
	 
});
/**
 * 身份证号码验证
 *
 */
function isIdCardNo(num) {

 var factorArr = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
 var parityBit=new Array("1","0","X","9","8","7","6","5","4","3","2");
 var varArray = new Array();
 var intValue;
 var lngProduct = 0;
 var intCheckDigit;
 var intStrLen = num.length;
 var idNumber = num;
   // initialize
     if ((intStrLen != 15) && (intStrLen != 18)) {
         return false;
     }
     // check and set value
     for(i=0;i<intStrLen;i++) {
         varArray[i] = idNumber.charAt(i);
         if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
             return false;
         } else if (i < 17) {
             varArray[i] = varArray[i] * factorArr[i];
         }
     }
     
     if (intStrLen == 18) {
         //check date
         var date8 = idNumber.substring(6,14);
         if (isDate8(date8) == false) {
            return false;
         }
         // calculate the sum of the products
         for(i=0;i<17;i++) {
             lngProduct = lngProduct + varArray[i];
         }
         // calculate the check digit
         intCheckDigit = parityBit[lngProduct % 11];
         // check last digit
         if (varArray[17] != intCheckDigit) {
             return false;
         }
     }
     else{        //length is 15
         //check date
         var date6 = idNumber.substring(6,12);
         if (isDate6(date6) == false) {

             return false;
         }
     }
     return true;
     
 }
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}

function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}

function bindEvent(){
	$("input[name='account']").bind('keyup',function(){
		var number = $(this).val();
		number = number.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
		$(this).val(number);
	});
}
function cardNumFormat(){
	$("#bankCardDiv ul").each(function(){
		var accountObj = $(this).find("input[name='account']");
		accountObj.keyup();
		var account = accountObj.val();
		if(account!=null&&account!=''){
			//account.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
			//account.replace(/(\d{4})/g,'$1 ').replace(/\s*$/,'');
			account = account.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
			accountObj.val(account);
			}
	});
}
/**
 * 新增联系人
 */
function addBankCard(){
	var html='';
	var param=parseInt($("#param").val(),10)+1;
	$("#param").val(param);
	html+='<ul key="bankCardField">'
	html+='<p><li class="w70">银行:</li>'
	html+='<li class="w220">'
	html+='<select  name="bankId" id="bankId_'+param+'" style="width:180px;">'
	html+=' </select>'
	html+='</li>'
	
	
	
	html+='<li class="w70" style=" letter-spacing:-1px;">开户行所在地:</li>'
	html+='<li class="w220">'
	html+='<select id="bankProvince_'+param+'" name="bankProvince" key ="bankCity_'+param+'"  onchange="getCity(this);"  style="width:60px;">'
	
	html+=' </select>'
	html+=' <select id="bankCity_'+param+'" name="bankCity" style="width:120px;">'
	html+=' </select>'
	html+='</li></p>'
	html+='<p class="pt10"><li class="w70"><span style="color:red">*</span>支行:</li>'
	html+='<li class="w220">'
	html+='<input  name="branchName" validate="{required:true,maxlength:30}" style="border:1px solid #ccc; height:24px; line-height:24px; width:178px;"  type="text" value=""/>'
	html+='</li>'
	html+='<li class="w70"><span style="color:red">*</span>银行卡号:</li>'
	html+='<li class="w220">'
	html+='<input  name="account" validate="{required:true,creditcard:true}" style="border:1px solid #ccc; height:24px; line-height:24px; width:183px;"  type="text" value=""/>'
	html+='</li></p>'
	
	
	
	
	html+='<li  style="width:60px;text-align:left;">'
	html+='<div class="tab_box_close" style="width:12px;"><a class="delete" href="javascript:void(0);" onclick="deleteRow(this);"></a></div>'
	html+='</li>'
	html+='</ul>'
	$("#bankCardDiv").append(html);
	setSelect("bankId_"+param,bankList)
	setSelect("bankProvince_"+param,provinceList)
	getCity($("#bankProvince_"+param));
	bindEvent();
}

/**
 * 删除
 * @param obj
 */
function deleteRow(obj){
	$(obj).parent().parent().parent().remove();
}
function innitBankCardJson(){
$("#bankCardDiv ul").each(function(){
		if($(this).attr("key") == 'bankCardField'){
		innitSelect($(this).find("select[name='bankId']"),bankList);
		innitSelect($(this).find("select[name='bankProvince']"),provinceList);
		innitCity($(this).find("select[name='bankProvince']"),$(this).find("select[name='bankCity']"));
		}
	});
}
function innitCity(pobj,cobj){
	var provinceId = $(pobj).val();
	var cName = $(cobj).find("option:selected").text();
	   $(cobj).empty();
	   $.post(base+"/ebhouse/city/getCity" ,{parentId:provinceId},function(data){
			if(data["cityData"].length>0){
				$.each(data["cityData"],function(i,ele){
					if(cName == ele.name){
						$(cobj).append("<option value='"+ele.id+"' selected='selected'>" + ele.name + "</option>");
					}else{
						$(cobj).append("<option value='"+ele.id+"'>"+ele.name+"</option>");
					}
				});
			}else{
			}
		},'json');
	}
var cardFlag = true;
var phoneFlag = true;
function setBanCardJson(){
	cardFlag = true;
	var bankCardJson="[";
	$("#bankCardDiv ul").each(function(){
		if($(this).attr("key") == 'bankCardField'){
		bankCardJson+="{'bankId':'"+$(this).find("select[name='bankId']").val()+"',";
		bankCardJson+="'provinceName':'"+$(this).find("select[name='bankProvince']").find("option:selected").text()+"',";
		bankCardJson+="'cityName':'"+$(this).find("select[name='bankCity']").find("option:selected").text()+"',";
		if(!checNull($(this).find("input[name='branchName']")))
		cardFlag = false;
		bankCardJson+="'branchName':'"+$(this).find("input[name='branchName']").val()+"',";
		if(!checNull($(this).find("input[name='account']")))
		cardFlag = false;
		var account = $(this).find("input[name='account']").val();
		//account = Trim(account);
		bankCardJson+="'account':'"+account;
		bankCardJson+="'},";
		}
	});
	if (bankCardJson.indexOf(",") != -1) {
		bankCardJson = bankCardJson.substring(0, bankCardJson.length - 1)+"]";
	}else{
		bankCardJson="";
	}
	$("#bankCardJson").val(bankCardJson);
	return cardFlag;
}
function Trim(str){   
    str=str.replace(/&nbsp;/g,"");
    str=str.replace(/\s+/g,"");//去除所有空格
   return str;}
	 
function checNull(obj){ 
	var val = $(obj).val(); 
	if(isNull(val)){ 
	msg="必选字段"; 
	$(obj).parent().addClass("l-text-invalid");
	$(obj).attr("title", msg);
	$(obj).poshytip();
	$(obj).attr("value","");
	return false; }
	else return true; }

function isNull(val){
		if(val==null||val=='')
			return true;
		    return false;
		}
function getCity(obj){
   var provinceId = $(obj).val();
   var cityId = $("#"+$(obj).attr("key2")).val();
   var selectCityId = $(obj).attr("key");
   $("#"+selectCityId).empty();
   $.post(base+"/ebhouse/city/getCity" ,{parentId:provinceId},function(data){
		if(data["cityData"].length>0){
			$.each(data["cityData"],function(i,ele){
				if(cityId  == ele.id){
					$('#'+selectCityId).append("<option value='"+ele.id+"' selected='selected'>" + ele.name + "</option>");
				}else{
					$('#'+selectCityId).append("<option value='"+ele.id+"'>"+ele.name+"</option>");
				}
			});
		}else{
		}
	},'json');
}
function innitSelect(obj,data){
	var name = $(obj).find("option:selected").text()
	$(obj).empty();
	$.each(data,function(i,ele){
		if(name  == ele.name){
			$(obj).append("<option value='"+ele.id+"' selected='selected'>" + ele.name + "</option>");
		}else{
			$(obj).append("<option value='"+ele.id+"'>"+ele.name+"</option>");
		}
	});
}
function setSelect(selectId,data){
	$("#"+selectId).empty();
	$.each(data,function(i,ele){
			$('#'+selectId).append("<option value='"+ele.id+"'>"+ele.name+"</option>");
	});
}
function beforesave(dlg){
	/*if(!isNull($("input[name='phone']").val())){;
	judgePhone();}*/
	var flag=setBanCardJson();
	return flag;
}
function judgePhone(){
	var param ={};
	param.id=$("input[name='id']").val();
	param.phone =$("input[name='phone']").val();
	$.post(getPath()+"/ebhouse/member/judgePhone",param,function(res){
		if(res.MSG){
			$("input[name='phone']").parent().addClass("l-text-invalid");
			$("input[name='phone']").attr("title", res.MSG);
			$("input[name='phone']").poshytip();
			phoneFlag =false;
		}else{
			phoneFlag =true;
		}
	},"json");
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	//setBanCardJson();
	if(beforesave()&&phoneFlag){
		$('form').submit();
	}
}