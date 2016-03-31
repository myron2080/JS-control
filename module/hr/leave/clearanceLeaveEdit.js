$(document).ready(function(){
	$('#actualStartTime').datetimepicker({
		lang:'ch',
		format:'Y-m-d H:i'
	});
	$('#actualEndTime').datetimepicker({
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
function endtimeChange() {
  if ($("#actualStartTime").val() == ""||$("#ask4LeaveEndTime").val() == "") {
      return false;
  }
  else {
      var date1 = $("#actualStartTime").val();
      var date2 = $("#actualEndTime").val();
      var days = dateDiff(date1, date2);//要四舍五入的数字
      if(days<0){
    	  art.dialog.tips("请假结束时间要大于开始时间！");
  		$("#actualEndTime").val("");
  		return false;
      }
      var fixNum = new Number(days+1).toFixed(2);//四舍五入之前加1
      var fixedNum = new Number(fixNum - 1).toFixed(2);//四舍五入之后减1，再四舍五入一下
      //alert(fixedNum%10)
      if((fixedNum*10)%10>0&&(fixedNum*10)%10<=5){
    	  fixedNum= Math.floor(fixedNum)+0.5;
      }else{
    	  fixedNum= Math.ceil(fixedNum);
      }
      $("#actualLeaveDays").val(fixedNum);
 }
}
function getEndTime(starTime,days){
	 var type = typeof starTime
	 if (type == 'string')
		 starTime = stringToTime(starTime);
	 else if (starTime.getTime)
	     starTime = starTime.getTime();
	 var dayTime = days*1000 * 60 * 60 * 24;
	 var endTime = starTime+dayTime;
	 return new Date(endTime);
}
function changeLeaveDays(){
	var date1 = $("#actualStartTime").val();
	var days = parseFloat($("#actualLeaveDays").val());
	if(days!=null&&days!=''){
	var now = getEndTime(date1,days);
	var nowStr=now.format("yyyy-MM-dd hh:mm:ss");
	$("#actualEndTime").val(nowStr);}
}
function checkValidate(){
if($("#actualStartTime").val()==''){
		art.dialog.tips("请填写请假开始时间！");
		$("#actualStartTime").focus();
		return false;
}
if($("#actualEndTime").val()==''){
	art.dialog.tips("请填写请假结束时间！");
	$("#actualEndTime").focus();
	return false;
}
if($("#actualLeaveDays").val()<0){
		art.dialog.tips("请假开始时间要大于结束时间！");
		//$("#ask4LeaveStartTime").focus();
		return false;
}else if($("#actualLeaveDays").val()=='0.0'){
	art.dialog.tips("请检查请假时间范围！");
}
if($("#reasons4Cleareance").val()==''){
	art.dialog.tips("请填写销假事由！");
	$("#reasons4Cleareance").focus();
	return false;
}else if($("#reasons4Cleareance").val().trim().length>150){
	art.dialog.tips("销假事由不能超过150字！");
	return false;
}
var startTime = $("#actualStartTime").val();
$("#actualStartTime").val(startTime+":00");
var endTime = $("#actualEndTime").val();
$("#actualEndTime").val(endTime+":00");
return true;
}
function saveEdit(dlg){
	currentDialog = dlg;
	if(checkValidate()){
		$("form").submit();
	}else{
	return false;}
}
function submitData(preWinObj,operateType){
	   if(operateType=="SUBMIT"){
		   $('#dataForm').attr('action',getPath()+"/hr/clearanceLeave/updateSubmit");
		   $("#leaveClearanceStatus").val("SUBMIT")
	     }else if(operateType=="SAVE"){
	    	 if(!$("#leaveClearanceStatus").val()){
	    		 $('#dataForm').attr('action',getPath()+"/hr/clearanceLeave/save");
	        	 $("#leaveClearanceStatus").val("SAVE");
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
	  $('#dataForm').attr('action',getPath()+"/hr/clearanceLeave/updateSubmit");
		 saveAdd(dlg,'SUBMIT');
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/clearanceLeave/cancleBill");
		saveAdd(dlg,'REVOKE');
}