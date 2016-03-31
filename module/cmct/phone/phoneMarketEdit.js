$(document).ready(function(){
	$('input[newDateAm]').datetimepicker({
		datepicker:false,
		format:'H:i',
		allowTimes:[
		            '9:00', '10:00', '11:00', 
		            '12:00'
		           ]
	});
	$('input[newDatePm]').datetimepicker({
		datepicker:false,
		format:'H:i',
		allowTimes:[
		            '13:00', '14:00', '15:00','16:00', 
		            '17:00','18:00','19:00','20:00','21:00','22:00'
		           ]
	});
	$('input[newDate]').datetimepicker({
		format:'Y-m-d H:i',
        onChangeDateTime:function(dp,$input){
       	}
	});
	if(!$('#dataId').val()){
		$('[voiceSelect]').show();
		//$('[voiceInput]').hide();
		importPhoneButton("importPhone");
		$('#selectPhone').bind('click',function(){
			openDataPicker('selectPhoneF7');
		});
	}else{
		$('[voiceSelect]').hide();
		$('[voiceInput]').show();
		changeWaitTime();
	}
	
	$("#importTemplate").click(function(){
		downloadFile();
	});
	loadMarketAccount();
	loadMarketVoice();
})

/**
 * 读取营销余额
 */
function loadMarketAccount(){
	var djMemberId=$('#djMemberId').val();
	if(!djMemberId){
		return false;
	}
	$.post(getPath()+'/cmct/phoneMb/loadMarketAccount?djMemberId='+djMemberId,{},function(res){
		if(res.STATE=='SUCCESS'){
			$('#balance').html(res.ACCOUNT+"元");
		}
	},'json');
}

function loadVoiceName(configId){
	$('#voice').html('');
	var loadVoiceNameUrl=getPath()+'/cmct/phoneMarket/getDingjianVoice?configId='+configId;
	$.post(loadVoiceNameUrl,{},function(res){
		if(res && res.items){
			var data=res.items;
			var voiceOption="";
			for(var i=0;i<data.length;i++){
				voiceOption+="<option value="+data[i].simplePinyin+">"+data[i].name+"</option>";
			}
			$('#voice').html(voiceOption);
		}
	},'json');
}
/**
 * 读取语音文件
 */
function loadMarketVoice(){
//	var djMemberId=$('#djMemberId').val();
	var congfigId=$('#congfigId').val();
	loadVoiceName($('#congfigId').val());
}

function downloadFile(){
	var path = "/WEB-INF/template/cmct/excelImportPhone.xlsx" ;
	window.open(ctx+"/basedata/template/downFile?path="+path);
}

function changeSeatNbr(){
	var selectPhoneInput=$("input[name='selectPhoneInput']").val();
	if(selectPhoneInput && selectPhoneInput != null){
		var seatNbrArr=selectPhoneInput.split(";");
		var seats=getAllSeats();
		for(var i=0;i<seatNbrArr.length;i++){
			var len=getLastLenSeat();
			if(seats.indexOf(seatNbrArr[i]) <0 && len<100){			
				$('<li><input type="text" name="customerSeat" onkeyup="validatePhone(this)" value='+seatNbrArr[i]+' /><a href="javascript:void(0)" onclick="closeSeat(this)"><img src="'+getPath()+'/default/style/images/fastsale/send_message.gif"/></a></li>').appendTo("#seatUl");
				onSeatNum();
				seats+=seatNbrArr[i]+",";
			}
		}
		validataAllSeat();
	}
}

function chengeDisplayNbr(oldValue,newValue,doc){
	$('#displayNbr').val(newValue.userId);
	loadVoiceName(newValue.orgInterfaceId);
}


