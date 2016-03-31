$(document).ready(function(){
});
function judgeOrg(){
	$.post(getPath()+"/hr/leaveRule/judgeOrgId",{id:$("input[name='id']").val(),orgId:$("input[name='org.id']").val()},function(res){
		if(res.MSG){
			art.dialog.tips("该组织的规则已经存在！");
			$("input[name='org.id']").val("");
			$("input[name='org.name']").val("");
        }
	},"json");
}
function checkValidate(){
	var reg=/^[1-9]\d*|0$/;
if($("#name").val()==''){
	art.dialog.tips("请填写规则名称！");
	$("#name").focus();
	return false;
}
if($("#orgId").val()==''){
	art.dialog.tips("请选择所属组织！");
	$("#orgName").focus();
	return false;
}
if($("#annualLeave").val()==''){
	art.dialog.tips("请填写年假提前天数！");
	$("#annualLeave").focus();
	return false;
}else if(!reg.test($("#annualLeave").val())){ 
	art.dialog.tips("只能输入非负整数！");
	$("#annualLeave").focus();
	return false;
}
if($("#compassionateLeave").val()==''){
	art.dialog.tips("请填写事假提前天数！");
	$("#compassionateLeave").focus();
	return false;
}else if(!reg.test($("#compassionateLeave").val())){ 
	art.dialog.tips("只能输入非负整数！");
	$("#compassionateLeave").focus();
	return false;
}else if($("#sickLeave").val()==''){
	art.dialog.tips("请填写病假提前天数！");
	$("#sickLeave").focus();
	return false;
}else if(!reg.test($("#sickLeave").val())){ 
	art.dialog.tips("只能输入非负整数！");
	$("#sickLeave").focus();
	return false;
}
if($("#marriageLeave").val()==''){
	art.dialog.tips("请填写婚假提前天数！");
	$("#marriageLeave").focus();
	return false;
}else if(!reg.test($("#marriageLeave").val())){ 
	art.dialog.tips("只能输入非负整数！");
	$("#marriageLeave").focus();
	return false;
}
if($("#bereavementLeave").val()==''){
	art.dialog.tips("请填写丧假提前天数！");
	$("#bereavementLeave").focus();
	return false;
}else if(!reg.test($("#bereavementLeave").val())){ 
	art.dialog.tips("只能输入非负整数！");
	$("#bereavementLeave").focus();
	return false;
}
if($("#ippfLeave").val()==''){
	art.dialog.tips("请填写计生假提前天数！");
	$("#ippfLeave").focus();
	return false;
}else if(!reg.test($("#ippfLeave").val())){ 
	art.dialog.tips("只能输入非负整数！");
	$("#ippfLeave").focus();
	return false;
}
if($("#ohter").val()==''){
	art.dialog.tips("请填写其他假期提前天数！");
	$("#ohter").focus();
	return false;
}else if(!reg.test($("#ohter").val())){ 
	art.dialog.tips("只能输入非负整数！");
	$("#ohter").focus();
	return false;
}
if($("#description").val()!=''){
if($("#description").val().trim().length>150){
	art.dialog.tips("描述不能超过150字！");
	return false;
}}
return true;
}

function saveEdit(dlg){
	currentDialog = dlg;
	if(checkValidate()){
		$("form").submit();
	}else{
	return false;}
}