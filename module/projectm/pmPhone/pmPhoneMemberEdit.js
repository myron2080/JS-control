$(document).ready(function(){
	changeTdName();
});

var hwFlag=false;//标志是否已经点击过验证码
function changeTdName(){
	if(!$('#dataId').val()){
		hideOrgId();
	}
	
	var state=$("#partnersSelect option:selected").val();	
	if(state!='HW'){
		if(state=='CAAS'){
			$("select[name='operator'] option :eq(1)").attr('selected','selected');
			$('[indexTTEN]').hide();
			$('[indexHW]').show();
			$('form').attr('action',getPath()+"/projectm/pmPhoneCaas/save");
			changePhoneWay();
		}else{
			$("select[name='operator'] option :eq(0)").attr('selected','selected');
			$('form').attr('action',getPath()+"/projectm/pmPhonemember/save");
			$('[indexTTEN]').show();
			$('[indexHW]').hide();
		}
	}else{
		$('form').attr('action',getPath()+"/projectm/pmPhoneFjctmember/save");
		$("select[name='operator'] option :eq(1)").attr('selected','selected');
		$('[indexTTEN]').hide();
		$('[indexHW]').show();
		 changePhoneWay();
	}
	
	/*if(state!='HW'){
		$("select[name='operator'] option :eq(0)").attr('selected','selected');
		if(state=='ZX'){
			$('form').attr('action',getPath()+"/projectm/ucsPhoneMember/save");
			$('#regPhone_td').text('注册编号：');
			$('#changeInputValue td:eq(0)').text('登陆密码：');
			$('#numberF7').hide();
			$('#celarF7').hide();
		}else if(state=='TTEN'){
			$('form').attr('action',getPath()+"/projectm/pmPhonemember/save");
			$('#regPhone_td').html('<span style="color:red">*</span>注册号码：');
			$('#changeInputValue td:eq(0)').text('接听话机：');
			$('#numberF7').show();
			$('#celarF7').show();
		}
		$('#dxCost').remove();
		$('#idCode').remove();
		$('#idCodeNumber').remove();
		$("[id^='isCostNumber_']").remove();
		$('#regNumber').attr('name','regNumber');
		$('#colspan').attr('colspan',3);
		$("[id^='phoneWay']").hide();
	}else{
		$("select[name='operator'] option :eq(1)").attr('selected','selected');
		$('form').attr('action',getPath()+"/projectm/pmPhoneFjctmember/save");
		$('#numberF7').hide();
		$('#celarF7').hide();
		$('#regPhone_td').html('<span style="color:red">*</span>验证码：');
		$('#changeInputValue td:eq(0)').text('别名：');
		$('#colspan').attr('colspan',1);
		$('#regNumber').attr('name','sTCode');
		var td="";
		td+="<td id='idCode' style='text-align: left;'><span style='color:red'>*</span><input class='graybtn' type='button' onclick='getIdCode(this)' value='获取验证码'/><span id='time'></span></td>";
		
		td+="<td id='idCodeNumber' style='text-align: left;'>获取验证码号码：<input name='regNumber' /></td>"
			
		var f7Td="";
		f7Td+="<td id='isCostNumber_td1' style='text-align: right;display: none;'>计费号码：</td>";
		f7Td+="<td id='isCostNumber_td2' style='display: none;'><div title='计费号码' height='500px' width='350px' datapickerurl='"+getPath()+"/framework/dataPicker/list?query=getFjctCostNumber' id='isCostNumberF7' style='float: left' class='f7'>";
		f7Td+="<input datapicker='name' readonly='readOnly' class='length-medium'  id='costNumber' name='costNumber' /> ";
		f7Td+="<strong onclick=getCostNumberF7('clear','isCostNumberF7') style='display: block;'></strong><span onclick=getCostNumberF7('open','isCostNumberF7') class='p_hov'></span>";
		f7Td+="</div></td>";	
		//$('#main tr :eq(0)').append(td);
		//$('#main tr :eq(0)').append(f7Td);
		$("[id^='phoneWay']").show();
		
		var tr="";
		tr="<tr id='dxCost'><td style='text-align: right;'>是否为计费号码:</td><td><input name='isCostNumber' type='checkbox' /></td>";
		tr+="<td  style='text-align: right;'>扣费号码：</td>";
		tr+="<td><div title='扣费号码' height='500px' width='850px' datapickerurl='"+getPath()+"'/projectm/pmPhonenumber/numberList' id='costNumberF7' style='float: left' class='f7'>";
		tr+="<input datapicker='value' class='length-medium' id='costNumber'  name=''costNumber'' /> ";
		tr+="<strong onclick='clickNumberList('clear','costNumberF7')' style='display: block;'></strong><span onclick='clickNumberList('open','costNumberF7')' class='p_hov'></span>";
		tr+="</div></td> </tr>";
		
		$('#main tr').last().after(tr);
	}*/	
}

