var leaverule;
var limitDays;
var ruleValidate=true;
$(document).ready(function(){
	$('#ask4LeaveStartTime').datetimepicker({
		lang:'ch',
		format:'Y-m-d H:i'
	});
	$('#ask4LeaveEndTime').datetimepicker({
		lang:'ch',
		format:'Y-m-d H:i'
	});
});

//字符串转成Time(dateDiff)所需方法
function stringToTime(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
   parseInt(d[0], 10) || null,
   (parseInt(d[1], 10) || 1) - 1,
parseInt(d[2], 10) || null,
parseInt(t[0], 10) || null,
parseInt(t[1], 10) || null,
parseInt(t[2], 10) || null
)).getTime();
}
function dateDiff(date1, date2) {
    var type1 = typeof date1, type2 = typeof date2;
    if (type1 == 'string')
        date1 = stringToTime(date1);
    else if (date1.getTime)
        date1 = date1.getTime();
    if (type2 == 'string')
        date2 = stringToTime(date2);
    else if (date2.getTime)
        date2 = date2.getTime();
    return (date2 - date1) / (1000 * 60 * 60 * 24); //结果是秒
}
var getDays = function getDays(days){
	 var fixNum = new Number(days+1).toFixed(2);//四舍五入之前加1
    var fixedNum = new Number(fixNum - 1).toFixed(2);//四舍五入之后减1，再四舍五入一下
    //小数.后一位小于0.5计作0.5天；大于0.5计作1天
    /*if((fixedNum*10)%10>0&&(fixedNum*10)%10<=5){
  	  fixedNum= Math.floor(fixedNum)+0.5;
    }else{
  	  fixedNum= Math.ceil(fixedNum);
    }*/
	return fixedNum;
}
function getEndTime(starTime,days){
	 var type = typeof starTime
	 if (type == 'string')
		 starTime = stringToTime(starTime);
	 else if (starTime.getTime)
	     starTime = starTime.getTime();
	 var dayTime = days*1000 * 60 * 60 * 24;
	 var endTime = starTime+dayTime;
	 //alert("dayTime_"+dayTime+"statTime_"+starTime+"endTime_"+endTime);
	 return new Date(endTime);
}
function setLeaveRule(){
	if(leaverule){
	var leaveType=$("#ask4LeaveType").val();
	if(leaveType==""){
	}if(leaveType=="COMPASSIONATELEAVE"){
		limitDays=leaverule.compassionateLeave;
	}else if(leaveType=="SICKLEAVE"){
		limitDays=leaverule.sickLeave;
	}else if(leaveType=="ANNUALLEAVE"){
		limitDays=leaverule.annualLeave;
	}else if(leaveType=="MARRIAGELEAVE"){
		limitDays=leaverule.marriageLeave;
	}else if(leaveType=="BEREAVEMENTLEAVE"){
		limitDays=leaverule.bereavementLeave;
	}else if(leaveType=="IPPFLEAVE"){
		limitDays=leaverule.ippfLeave;
	}else if(leaveType=="OHTRER"){
		limitDays=leaverule.ohter;
	}}
	//$("#limitDays").html("需要提前"+limitDays+"天");
}
function getRule(){
	if($("#orgId").val()!=""){
	$.post(getPath()+"/hr/leaveRule/getRule",{orgId:$("#orgId").val()},function(data){
		if(data){
			leaverule=data;
        }
	},"json");
}}
function endtimeChange() {
  if ($("#ask4LeaveStartTime").val() == ""||$("#ask4LeaveEndTime").val() == "") {
      return false;
  }
  else {
      var date1 = $("#ask4LeaveStartTime").val();
      var date2 = $("#ask4LeaveEndTime").val();
      var days = dateDiff(date1, date2);//要四舍五入的数字
      if(leaverule){
      checkRuleValidate();}
      if(days<0){
    	  art.dialog.tips("请假结束时间要大于开始时间！");
  		$("#ask4LeaveEndTime").val("");
  		return false;
      }
    //  $("#leaveDays").val(getDays(days)); 
 }
}
function changeLeaveDays(){
	var date1 = $("#ask4LeaveStartTime").val();
	var days = $("#leaveDays").val();
	if(days!=null&&days!=''){
	var now = getEndTime(date1,days);
	var nowStr=now.format("yyyy-MM-dd hh:mm:ss");
	$("#ask4LeaveEndTime").val(nowStr);}
}
function checkRuleValidate(){
	var date1 = $("#ask4LeaveStartTime").val();
	var now = new Date();
	var nowStr=now.format("yyyy-MM-dd hh:mm:ss");
	var days = dateDiff(nowStr,date1 );
	/*if(leaverule){
		if(getDays(days)<limitDays){
			  art.dialog.tips("请该假需提前"+limitDays+"天！");
			  $("#ask4LeaveStartTime").val("");
			  return false;
		}
	}*/
	return true;
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
	getRule();
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
if($("#ask4LeaveType").val()==''){
	art.dialog.tips("请选择请假类型！");
	return false;
}
endtimeChange();
if($("#ask4LeaveStartTime").val()==''){
	art.dialog.tips("请填写请假开始时间！");
	$("#ask4LeaveStartTime").focus();
	return false;
}
if($("#ask4LeaveEndTime").val()==''){
	art.dialog.tips("请填写请假结束时间！");
	$("#ask4LeaveEndTime").focus();
	return false;
}
if($("#leaveDays").val()=='0.0'||$("#leaveDays").val()=='0'){
	art.dialog.tips("请检查请假时间范围！");
	return false;
 }

if($("#reasons4Leave").val()==''){
	art.dialog.tips("请填写请假事由！");
	$("#reasons4Leave").focus();
	return false;
}else if($("#reasons4Leave").val().trim().length>150){
	art.dialog.tips("请假事由不能超过150字！");
	return false;
}
if(!checkRuleValidate()){
	return false;
};
var startTime = $("#ask4LeaveStartTime").val();
    $("#ask4LeaveStartTime").val(startTime+":00");
var endTime = $("#ask4LeaveEndTime").val();
    $("#ask4LeaveEndTime").val(endTime+":00");
return true;
}

function submitData(preWinObj,operateType){
	   if(operateType=="SUBMIT"){
		   $('#dataForm').attr('action',getPath()+"/hr/ask4Leave/updateSubmit");
		   $("#ask4LeaveStatus").val("SUBMIT")
	     }else if(operateType=="SAVE"){
	    	 if(!$("#ask4LeaveStatus").val()){
	    		 $('#dataForm').attr('action',getPath()+"/hr/ask4Leave/save");
	        	 $("#ask4LeaveStatus").val("SAVE");
	          }
	     }
	   if(checkValidate()){
	   $("form").submit();
	   }
}

function saveAdd(preWinObj,operateType){
	currentDialog = preWinObj;
	submitData(preWinObj,operateType);
}
function saveSubmit(dlg){
	  $('#dataForm').attr('action',getPath()+"/hr/ask4Leave/updateSubmit");
		 saveAdd(dlg,'SUBMIT');
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/ask4Leave/cancleBill");
		saveAdd(dlg,'REVOKE');
}