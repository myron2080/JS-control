var seqnum = 1;
function saveEdit(){
	
	var flag = true;
	var bankdata = "[";
	var banklist = $("#bankcardiv").find('table[key="banktable"]');
	$.ajaxSetup({
		 async : false
	});
	if($('#recommenderName').val() != ''){
		var a=0;    
		//判断手机号码是够已经注册
		$.post( getPath() + "/p2p/user/isregister",{name:$('#recommenderName').val()},function(data){
			if(data.isr==1){
				a=1;
			}
		},"json");
		if(a==0){
			$.post(getPath() + "/p2p/user/isregister",{userName:$('#recommenderName').val()},function(data){
				if(data.isr==1){
					a=1;
				}
			},"json");
			if(a == 0){
				art.dialog.tips("推荐人错误，此人在本系统中未注册.");	
				flag = false;
			}
		}
	}
	
	$.each(banklist,function(i,item){
		var dataStr = "";
		if(i>0){
			dataStr+=",";
		}
		var branchId = $(item).find("select[key='branchbank']").val();
		var cardNo = $(item).find("input[key='cardNo']").val();
		if(!branchId){
			art.dialog.tips("请选择银行");	
			$(item).find("select[key='branchbank']").focus();
			flag = false;
			return;
		}
		if(!cardNo){
			art.dialog.tips("请输入银行卡号");	
			$(item).find("input[key='cardNo']").focus();
			flag = false;
			return;
		}
		dataStr += "{"; 
		dataStr += "'id':'"+$(item).find("input[key='bankcardId']").val()+"',";
		dataStr += "'branchId':'"+branchId.trim()+"',";
		dataStr += "'cardNo':'"+cardNo.trim()+"'";
		dataStr += "}";
		bankdata+=dataStr;
	});
	
	bankdata += "]";
	if(flag){
		$('#bankcardjson').val(bankdata);
		$("form").submit();
	}
	return false;
}
function saveAdd(){
	saveEdit();
}

function addBankCard(){
	var html = '<div id="bankdiv'+seqnum+'" style="float:left;width:100%;"><table class="common_table" key="banktable">'+
		' <input type="hidden" key="bankcardId" />'+
		'<tr><td>开户银行：</td>'+
	'<td>'+							
		'<div class="f7" seq="'+seqnum+'" id="bankqueryf7'+seqnum+'" nameField="bankName"  onchange="getBranch" '+
						'dataPickerUrl="'+getPath()+'/framework/dataPicker/list?query=bankQuery"'+
						'width="500px" height="300px" title="银行">'+
						'<input dataPicker="value" name="bankid" label="人员" type="hidden"  readOnly="readOnly" />'+
						'<input dataPicker="name" ondblclick="openDataPicker(\'bankqueryf7'+seqnum+'\')" name="bankname" readOnly="readOnly" type="text" />'+
						'<strong onclick="clearDataPicker(\'bankqueryf7'+seqnum+'\')"></strong> '+
						'<span class="p_hov" onclick="openDataPicker(\'bankqueryf7'+seqnum+'\')"></span>'+
	  '</div></td><td>开户支行：</td><td>'+
		'<select id="branchbank'+seqnum+'" key="branchbank" disabled="disabled">'+
			
		'</select></td><td>账号：</td><td><input name="cardNo" key="cardNo" type="text" /></td><td>'+
		'<span class="graybtn btn"><a href="javascript:void(0)" onclick="removebankdiv('+seqnum+')" key="delbtn">删除</a></span>'+
	'</td></tr></table></div>';
	$("#bankcardiv").append(html);
	seqnum++;
}

function removebankdiv(seq){
	$("#bankdiv"+seq).remove();
}

function deletePosition(index){
	
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

function initbank(obj){		
	var curnum = $('#'+obj).attr("seq");
	$('#'+obj).autocomplete({
		serviceUrl:getPath()+'/p2p/bank/banklist',
		type:'POST',
		dataType:'json',
		width:'250px',
		maxHeight:160,
		paramName:'key',
		labelKey:'name',
		valueKey:'id',
		valueFieldId:'bankidinput'+curnum,
		onSelect:function(){
			alert($("#bankidinput"+curnum).val());
		},
		onChange:function(){
			$("#bankidinput"+curnum).val();
		}
	});
	
}

function initbranchbank(obj){		
	var curnum = $('#'+obj).attr("seq");
	$('#'+obj).autocomplete({
		serviceUrl:getPath()+'/p2p/branchbank/branchbanklist',
		type:'POST',
		dataType:'json',
		width:'250px',
		maxHeight:160,
		paramName:'key',
		params:{bankId:$("#bankidinput"+curnum).val()},
		labelKey:'name',
		valueKey:'id',
		valueFieldId:'branchbankidinput'+curnum,
		onSelect:function(){
			alert($("#branchbanknameinput"+curnum).val());
		},
		onChange:function(){
			
		}
	});
	
}

function checkExistIdCard(obj){
	var exid = $("#dataId").val();
	var idcard = $(obj).val();
	if(idcard){
		$.post(getPath()+"/p2p/user/checkIdCard",{idcardno:idcard,exid:exid},function(data){
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

function checkExistMobileNo(obj){
	var exid = $("#dataId").val();
	var mobileno = $(obj).val();
	if(mobileno){
		$.post(getPath()+"/p2p/user/checkIdCard",{mobileno:mobileno,exid:exid},function(data){
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
		$.post(getPath()+"/p2p/user/checkIdCard",{userName:userName,exid:exid},function(data){
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
function getBranch(o,n,obj){
	var seq = $(obj).attr("seq");
	var brobj = $("#branchbank"+seq);
	$(brobj).removeAttr("disabled");
	if(n){
		
		$(brobj).html('');
		$.post(base +"/trade/bank/selectBranchList",{bankId:n.id},function(data){
			var html = '';
			data = data.items;
			$.each(data,function(i,item){
				html += '<option value="'+item.id+'">'+item.name+'</option>';
			});
			$(brobj).html(html);
		},"json");
	}else{
		$(brobj).html('');
	}
}
