$(document).ready(function(){
});

function timeDiff(time1, time2) {
	var s = time1.split(':', 2);
	var e = time2.split(':', 2);
	time1=eval(parseInt(s[0]*60, 10)+parseInt(s[1], 10));//化成分
	time2=eval(parseInt(e[0]*60, 10)+parseInt(e[1], 10));//化成分
    return (time2 - time1) /60;//结果为时
}

var getHours = function getHours(hours){
	 var fixNum = new Number(hours+1).toFixed(1);//四舍五入之前加1
     var fixedNum = new Number(fixNum - 1).toFixed(1);//四舍五入之后减1，再四舍五入一下
	return fixedNum;
}
function endtimeChange() {
  if ($("#overTime_StartTime").val() == ""||$("#overTime_EndTime").val() == "") {
      return false;
  }
  else {
      var time1 = $("#overTime_StartTime").val() ;
      var time2 = $("#overTime_EndTime").val();
      var hours = timeDiff(time1, time2);//要四舍五入的数字
      if(hours<0){
    	  art.dialog.tips("请加班结束时间要大于开始时间！");
  		$("#overTime_EndTime").val("");
  		return false;
      }
      $("#timeTotal").val(getHours(hours));
      $("#timeTotalLable").html(getHours(hours)+"小时");
 }
}

function setRespOrgId(oldvalue,newvalue,doc){
	if(newvalue){
	if(newvalue.personPosition){
	$("#orgId").val(newvalue.personPosition.position.belongOrg.id);
	$("#orgName").val(newvalue.personPosition.position.belongOrg.name);
	if(newvalue.personPosition.position){
	$("#applyPositionId").val(newvalue.personPosition.position.id);}else{
		art.dialog.tips("该申请人无岗位，不能申请！");
		$("#applyPersonName").val("");
		$("#applyPersonId").val("");
	}}else{
		art.dialog.tips("该申请人无组织，不能申请！");
		$("#applyPersonName").val("");
		$("#applyPersonId").val("");
	}
	}else{
		art.dialog.tips("该申请人无组织，不能申请！");
		$("#applyPersonName").val("");
		$("#applyPersonId").val("");
	}}
function checkValidate(){
if($("#applyPersonId").val()==''){
	art.dialog.tips("请选择申请人！");
	return false;
}
if($("#overTimeDate").val()==''){
	art.dialog.tips("请选择加班日期！");
	return false;
}
endtimeChange();
if($("#overTime_StartTime").val()==''){
	art.dialog.tips("请填写加班开始时间！");
	$("#overTime_StartTime").focus();
	return false;
}
if($("#overTime_EndTime").val()==''){
	art.dialog.tips("请填写加班束时间！");
	$("#overTime_EndTime").focus();
	return false;
}
if($("#timeTotal").val()=='0.0'||$("#timeTotal").val()=='0'){
	art.dialog.tips("请检查加班时间范围！");
	return false;
 }

if($("#workContent").val()==''){
	art.dialog.tips("请填写工作内容！");
	$("#workContent").focus();
	return false;
}else if($("#workContent").val().trim().length>150){
	art.dialog.tips("工作内容不能超过200字！");
	return false;
}
return true;
}

function submitData(preWinObj,operateType){
	   if(operateType=="SUBMIT"){
		   $('#dataForm').attr('action',getPath()+"/hr/overTime/updateSubmit");
		   $("#billStatus").val("SUBMIT")
	     }else if(operateType=="SAVE"){
	    	 if(!$("#billStatus").val()){
	    		 $('#dataForm').attr('action',getPath()+"/hr/overTime/save");
	        	 $("#billStatus").val("SAVE");
	          }
	     }
	   if(checkValidate()){
	   $("form").submit();}
}

function saveAdd(preWinObj,operateType){
	currentDialog = preWinObj;
	submitData(preWinObj,operateType);
}
function saveSubmit(dlg){
	  $('#dataForm').attr('action',getPath()+"/hr/overTime/updateSubmit");
		 saveAdd(dlg,'SUBMIT');
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/overTime/cancleBill");
		saveAdd(dlg,'REVOKE');
}