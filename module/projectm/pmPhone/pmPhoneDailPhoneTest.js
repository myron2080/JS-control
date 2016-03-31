var timeoutcomp;
function dailPhone(){
	var reg=/^([+])?([0][8][6]|[8][6]|[0][0][8][6])?([-])?(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;
	var toPhone=$('#toPhone').val();
	if(!reg.test(toPhone)){
		art.dialog.tips('号码格式错误');
		return false;
	}
	var memberId=$('#memberId').val();
	var dialPhoneUrl=getPath()+"/projectm/pmPhonemember/dailPhone?memberId="+memberId+"&toPhone="+toPhone;
	$.post(dialPhoneUrl,{},function(res){
		if(res.STATE=='SUCCESS'){
			$('#sessionid').val(res.MSG);
			$('#call').hide();
			$('#hook').show();
			setTimeout(function(){
				refreshCallStatus(res.MSG);
			},5000);
		}else{
			art.dialog.alert(res.MSG);
		}
		
	},'json')
}

function hookPhone(){
	clearTimeout(timeoutcomp);
	var memberId=$('#memberId').val();
	var sessionid=$('#sessionid').val();
	var hookPhoneUrl=getPath()+"/projectm/pmPhonemember/hookPhone?memberId="+memberId+"&sessionid="+sessionid;
	$.post(hookPhoneUrl,{},function(res){
		if(res.STATE=='SUCCESS'){
			$('#call').show();
			$('#hook').hide();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json')
}
function getToPhone1(obj){
	$('#toPhone1').val($(obj).val());
}

function startRequest(){
	$("#span_date").text((new Date()).toString());
}

function refreshCallStatus(sessionId){
	var sessionId="";
	if(sessionId){
		sessionId=sessionId;
	}else{
		sessionId=$('#sessionid').val();
	}
	var getCallStatusUrl=getPath()+"/cmct/phonemember/getCallStatus";
	 $.post(getCallStatusUrl,{id:sessionId},function(res){
		 getSpanStatus(res.MSG);
		 timeoutcomp = setTimeout(function() {
			refreshCallStatus(sessionId);
		}, 5000);
	 },'json');

}

function getSpanStatus(status){
	var statusName="";
	if(status=='NEW'){
		statusName='发起呼叫 ';
	}else if(status=='RINGING'){
		statusName='正在振铃';
	}else if(status=='ANSWERING'){
		statusName='SDP协商中';
	}else if(status=='ANSWERED'){
		statusName='接听';
	}else if(status=='DISCONNECTED'){
		statusName='挂机';
	}else if(status=='NOCALLSTATUS'){
		statusName='无状态';
	}
	return statusName;
} 