function changeWaitTime(obj){
	if(obj){		
		if($(obj).val()=='2'){
			$('[waitTimeIndex]').show();
		}else{
			$('[waitTimeIndex]').hide();
		}
	}else{
		var callMode=$("select[name='callMode'] :selected").val();
		if(callMode=='2'){
			$('[waitTimeIndex]').show();
		}else{
			$('[waitTimeIndex]').hide();
		}
	}
	
}
importPhoneButton=function(id){
	var url = '/cmct/phoneMarket/conversionPhone';
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        responseType: "json",
        name: "phone",
        onSubmit: function(file, extension){
        	//图片上传时做类型判断
        	$('#loadingDiv').show(); 
        	if (extension && /^(xlsx|xls)$/.test(extension)) {
            }
            else {
                alert("只允许上传 xlsx,xls格式文件");
                $('#loadingDiv').hide();
                return false;
            }
        },
        onComplete: function(file, json){  
        	$('#loadingDiv').hide();
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        	}else{
	          // $('#calleeNbr').text(json.MSG);
        		var phones1=getAllPhone();//已经选择的所有的电话号码
        		var phones=json.MSG;
        		var phonesArr=phones.split(",");
        		for(var i=0;i<phonesArr.length;i++){
        			var len=getLastLen();
        			var flag=true;
        			if(phones1.indexOf(phonesArr[i]) != -1 ){
        				flag=false;
        			}
        			if(flag && len<5000){
        				$('<li><input type="text" name="customerPhone" onkeyup="validateSeat(this)" value='+phonesArr[i]+' /><a href="javascript:void(0)" onclick="closeCustomer(this)"><img src="'+getPath()+'/default/style/images/fastsale/send_message.gif"/></a></li>').appendTo("#phoneUl");
        				onPhoneNum();
        				phones1+=phonesArr[i]+",";
        			}
        		}
        	}
        	return;
        }
    });
}

/**
 * 双击手动输入手机号码
 */
function addPhone(){
	var len=getLastLen();
	if(len<5000){
		$('<li><input type="text" name="customerPhone" onkeyup="validatePhone(this)"/><a href="javascript:void(0)" onclick="closeCustomer(this)"><img src="'+getPath()+'/default/style/images/fastsale/send_message.gif"/></a></li>').appendTo("#phoneUl");
		onPhoneNum();
	}
}

/**
 * 双击手动输入手机号码
 */
function addSeat(){
	var len=getLastLenSeat();
	if(len<100){
		$('<li><input type="text" name="customerSeat" onkeyup="validateSeat(this)"/><a href="javascript:void(0)" onclick="closeSeat(this)"><img src="'+getPath()+'/default/style/images/fastsale/send_message.gif"/></a></li>').appendTo("#seatUl");
		onSeatNum();
	}
}

/**
 * 删除 一个
 */
function closeCustomer(obj){
	$(obj).parent().remove();
	onPhoneNum();
}

/**
 * 同步  接收号码数量 
 */
function onPhoneNum(){
	var len=$("#phoneUl li").length;
	$("#acceptNums").html(parseInt(len,10));
}

/**
 * 删除 一个
 */
function closeSeat(obj){
	$(obj).parent().remove();
	onSeatNum();
}

/**
 * 同步  接收号码数量 
 */
function onSeatNum(){
	var len=$("#seatUl li").length;
	$("#seatNums").html(parseInt(len,10));
}

function getLastLen(){
	var len=$("#phoneUl li").length;
	return parseInt(len,10);
}

function getLastLenSeat(){
	var len=$("#seatUl li").length;
	return parseInt(len,10);
}

/**
 * 验证所有的电话
 */
function validataAll(){
	$("#phoneUl li").each(function(){
		validatePhone($(this).find("input[name='customerPhone']"));
	});
}

/**
 * 验证所有的电话
 */
function validataAllSeat(){
	$("#seatUl li").each(function(){
		validateSeat($(this).find("input[name='customerSeat']"));
	});
}

function validateSeat(obj){
	var value = $(obj).val();
	var mobile = /^\d{11}|d{12}$/; 
	if(mobile.test(value)){
		$(obj).parent().removeClass("phoneInput");
	}else{
		$(obj).attr("title","请正确填写手机号码");
		$(obj).parent().addClass("phoneInput");
	}
}

function validatePhone(obj){
	var value = $(obj).val();
	var mobile = /^\d{11}$/; 
	if(mobile.test(value)){
		$(obj).parent().removeClass("phoneInput");
	}else{
		$(obj).attr("title","请正确填写手机号码");
		$(obj).parent().addClass("phoneInput");
	}
}

