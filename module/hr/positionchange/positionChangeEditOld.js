$list_editUrl = getPath()+"/hr/positionchange/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/hr/positionchange/delete";//删除url
var manager, g;

$(document).ready(function(){
	
	
	/***************************data Panel***************************/
	g =  manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		//
        /*columns: [ 
            {display: '员工编号', name: 'applyPerson.number', align: 'left', width: 120, editor: { type: 'f7'}},
            {display: '员工姓名', name: 'applyPersonName', align: 'left', width: 100,render:personNameRender},
            {display: '现部门', name: 'applyOrg.name', align: 'left', width: 100,render:orgNameRender},
            {display: '现职位', name: 'applyPosition.name', align: 'left', width: 100,render:positionNameRender},
            {display: '现职级', name: 'applyJoblevel.name', align: 'left', width: 100,render:jobLevelNameRender},
            {display: '任职日期', name: 'oldEffectdate', align: 'left', width: 80,render:takeOfficeDateRender},
            {display: '变动部门', name: 'applyChangeOrg.name', align: 'left', width: 100,
            	editor: { type: 'f7', id:"orgF7", dataPickerUrl:getPath()+"/basedata/org/orgDataPicker",
            		width:"750px",width:"500px"}},
            {display: '变动职位', name: 'applyChangePosition.name', align: 'left', width: 100},
            {display: '变动职级', name: 'applyChangeJoblevel.name', align: 'left', width: 80},
            {display: '生效日期', name: 'effectdate', align: 'left', width: 100,dateFormat:"yyyy-MM-dd"},
            {display: '操作', name: 'operate', align: 'center', width: 65,render:operateRender}
        ]*/columns: [ 
                     {display: '员工编号', name: 'applyPerson', align: 'left', width: 120, editor: { type: 'f7'},render:function(data){
                    	 if(data.applyPerson){
                    	   return data.applyPerson.number;
                    	 }
                    	 return '';
                     }},
                     {display: '员工姓名', name: 'applyPersonName', align: 'left', width: 100,render:function(data){
                    	 if(data.applyPerson){
                        	 return data.applyPerson.name;
                    	 }
                        	 return '';
                       }},
                     {display: '现部门', name: 'applyOrg.name', align: 'left', width: 100,render:function(data){
                    	 if(data.applyPerson && data.applyPerson.personPosition){
                        	 return data.applyPerson.personPosition.position.belongOrg.name;
                    	 } 
                        	 return '';
                       }},
                     {display: '现职位', name: 'applyPosition.name', align: 'left', width: 100,render:function(data){
                    	 if(data.applyPerson && data.applyPerson.personPosition){
                        	 return data.applyPerson.personPosition.position.name;
                    	 }
                        	 return '';
                       }},
                     {display: '现职级', name: 'applyJoblevel.name', align: 'left', width: 100,render:function(data){
                    	 if(data.applyPerson && data.applyPerson.personPosition){
                        	 return data.applyPerson.personPosition.jobLevel.name;
                    	 }
                        	 return '';
                       }},
                     {display: '任职日期', name: 'oldEffectdate', align: 'left', width: 80,render:function(data){
                    	 if(data.applyPerson){
                        	 return data.applyPerson.personPosition.effectDate;
                    	 }
                        	 return '';
                       }},
                     {display: '变动部门', name: 'applyChangeOrg', align: 'left', width: 100,
                     	editor: { type: 'orgf7'},render:function(data){
                       	 if(data.applyChangeOrg){
                      	   return data.applyChangeOrg.name;
                      	 }
                      	 return '';
                       }},
                     {display: '变动职位', name: 'applyChangePosition.name', align: 'left', width: 100},
                     {display: '变动职级', name: 'applyChangeJoblevel.name', align: 'left', width: 80},
                     {display: '生效日期', name: 'effectdate', align: 'left', width: 100, type: 'date',format:"yyyy-MM-dd",editor: { type: 'date'}},
                     {display: '操作', name: 'operate', align: 'center', width: 65,render:operateRender}
                 ],
        fixedCellHeight:false,
        delayLoad:true,
        enabledEdit: true, isScroll: true, checkbox:true,rownumbers:true,
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	 
        }
    		
    }));
	searchData();
	
	bindEvent();
});

