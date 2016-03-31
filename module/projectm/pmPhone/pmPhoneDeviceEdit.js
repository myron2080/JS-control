$(function(){
	changePortNum(true);
	var dataId =  $("#dataId").val();
	 
});

function changeNumberF7(){
	$("#showNumber").val("");
}
 

function timeOut(){
	$('#time').html();
}
function beforesave(dlg){
	var customerId = $("#customerId").val();
	if(!customerId){
		art.dialog.tips("请选择客户!");
		return false;
	}
	
	var portNum=$('#portNum').val();
	var portNumsStr = "";
	var devicePortArry = [];
	$("input[portSortNum]:lt("+portNum+")",$("#tabPortNum").get(0)).each(function(){
		var devicePort = {};
		devicePort.id= $(this).attr("portId");
		devicePort.portSortNum= $(this).attr("portSortNum");
		devicePort.portNum= $(this).val();
		devicePortArry.push(devicePort);
		if(!portNumsStr){
			portNumsStr = $(this).val();
		}else{
			portNumsStr += ","+$(this).val();
		}
	});
	$("#portNumsStr").val(portNumsStr); 
	$("#devicePortJson").val(JSON.stringify(devicePortArry));
	return true;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(typeof(beforesave) == "function"){
		beforesave(dlg);
	}
	currentDialog = dlg;
	$('form').submit();
	return false;
}

function changePortNum(initFlag){
	var portNum = $("#portNum").val();
	$("#tabPortNum tr").show();
	$("#tabPortNum td").show();
	portNum = parseInt(portNum); 
	if(portNum==1){
		$("#tabPortNum tr:gt(0)").hide();
		$("#tabPortNum tr:eq(0) td:gt(0)").hide();
	}else if(portNum==2){
		$("#tabPortNum tr:gt(0)").hide();
		$("#tabPortNum tr:eq(0) td:gt(1)").hide();
	}else if(portNum==4){
		$("#tabPortNum tr:gt(0)").hide();
	}else if(portNum==8){
		$("#tabPortNum tr:gt(1)").hide();
	} 
	
	if($("#dataId").val() && initFlag){
		//页面加载调用  
		$("#portTempDiv input").each(function(){
			var portObj = $(this);
			var obj = $("input[portSortNum="+portObj.attr("portSortNum")+"]",$("#tabPortNum").get(0));
			obj.val(portObj.val());
			obj.attr("portId", portObj.attr("portId"));
		});
		 
	}
}