function autoChoose(){
	var proName=$("#proName").val();
	//if(proName != ''){
		art.dialog.data('autoResourceList','returnData');
		var dlg = art.dialog.open(getPath()+"/fastsale/wash/autoResource",{
				title:'资源客',
				 lock:true,
				 width:'300px',
				 height:'80px',
				 id:"autoResourceList",
				 close:function(){
					 return true;
					
				 },
				 button:[{name:'确定',callback:function(){
					 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.selectData){
						 dlg.iframe.contentWindow.selectData(dlg);
					 }
					 return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
			});
	//}else{
	//	art.dialog.tips("请选择项目!",1.5);
	//}
}

/**
 * 选择客户 回调函数
 * @param data
 */
function returnData(data){
	var phones=getAllPhone();//已经选择的所有的电话号码
	for(var i=0;i<data.length;i++){
		var obj=data[i];
		var flag=true;
		if(phones.indexOf(obj.customerPhone) != -1 ){
			flag=false;
		}
		var len=getLastLen();
		if(flag && len<5000){
			$('<li id="'+obj.id+'" type="private" name="'+obj.customerName+'" phone="'+obj.customerPhone+'">'+
					 obj.customerName+':<input name="customerPhone"  onkeyup="validatePhone(this)" value="'+obj.customerPhone+'" type="text"/>'
					 +'<a href="javascript:void(0)" onclick="closeCustomer(this)"><img src="'+getPath()+'/default/style/images/fastsale/send_message.gif"/></a></li>').appendTo("#phoneUl");
			phones+=obj.customerPhone+",";
		}
	}
	validataAll();
	onPhoneNum();
}

/**
 * 发送 处理 数据
 */

function getAllPhone(){
	var data="";
	$("#phoneUl li").each(function(){
		data+=$(this).find("input[name='customerPhone']").val()+",";
	});
	return data;
}

function getAllSeats(){
	var data="";
	$("#seatUl li").each(function(){
		data+=$(this).find("input[name='customerSeat']").val()+",";
	});
	return data;
}

function beforesave(){
	var isRecord=$('#isRecordChecbox').is(':checked') ? "1" : "" ;
	$('#isRecord').val(isRecord);
	var amBeginTime=$("input[name='amBeginTime']").val();
	var amEndTime=$("input[name='amEndTime']").val();
	var pmBeginTime=$("input[name='pmBeginTime']").val();
	var pmEndTime=$("input[name='pmEndTime']").val();
	if(amBeginTime>amEndTime){
		art.dialog.tips('上午发送时间错误');
		return false;
	}
	if(pmBeginTime>pmEndTime){
		art.dialog.tips('下午发送时间错误');
		return false;
	}
	
	var saveFlag=true;
	
	if($("#phoneUl li").length<=0){
		art.dialog.tips('呼叫号码不能为空');
		saveFlag=false;
	}
	
	if(!saveFlag){
		return false;
	}
	
	if($("#seatUl li").length<=0){
		art.dialog.tips('转坐席号码不能为空');
		saveFlag=false;
	}
	
	if(!saveFlag){
		return false;
	}
	var phones=getAllPhone();
	if(phones && phones.indexOf(",")!=-1){
		phones=phones.substring(0,phones.length-1);
	}
	$('#calleeNbr').val(phones);
	
	var seats=getAllSeats();
	if(seats && seats.indexOf(",")!=-1){
		seats=seats.substring(0,seats.length-1);
	}
	$('#seatNbr').val(seats);
	
	return true;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave() && submitCheck()){
		$('form').submit();
	}
}

function submitCheck(){
	var flag=true;
	$("#phoneUl li").each(function(){
		if($(this).attr("class") == 'phoneInput'){
			flag=false;
		}
	});
	
	$("#seatUl li").each(function(){
		if($(this).attr("class") == 'phoneInput'){
			flag=false;
		}
	});
	
	if(!flag){
		art.dialog.tips('号码格式有错误..');
	}
	return flag;
}