function deleteRow()
{ 
    manager.deleteSelectedRow();
}

function addNewRow()
{if(manager.getData()[0]){alert(manager.getData()[0].applyPersonName);alert(JSON.stringify(manager.getData()[0]));}
    manager.addEditRow();
} 

$.ligerDefaults.Grid.editors['f7'] =
{
    create: function (container, editParm)
    {
    	var personDiv =  "<div class='f7'  onchange='choosePerson' id='keyPerson"+editParm.rowindex+"' "+
		  " dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=applyChangePersonQuery&includeChild=Y&orgLongNumber="+$("#orgLongNumber").val() +"'"+
		  " width='500px' height='300px' title='人员'>"+
    		"<input  type='text'  id='applyPersonNumber"+editParm.rowindex+"' name='applyPerson.number'   onclick=\"openDataPicker('keyPerson"+editParm.rowindex+"')\" />"+
    		"<input  type='hidden' dataPicker='value' id='applyPersonId"+editParm.rowindex+"' name='applyPerson.id'  />"+
    		"<strong onclick=\"clearDataPicker('keyPerson"+editParm.rowindex+"')\"></strong>"+
			"<span class='p_hov' onclick=\"openDataPicker('keyPerson"+editParm.rowindex+"')\"></span>"+
		"</div>";
        var column = editParm.column;
        var input = $(personDiv);
        container.append(input);
        var options = {};
        var ext = column.editor.p || column.editor.ext;
        if (ext)
        {
            var tmp = typeof (ext) == 'function' ?
             ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
            $.extend(options, tmp);
        }
        return input;
    },
    getValue: function (input, editParm)
    {   
    	return $(input).attr('value');
    },
    setValue: function (input, value, editParm)
    { 
    	getDataPickerInstance(input.id).setValue(value);
    },
    resize: function (input, width, height, editParm)
    {
        /*input.liger('option', 'width', width);
        input.liger('option', 'height', height);*/
    },
    destroy: function (input, editParm)
    {
        input.liger('destroy');
    }
};

$.ligerDefaults.Grid.editors['orgf7'] =
{
    create: function (container, editParm)
    {
    	var personDiv =  "<div class='f7' id='applyChangeOrg"+editParm.rowindex+"' "+
		  " dataPickerUrl='"+getPath()+"/basedata/org/orgDataPicker'"+
		  " width='750px' height='500px' title='变动组织'>"+
    		"<input  type='text' dataPicker='name' id='applyChangeOrgName"+editParm.rowindex+"'    onclick=\"openDataPicker('applyChangeOrg"+editParm.rowindex+"')\" />"+
    		"<input  type='hidden' dataPicker='value' id='applyChangeOrgId"+editParm.rowindex+"'   />"+
    		"<strong onclick=\"clearDataPicker('applyChangeOrg"+editParm.rowindex+"')\"></strong>"+
			"<span class='p_hov' onclick=\"openDataPicker('applyChangeOrg"+editParm.rowindex+"')\"></span>"+
		"</div>";
        var column = editParm.column;
        var input = $(personDiv);
        container.append(input);
        var options = {};
        var ext = column.editor.p || column.editor.ext;
        if (ext)
        {
            var tmp = typeof (ext) == 'function' ?
             ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
            $.extend(options, tmp);
        }
        return input;
    },
    getValue: function (input, editParm)
    {   
    	var orgObj =  $(input).attr('value');
    	var rtnValue = {};
    	return orgObj; 
    },
    setValue: function (input, value, editParm)
    { 
    	getDataPickerInstance(input.id).setValue(value);
    },
    resize: function (input, width, height, editParm)
    {
        /*input.liger('option', 'width', width);
        input.liger('option', 'height', height);*/
    },
    destroy: function (input, editParm)
    {
        input.liger('destroy');
    }
};

