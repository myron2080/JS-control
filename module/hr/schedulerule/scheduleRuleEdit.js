$(document).ready(function(){
});
var orgFlag=true;
function judgeOrg(){
	$.post(getPath()+"/hr/scheduleRule/judgeOrgId",{id:$("input[name='id']").val(),orgId:$("input[name='org.id']").val()},function(res){
		if(res.MSG){
			art.dialog.tips("该组织的规则已经存在！");
			$("input[name='org.id']").val("");
			$("input[name='org.name']").val("");
			orgFlag=false;
        }else{
        	orgFlag=true;
        }
	},"json");
}
function checkValidate(){
	var reg=/^[1-9]\d*|0$/;
if($("#orgId").val()==''){
	art.dialog.tips("请选择所属组织！");
	$("#orgName").focus();
	return false;
}
if($("#morning_StartTime").val()==''){
	art.dialog.tips("请输入早班开始时间！");
	$("#morning_StartTime").focus();
	return false;
}
if($("#morning_EndTime").val()==''){
	art.dialog.tips("请输入早班结束时间！");
	$("#morning_EndTime").focus();
	return false;
}
if($("#night_StartTime").val()==''){
	art.dialog.tips("请输入晚班开始时间！");
	$("#night_StartTime").focus();
	return false;
}
if($("#night_EndTime").val()==''){
	art.dialog.tips("请输入晚班结束时间！");
	$("#night_EndTime").focus();
	return false;
}
return true;
}

function saveEdit(dlg){
	currentDialog = dlg;
	judgeOrg();
	if(checkValidate()&&orgFlag){
		$("form").submit();
	}else{
	return false;}
}