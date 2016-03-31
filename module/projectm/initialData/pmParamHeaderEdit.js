var _index = 0;
$(document).ready(function() {
	 if($edit_viewstate == "EDIT" || $edit_viewstate == "VIEW") {
		 initParamLinesRow();
	 }else{
		 $("#addBtn").click();
		 $("#addspan").hide();
	 }
	 
	 
	 if($("#dataId").val()!="" && $("#dataId").val()!=null){
		 $("#number").attr("disabled","disabled");
	 }
	 
});

/**
 * 点击新增按钮
 */
function addRowEvent() {
	var selectLevelVal = $("#level").val();
    _index ++;
	var trRow = "<tr  _index=\"" + _index + "\" id=\"tr_" + _index + "\">";
	if(selectLevelVal=="GROUP" || selectLevelVal=="COMPANY"){
		trRow +="<td><select id=\"completeOrgId"+_index+"\"><option>--请选择--</option></select></td>";
	}else{
		selectLevelVal = "DEPT,STORE";
		trRow += "<td><div class=\"f7\" id=\"codeOrg"+_index+"\" dataPickerUrl=\""+getPath()+"/basedata/org/orgDeptStoreList?orgTypes="+selectLevelVal+"\"  width=\"750px\" height=\"500px\" title=\"组织\" >";
		trRow += "<input dataPicker=\"value\"  name=\"codeOrg.id\" id=\"completeOrgId"+_index+"\"  type=\"hidden\" readOnly=\"readOnly\"/>";
		trRow += "<input dataPicker=\"name\" ondblclick=\"openDataPicker('codeOrg"+_index+"')\"  name=\"codeOrg.name\" id=\"codeOrg.name\" readonly=\"readOnly\" type=\"text\"/>";
		trRow +="<span class=\"p_hov\" onclick=\"openDataPicker('codeOrg"+_index+"')\"></span>";
		trRow += "</div></td>";
	}
    trRow +="<td><select id=\"dataType"+_index+"\" onchange=\"changeSelect(this)\">";
    $(".lx").each(function(index,item){
    	trRow +="<option value=\""+$(item).attr("name")+"\">"+$(item).attr("id")+"</option>";	
    });
    trRow +="</select></td>";
    trRow +="<td  id=\"_td" + _index + "\"><input  id=\"paramValue"+_index+"\" type=\"text\" ></td>";
    trRow +="<td><input style='width:13px; height:13px;' type=\"checkbox\" id=\"check"+_index+"\"><label for=\"check"+_index+"\"> 是否有效</label></td>";
    trRow +="<td><a href=javascript:void(0) onclick=delRowsEvent(this) >删除</a></td>";
    trRow += "</tr>";
    $("#tabBody").append(trRow);
    getOrgByTypes($("#completeOrgId"+_index),selectLevelVal,null);
}
function changeSelect(obj){
	var $rt = $(obj);
	if($rt.val()=="BOOL"){
		var id = $rt.parent().next().children().attr("id");
		$rt.parent().next().children().remove();
		var selectStr = "<select id=\""+id+"\"><option value=\"TRUE\">是</option><option value=\"FALSE\">否</option></select>";	
		$rt.parent().next().append(selectStr);
	}else{
		var id = $rt.parent().next().children().attr("id");
		$rt.parent().next().children().remove();
		var selectStr = "<input  id=\""+id+"\" type=\"text\" >";	
		$rt.parent().next().append(selectStr);
	}
	
	
}
/**
 * 删除行数据
 * @param obj
 */
function delRowsEvent(obj) {
	if($edit_viewstate == "VIEW") {
		return ;
	}
    $(obj).parent().parent().remove();
}



