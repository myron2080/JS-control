$(function(){
	//添加事件
	$("#number").bind("blur",function (){
	$.post(getPath()+"/projectm/customer/judgeNumber",{id:$("input[name='id']").val(),number:$("input[name='number']").val()},function(res){
		if(res.MSG){
			$("input[name='number']").parent().addClass("l-text-invalid");
			$("input[name='number']").attr("title", res.MSG);
			$("input[name='number']").poshytip();
        }else {
        }
	},"json");});
	
	fk();
	erp();
	
});

function saveEdit(dlg){
	$('#name').val($('#simpleName').val());//name属性赋值.开通电话的时候调用f7要用name
	currentDialog = dlg;
	$.post(getPath()+"/projectm/customer/judgeNumber",{id:$("input[name='id']").val(),name:$("input[name='number']").val()},function(res){
		if(res.MSG){
			$("input[name='number']").parent().addClass("l-text-invalid");
			$("input[name='number']").attr("title", res.MSG);
			$("input[name='number']").poshytip();
        }else {
         $("#detailJson").val(putJsonData());
        	$("form").submit();
        }
	},"json");
	return false;
}
function addAssets(){
	var param=parseInt($("#param").val(),10)+1;
	$("#param").val(param);
	    var div="<ul>";
		div+="<li style='width:40px;text-align:right;'>名称:</li>";
		div+="<li style='width:155px;text-align:left;'>";
		div+="<input key='name' id='name_"+param+"'  validate='{required:true,maxlength:30}' style='height:22px;'  type='text' value=''/>";
		div+="</li>";
		div+=" <li style='width:40px;text-align:right;'>电话:</li>";
		div+="<li style='width:155px;text-align:left;'>";
		div+="<input key='phone' id='phone_"+param+"'  name='amount_${status.index }'  validate='{required:true,maxlength:30}' style='height:22px;' type='text' value=''/>";
		div+="</li>";
		div+=" <li style='width:40px;text-align:right;'>职位:</li>";
		div+="<li style='width:155px;text-align:left;'>";
		div+="<input key='position' id='position_"+param+"'   validate='{required:true,maxlength:30}' style='height:22px;'  type='text' value=''/>";
		div+="</li>";
		div+=" <li style='width:40px;text-align:right;'>邮箱:</li>";
		div+="<li style='width:155px;text-align:left;'>";
		div+="<input key='eMail' id='eMail_"+param+"'    validate='{email:true}' style='height:22px;'  type='text' value=''/>";
		div+="</li>";
		div+="<li style='width:40px;text-align:right;'>描述:</li>";
		div+="<li style='width:155px;text-align:left;'>";
		div+="<input key='remark' id='remark_"+param+"'   validate='{maxlength:150}' style='height:22px;'  type='text' value=''/>";
		div+="</li>";
		div+="<li  style='width:60px;text-align:left;'>";
		div+=" <div class='tab_box_close' style='width:12px;'><a class='delete' href='javascript:void(0);' onclick='deleteRow(this);'></a></div>";
		div+="</li>";
		div+="</ul>";
	$("#salaryItemDiv").append(div);
}
function deleteRow(obj){
	$(obj).parent().parent().parent().remove();
}
/**
 * 拼接json数据
 */
function putJsonData(){
	var jsonData="[";
	$("#salaryItemDiv ul").each(function(){
		jsonData+="{'name':'"+$(this).find("input[key='name']").val()+"',";
		jsonData+="'phone':'"+$(this).find("input[key='phone']").val()+"',";
		jsonData+="'remark':'"+$(this).find("input[key='remark']").val()+"',";
		jsonData+="'eMail':'"+$(this).find("input[key='eMail']").val()+"',";
		jsonData+="'position':'"+$(this).find("input[key='position']").val()+"'},";
	});
	if (jsonData.indexOf(",") != -1) {
		jsonData = jsonData.substring(0, jsonData.length - 1)+"]";
	}else{
		jsonData="";
	}
	return jsonData;
}

function showHideLi(obj){
	if($(obj).val()=='INTENTIONCUSTOMER'){
		$('[indexLi]').hide();
	}else{
		$('[indexLi]').show();
	}
}

function fk(){
	if($("#phoneC").is(':checked')==true){
		$("#isPhone").val(1);
	}else{
		$("#isPhone").val(0);
	}
}

function erp(){
	if($("#erpC").is(':checked')==true){
		$("#isErp").val(1);
	}else{
		$("#isErp").val(0);
	}
}