function selectPerson(data,index){ 
	var personDiv =  "<div class='f7' onchange='choosePerson' id='keyPerson"+index+"' "+
			  " dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=applyChangePersonQuery&includeChild=Y&orgLongNumber="+$("#orgLongNumber").val() +"'"+
			  " width='500px' height='300px' title='人员'>"+
	      		"<input  type='text'  id='applyPersonNumber"+index+"' name='applyPerson.number'   onclick=\"openDataPicker('keyPerson"+index+"')\" />"+
	      		"<input  type='hidden' dataPicker='value' id='applyPersonId"+index+"' name='applyPerson.id'  />"+
	      		"<strong onclick=\"clearDataPicker('keyPerson"+index+"')\"></strong>"+
    			"<span class='p_hov' onclick=\"openDataPicker('keyPerson"+index+"')\"></span>"+
			"</div>";
	return personDiv;
	
}

function personNameRender(data,index){
	return "<input type='text' id='applyPersonName"+index+"' readonly='readonly'/>";
}

function orgNameRender(data,index){
	return "<input type='text' id='applyOrgName"+index+"' readonly='readonly'/><input type='hidden' id='applyOrgId"+index+"' />";
}

function positionNameRender(data,index){
	return "<input type='text' id='applyPositionName"+index+"' readonly='readonly'/><input type='hidden' id='applyPositionId"+index+"' />";
}

function jobLevelNameRender(data,index){
	return "<input type='text' id='applyJoblevelName"+index+"' readonly='readonly'/><input type='hidden' id='applyJoblevelId"+index+"' />";
}

function takeOfficeDateRender(data,index){
	return "<input type='text' id='takeOfficeDate"+index+"' readonly='readonly'/><input type='hidden' id='jobStatus"+index+"' />";
}

/**
 * 选择申请人
 * @param oldValue
 * @param newValue
 * @param doc
 */
function choosePerson(oldValue,newValue,doc){
	var rowIndex = doc[0].id.replace("keyPerson","");
	var data = g.getData();
	var row = data[rowIndex];
	row['applyOrg.name'] = newValue.personPosition.position.belongOrg.name||"";
	g.updateCell('applyOrg.name', row['applyOrg.name'], row);
    g.endEdit();

	//g.updateRow(row,rowIndex);
	
	 /*$("#applyPersonId"+rowIndex).val(newValue.id||"");
	 $("#applyPersonNumber"+rowIndex).val(newValue.number||"");
	 $("#applyPersonName"+rowIndex).val(newValue.name||"");
	 $("#applyOrgName"+rowIndex).val(newValue.personPosition.position.belongOrg.name||"");
	 $("#applyOrgId"+rowIndex).val(newValue.personPosition.position.belongOrg.id||"");
	 $("#applyPositionName"+rowIndex).val(newValue.personPosition.position.name||"");
	 $("#applyPositionId"+rowIndex).val(newValue.personPosition.position.id||"");
	 if(newValue.personPosition){
	  $("#applyJoblevelName"+rowIndex).val(newValue.personPosition.jobLevel.name||"");
	  $("#applyJoblevelId"+rowIndex).val(newValue.personPosition.jobLevel.id||"");
	 }
	 $("#takeOfficeDate"+rowIndex).val(newValue.personPosition.effectDate||"");
	 $("#jobStatus"+rowIndex).val(newValue.jobStatus||"");*/
	 /*$("#primary"+rowIndex).val(newValue.personPosition.primary||"");*/ 
}

function operateRender(data,filterData){
	if(data.billStatus=="SAVE"){
		return '<a href="javascript:editRow({id:\''+data.id+'\',type:\''+data.type+'\'});">编辑</a>|<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	
	return "";
}


function bindEvent(){
	
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
}

function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}

function searchData(){
	
	$list_dataParam['changeType'] = "TRANSFER";
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	
	//关键字条件 [单据编号/员工编号/姓名/职位/职级]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	 
	//调动组织
	var changeOrgId = $('#orgId').val();
	if(changeOrgId != null && changeOrgId != ""){
		$list_dataParam['changeOrgId'] = changeOrgId;
	}else{
		delete $list_dataParam['changeOrgId'];
	}
	
	//单据状态
	var billStatus = $('#billStatus').val();
	if(billStatus != null && billStatus != ""){
		$list_dataParam['billStatus'] = billStatus;
	}else{
		delete $list_dataParam['billStatus'];
	}
	resetList();
}