function saveEdit(dlg) {
	
    var _itemsTable = $("#itemsTable");
    var _trLength = _itemsTable.find("tr").length
    if (_trLength == 1) {
        art.dialog.tips("请至少录入一条参数值。");
        $("#addBtn").click();
        return;
    }
    if($("#level").val()=="DEPT"){
    for (var i = 1; i < _itemsTable.find("tr").length; i++) {
    	var iRow = _itemsTable.find("tr")[i];
    	var iIndex = $(iRow).attr("_index");
    	for (var j = 1; j < _itemsTable.find("tr").length; j++) {
    		var jRow = _itemsTable.find("tr")[j];
    	var jIndex = $(jRow).attr("_index");
    		if(i!=j&&$("#completeOrgId"+iIndex).val()==$("#completeOrgId"+jIndex).val()){
    			art.dialog.tips("参数所属组织不能相同。",1);
            	return ;
    		}
    	}
    }
    }
    var jsonData = "[";
    for (var i = 1; i < _itemsTable.find("tr").length; i++) {
        var trRow = _itemsTable.find("tr")[i];
        var trIndex = $(trRow).attr("_index");
        var linesId = $(trRow).attr("linesid");
        
        
        if($("#completeOrgId"+trIndex).val()=="" || $("#completeOrg"+trIndex).val()==""){
        	art.dialog.tips("请选择所属组织。");
        	return ;
        }
        
        if($("#paramValue"+trIndex).val()==""){
        	art.dialog.tips("请录入参数值。");
        	return ;
        }

        if($("#dataType"+trIndex).val()=='INT'){
        	var reg = new RegExp("^(0|[1-9][0-9]*)$");
        	if(!reg.test($("#paramValue"+trIndex).val())){
        		art.dialog.tips("请录入正确参数值。");
        		$("#paramValue"+trIndex).css("border-color","red");
            	return ;
        	}else{
        			$("#paramValue"+trIndex).css("border-color","");
        	}
        }
        if($("#dataType"+trIndex).val()=='NUMBER'){
        	var rega = new RegExp("^[0-9]+(\\.[0-9]{1,})$");
        	if(!rega.test($("#paramValue"+trIndex).val())){
        		art.dialog.tips("请录入正确参数值(格式为xx.xx)。");
        		$("#paramValue"+trIndex).css("border-color","red");
            	return ;
        	}else{
        			$("#paramValue"+trIndex).css("border-color","");
        	}
        }
        //参数值
        jsonData += "{paramValue:'" + $("#paramValue"+trIndex).val();
        //所属组织
        jsonData += "',dataType:'" + $("#dataType"+trIndex).val();
        jsonData += "',orgId:'" + $("#completeOrgId"+trIndex).val();
        
        if(linesId!=null && linesId !=undefined){
        	jsonData +="',id:'"+linesId;
        }
        
        //启用状态
        var isChecked=$("#check"+trIndex).attr("checked");
        if(isChecked){
        	jsonData += "',status:'1";
        }else{
        	jsonData += "',status:'0";
        }
        jsonData += "'},"
    }
    jsonData = jsonData.substring(0, jsonData.length - 1);
    jsonData += "]";
    $("#entityJson").val(jsonData);
    $("form").submit();
    dlg.button({
        name : "确定", disabled : true
    },{
        name : "取消", disabled : true
    });
    return false;
}

/**
 * 加载参数值
 */
function initParamLinesRow(){
	var selectLevelVal = $("#level").val();
	if($edit_viewstate == "VIEW"){
		$("#addspan").hide();
	}else{
		if(selectLevelVal=='GROUP'){
			 $("#addspan").hide();
		 }else if(selectLevelVal=='COMPANY'){
			 $("#addspan").hide();
		 }else{
			 $("#addspan").show(); 
		 }
	}
	$.post(getPath() + "/basedata/param/listLinesData", {headerid: $("#dataId").val()},function(data){
		if (data) {
            var item = data.items;
            for (var i = 0; i < item.length; i++) {
                _index = i + 1;
                var trRow = "<tr linesid="+item[i].id+" _index=\"" + _index + "\" id=\"tr_" + _index + "\">";
                if(selectLevelVal=="GROUP" || selectLevelVal=="COMPANY"){
            		trRow +="<td><select  id=\"completeOrgId"+_index+"\"><option>--请选择--</option></select></td>";
            	}else{
            		
            		selectLevelVal = "DEPT,STORE";
            		
            		trRow += "<td><div class=\"f7\" id=\"codeOrg"+_index+"\" dataPickerUrl=\""+getPath()+"/basedata/org/orgDeptStoreList?orgTypes="+selectLevelVal+"\"  width=\"750px\" height=\"500px\" title=\"组织\" >";
            		trRow += "<input dataPicker=\"value\" value="+item[i].org.id+"  name=\"codeOrg.id\" id=\"completeOrgId"+_index+"\"  type=\"hidden\" readOnly=\"readOnly\"/>";
            		trRow += "<input dataPicker=\"name\" value="+item[i].org.name+" ondblclick=\"openDataPicker('codeOrg"+_index+"')\"  name=\"codeOrg.name\" id=\"codeOrg.name\" readonly=\"readonly\" type=\"text\"/>";
            		trRow +="<span class=\"p_hov\" onclick=\"openDataPicker('codeOrg"+_index+"')\"></span>";
            		trRow += "</div></td>";
            	}
                var	df = item[i].paramValue;
                trRow +="<td><select id=\"dataType"+_index+"\" onchange=\"changeSelect(this)\">";
                $(".lx").each(function(index,item){
                	trRow +="<option value=\""+$(item).attr("name")+"\">"+$(item).attr("id")+"</option>";	
                });
                trRow +="</select></td>";
                if(item[i].dataType!='BOOL'){
                trRow +="<td  id=\"_td" + _index + "\"><input value="+df+" id=\"paramValue"+_index+"\" type=\"text\" ></td>";
                }else{
                trRow +="<td  id=\"_td" + _index + "\"><select id=\"paramValue"+_index+"\"><option value=\"TRUE\">是</option><option value=\"FALSE\">否</option></select></td>";
                }
                trRow +="<td><input style='width:13px; height:13px;' type=\"checkbox\" id=\"check"+_index+"\"><label for=\"check"+_index+"\"> 是否有效</label></td>";
                trRow +="<td><a href=javascript:void(0) onclick=delRowsEvent(this) >删除</a></td>";
                trRow += "</tr>";
                $("#tabBody").append(trRow);
                if(item[i].dataType=='BOOL'){
                	$("#paramValue"+_index).attr("value",item[i].paramValue);	
                }
                $("#dataType"+_index).attr("value",item[i].dataType);
                getOrgByTypes($("#completeOrgId"+_index),selectLevelVal,item[i].org.id);
                if(item[i].status==1){
                	$("#check"+_index).attr("checked","checked");
                }else{
                	$("#check"+_index).removeAttr("checked");
                }
                var completeOrg = "completeOrg"+_index;
        	    var completeOrgId = "completeOrgId"+_index;
            }
            if(item.length<1){
                    $("#level").change();
            }
        }
	});
}