function hideOrgId(){
	$('#phoneWay').val('CallAsso');
	$('#configOrgId option').each(function(i,obj){
		if($(obj).attr("par")!=$("#partnersSelect option:selected").val()){
			$(obj).hide();
		}else{
			$(obj).attr("selected","selected");
			$(obj).show();
		}
		
	});
}

function clickNumberList(type,f7Id){
	var configOrgId = $("#configOrgId :selected").attr("orgInterfaceId");
	if(configOrgId == ''){
		art.dialog.tips("请先选择核算渠道");
		return false ;
	}
	if(type == 'open'){
		var tagUrl = getPath()+"/projectm/pmPhonenumber/numberList";
		tagUrl += "?orgId="+configOrgId ;
		$("#f7GetNumberList").attr("datapickerurl",tagUrl);
		openDataPicker(f7Id);
	}else if(type == 'clear'){
		clearDataPicker(f7Id);
	}
}

function getCostNumberF7(type,f7Id){
	var configOrgId = $("#configOrgId :selected").attr("orgInterfaceId");
	if(!configOrgId){
		art.dialog.tips("请先选择核算渠道");
		return false ;
	}
	if(type == 'open'){
		var tagUrl = getPath()+"/framework/dataPicker/list?query=getFjctCostNumber&configId="+$("#configOrgId :selected").val()+"&isCostNumber=YES";
		$("#isCostNumberF7").attr("datapickerurl",tagUrl);
		openDataPicker(f7Id);
	}else if(type == 'clear'){
		clearDataPicker(f7Id);
	}
}

function changeNumberF7(){
	$("#showNumber").val("");
	var par=$("#configOrgId option:selected").attr("par");
	var phoneWay=$('#phoneWay option:selected').val();
	if(par=='HW' && phoneWay=='CallAsso' && !$('#dataId').val()){
		loadCostNumber();
	}
}

