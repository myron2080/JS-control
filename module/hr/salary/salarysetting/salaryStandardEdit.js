$(function(){
	//添加事件

});


function selectAssets(oldValue,newValue,doc){
	/**
	 * 判断不允许 薪酬项目
	 */
	$(doc).find("input[key='salaryItemId']").val("");//先清空当前f7内容
	$(doc).find("input[key='salaryItemName']").val("");//先清空当前f7内容
	var jsonData=putJsonData();
	if(jsonData.indexOf(newValue.id) != -1){
		art.dialog.tips("该项目已选择!",1.5);
	}else{
		$(doc).find("input[key='salaryItemId']").val(newValue.id);
		$(doc).find("input[key='salaryItemName']").val(newValue.name);
	}
}
function changeJob(oldValue,newValue,doc){
		var id = '';
		if(newValue){
			id = newValue.id;
			$.post(getPath()+'/hr/salaryStandard/jobLevel',{job:id},function(res){
				$("#jobLevelId").html("");
				$('<option value=""></option>').appendTo("#jobLevelId");
				if(res && res.length > 0){
					for(var i = 0; i < res.length; i++){
						$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo("#jobLevelId");
					}
				}
			},'json');
		}
	}
function judgeJob(){
	var id = $("#dataId").val();
	var jobId = $("#jobId").val();
	var jobLevelId = $("#jobLevelId").val();
	$.post(getPath()+'/hr/salaryStandard/judgeJob',{job:jobId,id:id,jobLevelId:jobLevelId},function(res){
		if(res.MSG){
			art.dialog.tips(res.MSG,1.5);
		}else{
			$("form").submit();
		}
	},'json');
}
/**
 * 新增 项目
 */
function addAssets(){
	var param=parseInt($("#param").val(),10)+1;
	$("#param").val(param);
	var div="<ul>";
	div+="<li style='width:30px;text-align:right: ;'>名称:</li>";
	div+="<li style='width:135px;text-align:left;'>";//onchange='selectAssets'
	div+="<div class='f7'  onchange='selectAssets' id='salaryItem_"+param+"' dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=querySalaryItem' width='550px' height='400px' title='薪酬项目'>";
	div+="<input style='height:19px;' dataPicker='value' value='' key='salaryItemId' name='salaryItemId_"+param+"' id='salaryItemId_"+param+"' type='hidden' readOnly='readOnly' />";
	div+="<div class='l-text l-text-disabled' style='width: 135px;'>";
	div+="<input validate='{required:true}' style='height:19px; width:135px;line-height:18px;' dataPicker='name' key='salaryItemName' value='' name='salaryItemName_"+param+"' id='assetsName_"+param+"' class='l-text-field' " +
			"ligeruiid='salaryItemName_"+param+"' type='text' readOnly='readOnly' onclick=\"openDataPicker('salaryItem_"+param+"')\"/>";
	div+="<div class='l-text-l'><div class='l-text-r'></div></div></div>";
	div+="<strong onclick=clearDataPicker('salaryItem_"+param+"')></strong>";
	div+="<span class='p_hov' onclick=openDataPicker('salaryItem_"+param+"')></span></div></li>";
	div+="<li style='width:60px;text-align:right;margin-left: 20px;'>金额(元):</li>";
	div+="<li style='width:80px;text-align:left;'><div class='l-text' style='width: 60px;'>";
	div+="<input key='amount' id='amount_"+param+"' name='amount_"+param+"' label='' onkeyup=\"this.value=this.value.replace(/\\D/g,'');\"; onafterpaste=\"this.value=this.value.replace(/\\D/g,'');\"; validate='{required:true,maxlength:30}' style='width: 56px;height:18px;' ligeruiid='amount_"+param+"' class='l-text-field'  type='text' value=''/>" +
			"<div class='l-text-l'><div class='l-text-r'></div></div></div></li>";
	div+="<li  style='width:60px;text-align:left;'>";
	div+="<div class='tab_box_close' style='width:12px;'><a class='delete' href='javascript:void(0);' onclick='deleteRow(this);'></a></div>";
	div+="</li></ul>";
	$("#salaryItemDiv").append(div);
}
function deleteRow(obj){
	$(obj).parent().parent().parent().remove();
}
function saveEdit(dlg){
	currentDialog = dlg;
    $("#detailJson").val(putJsonData());
    judgeJob();
    //$("form").submit();
	return false;
}
/**
 * 拼接json数据
 */
function putJsonData(){
	var jsonData="[";
	$("#salaryItemDiv ul").each(function(){
		jsonData+="{'salaryItem':{'id':'"+$(this).find("input[key='salaryItemId']").val()+"'},";
		jsonData+="'amount':'"+$(this).find("input[key='amount']").val()+"'},";
	});
	if (jsonData.indexOf(",") != -1) {
		jsonData = jsonData.substring(0, jsonData.length - 1)+"]";
	}else{
		jsonData="";
	}
	return jsonData;
}