/**
 * 选择触发事件
 */
function chooseLevelEvent(obj){
	$("#tabBody").html("");
	 $("#addBtn").click();
	 if($(obj).val()=='GROUP'){
		 $("#addspan").hide();
	 }else if($(obj).val()=='COMPANY'){
		 $("#addspan").hide();
	 }else{
		 $("#addspan").show(); 
	 }
}

/**
 * 根据组织业务类型,获取组织信息
 * @param orgTypes  组织类型
 */
function getOrgByTypes(selectObj,orgTypes,selectVal){
	$.post(getPath() + "/projectm/param/autoComplateOrg",{orgTypes:orgTypes},function(data){
		if(data){
			var item = data.items;
			for ( var i = 0; i < item.length; i++) {
				var opt = $("<option>").text(item[i].name).val(item[i].id);
				$(selectObj).append(opt); 
				if(selectVal!=null){
					$(selectObj).attr("value",selectVal);
				}
				if($("#level").val()=="COMPANY"){
					if(i==0){
						$("#tabBody").html("");
					}
					autoadd(item[i].name,item[i].id);
				}
			}
		}
	});
	$(selectObj).find("option:first").remove();
	$(selectObj).attr("style","width:150px");
}

function autoadd(name,id) {
    _index ++;
	var trRow = "<tr  _index=\"" + _index + "\" id=\"tr_" + _index + "\">";
	trRow +="<td><input id=\"completeOrgId"+_index+"\" value=\""+id+"\" type=\"hidden\"><input style='width:150px;' readonly=\"readonly\" value=\""+name+"\" type=\"text\"></td>";
    trRow +="<td><select id=\"dataType"+_index+"\" onchange=\"changeSelect(this)\">";
    $(".lx").each(function(index,item){
    	trRow +="<option value=\""+$(item).attr("name")+"\">"+$(item).attr("id")+"</option>";	
    });
    trRow +="</select></td>";
    trRow +="<td  id=\"_td" + _index + "\"><input  id=\"paramValue"+_index+"\" type=\"text\" ></td>";
    trRow +="<td><input style='width:13px; height:13px;' type=\"checkbox\" id=\"check"+_index+"\"><label for=\"check"+_index+"\"> 是否有效</label></td>";
    trRow +="<td><a href=javascript:void(0) onclick=delRowsEvent(this) >删除</a></td>";
    trRow += "</tr>";
    $("#tabBody").append(trRow);
}
function validateNumber(obj){
	
	var _val = $(obj).val();
	if(isNotNull(_val)){
		 $.post(getPath()+"/projectm/param/getParamHeaderByNumber",{number:_val},function(data){
			 var eMsg=$("#errorMsg");
			 if(data.count>0){
				$("#number").val("");
				eMsg.html(_val + " 已被占用");
				eMsg.show();
			 }else{
				 eMsg.html("");
				 eMsg.hide();
			 }
		 	});
		 }
	
	
}

function getModuleName(oldObj,newObj,doc){
	if(newObj){
		$("#moduleName").val(newObj.typeName);
		$("#module").val(newObj.type);
	}
}