function getIdCode(obj){	
	var showNumber=$("input[name='showNumber']").val();
	if(!showNumber){
		art.dialog.tips("请填写开通号码!");
		return false;
	}
	
	var configOrgId = $("#configOrgId :selected").attr("orgInterfaceId");
	if(configOrgId == ''){
		art.dialog.tips("请先选择核算渠道");
		return false ;
	}
	
	var httpUrl = $("#configOrgId :selected").attr("httpUrl");
	var spid = $("#configOrgId :selected").attr("spid");
	var passWd = $("#configOrgId :selected").attr("passWd");
	
	var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;

	if(!(mobile.test(showNumber) || phone.test(showNumber))){
		art.dialog.tips("请填写正确的号码!");
		return false;
	}
	
	$.post(getPath()+'/projectm/pmPhoneFjctmember/getIdCode',{number:showNumber,orgInterfaceId:configOrgId,httpUrl:httpUrl,spid:spid,passWd:passWd},function(res){
		if(res.STATE=='SUCCESS'){
			hwFlag=true;
			$('#cardSessionId').val(res.Sessionid);
			setTimeBar(obj);
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
	
}

function beforesave(dlg){	
	var tel=$('#showNumber').val();
	var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;

	if(!(mobile.test(tel) || phone.test(tel))){
		art.dialog.tips("请填写正确的号码!");
		return false;
	}
	
	return true;
}
//保存编辑数据
function saveEdit(dlg){
	var state=$("#partnersSelect option:selected").val();
	if(state=='TTEN'){
		var orgInterfaceId=$('#configOrgId option:selected').val();
		if(!orgInterfaceId){
			art.dialog.tips("请选择核算渠道!");
			return false;
		}
		
	}else if(state=='HW'){
		if($('#phoneWay option:selected').val()=='AutoBill' || $('#phoneWay option:selected').val()=='DisplayNbr'){
			if(!$("input[name='sTCode']").val()){
				art.dialog.tips("验证码不能为空!");
				return false;
			}
			if(!hwFlag){
				art.dialog.tips("你还未点击验证码!");
				return false;
			}
			$('#isCostNumber').val('YES')
		}else{
			if(!$("input[name='costNumber']").val()){
				art.dialog.tips("选了主叫关联或则副号绑定,关联的计费号码不能为空");
				return false;
			}
			/*if($('#phoneWay option:selected').val()=='BindBill' && !$("input[name='displayKey']").val()){
				art.dialog.tips("key不能为空!");
				return false;
			}*/
			$('#isCostNumber').val('NO')
		}
	}else if(state=='CAAS'){
		if($('#phoneWay option:selected').val()=='AutoBill'){
			$('#isCostNumber').val('YES')
		}else{
			if(!$("input[name='costNumber']").val()){
				art.dialog.tips("选了主叫关联或则副号绑定,关联的计费号码不能为空");
				return false;
			}
			$('#isCostNumber').val('NO')
		}
	}else{
		
	}
	$('#orgInterfaceId').val($('#configOrgId option:selected').attr('orgInterfaceId'));//给登录orgId赋值
	$('#httpUrl').val($("#configOrgId option:selected").attr("httpUrl"));//给httpUrl赋值
	$('#spid').val($("#configOrgId option:selected").attr("spid"));//给spid赋值
	$('#passWd').val($("#configOrgId option:selected").attr("passWd"));//给passWd赋值
	$('#alias').val($('#showNumber').val());//别名为当前号码
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		var checkShowNumberUrl=getPath()+"/projectm/pmPhonemember/checkShowNumber?showNumber="+$('#showNumber').val()+"&id="+$('#dataId').val();//保存时检验该号码是否被注册过
		$.post(checkShowNumberUrl,{},function(res){
			if(res.STATE=='SUCCESS'){
				$('form').submit();
			}else{
				 art.dialog.confirm(res.MSG,function(){
					 $('form').submit();
				 });
			}
		},'json');
		
	}
}

function getAnswerPhone(obj){
	$('#answerPhone').val($(obj).val());
	$("input[name='regNumber']").val($(obj).val());
}

/**
 * 保存选择电话号码
 * @param oldVal
 * @param newVal
 */
function saveSelect(oldVal,newVal){
	//phoneNo,currentPackName
	$("#showNumber").val(newVal.phoneNo);
	$('#answerPhone').val(newVal.phoneNo);
	$("input[name='regNumber']").val(newVal.phoneNo);
}

function changePhoneWay(){
	var phoneWay=$('#phoneWay option:selected').val();
	var partners=$('#partnersSelect option:selected').val();
	if(phoneWay=='AutoBill' || phoneWay=='DisplayNbr'){//自助计费.或则主显号码
		if(partners=="CAAS"){
			$('[regist]').hide();
			$('[regist]').prev().show();
			$('[flagCaas]').hide();
			$('[indexHW]').eq(6).show();
			$('[indexHW]').eq(4).hide();
			$('[indexHW]').eq(5).hide();
			$('[indexHW]').eq(7).show();
		}else{
			$('[regist]').show();
			$('[regist]').prev().hide();
			$('[flagCaas]').show();
			$('[indexHW]').eq(4).show();
			$('[indexHW]').eq(5).show();
			$('[indexHW]').eq(6).hide();
			$('[indexHW]').eq(7).hide();
		}
	}else{		
		$('[regist]').hide();
		$('[regist]').prev().show();
		$('[flagCaas]').show();
		if(phoneWay=='CallAsso'){//主叫关联		
			if(!$('#dataId').val()){
				loadCostNumber();
			}
			$('[indexHW]').eq(4).hide();
			$('[indexHW]').eq(5).hide();
			$('[indexHW]').eq(6).hide();
			$('[indexHW]').eq(7).hide();			
		}else{//副号绑定
			$('[indexHW]').eq(4).hide();
			$('[indexHW]').eq(5).hide();
			$('[indexHW]').eq(6).show();
			$('[indexHW]').eq(7).show();
		}
	}
}

function loadCostNumber(){
	var configId=$('#configOrgId option:selected').val();
	if(!configId){
		return false;
	}
	$.post(getPath()+"/projectm/pmPhonemember/getCostNumber",{configId:configId},function(res){
		if("SUCCESS"==res.STATE){
			$("input[name='costNumber']").val(res.ppm.showNumber);
		}else{
			$("input[name='costNumber']").val('');
		}
	},'json')
}

var wait=60;  
function setTimeBar(o) {  
        if (wait == 0) {  
            o.removeAttribute("disabled");            
            o.value="获取验证码";  
            wait = 60;  
        } else {  
            o.setAttribute("disabled", true);  
            o.value="重新发送(" + wait + ")";  
            wait--;  
            setTimeout(function() {  
            	setTimeBar(o)  
            },  
            1000)  
        }  
}  