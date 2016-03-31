function addShowTelNo(){
	var param=parseInt($("#param").val());

	if(param==0){
		param+=1;
	}
	param+=1;
	
	$("#param").val(param);      
	
	var div="<tr key='itemTr' id=add_"+param+"><td style='text-align: left;'><input type='text' style='width: 120px;' key='showTel'/></td>";
	div+="<td><a class='delete' href='javascript:void(0);' onclick='deleteRow("+param+");'></a></td>";
	div+="</tr>";
	
	$("#tab_allot").append(div);
}

/**
 * 删除
 * @param obj
 */
function deleteRow(txt){

	var count=0;
	$('#tab_allot tr').each(function(){		
		if($(this).attr("key") == 'itemTr'){
			count+=1;
		}
	});
	if(count==1){
		art.dialog.tips("至少保留一个号码!");
	}else{
		$('#add_'+txt).remove();
	}
}

/**
 * 限制输入数字
 * @param obj
 */
function checkNaN(obj){
	var val=$(obj).val();
	if(isNaN(val)){
		$(obj).val('');
		return false
	}
	if(val.length>11){
		$(obj).val(val.substring(0,11));
	}
}

/**
 * 拼接json数据
 */
function setContactJson(){
	
	var contactJson="[";
	$("#tab_allot tr").each(function(){
		if($(this).attr("key") == 'itemTr'){
			contactJson+="{'showTelNo':'"+$(this).find("input[key='showTel']").val()+"'},";
		}
	});
	if (contactJson.indexOf(",") != -1) {
		contactJson = contactJson.substring(0, contactJson.length - 1)+"]";
	}else{
		contactJson="";
	}
	$("#contactJson").val(contactJson);
}

function beforesave(){
	setContactJson();
	var flag=true;
	$("#tab_allot tr").each(function(){
		if($(this).attr("key") == 'itemTr'){
			if(!isNotNull($(this).find("input[key='showTel']").val())){		
				art.dialog.tips("请填写去电号码！",1.5);
				flag=false;
			}
		}
	});
	
	return flag;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}

function getAgentName(oldValue,newValue,doc){
	var agentId=newValue.agentId;
	$('#agentId').val(agentId);
}





