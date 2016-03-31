$list_editUrl = getPath()+"/hr/positionchange/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/positionchange/add";//新增及查看url
$list_deleteUrl = getPath()+"/hr/positionchange/delete";//删除url
$list_dataType = "员工调职";
$list_editWidth =750;
$list_editHeight = 450;
var manager, g;
$(document).ready(function(){
	
	params ={};
	params.inputTitle = "范围";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
	/***************************data Panel***************************/
	g =  manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		//
        columns: [ 
             {display: '操作', name: 'operate', align: 'center', width: 65,render:operateRender},
            {display: '单据编号', name: 'billNumber', align: 'left', width: 125},
            {display: '单据状态', name: 'billStatusName',align: 'left', width: 65,render:statusRender} ,
            {display: '员工编号', name: 'applyPerson.number', align: 'left', width: 120},
            {display: '员工姓名', name: 'applyPersonName', align: 'left', width: 80},
            {display: '变动前部门', name: 'applyOrg.name', align: 'left', width: 110},
            {display: '变动前职位', name: 'applyPosition.name', align: 'left', width: 100},
            {display: '变动前职级', name: 'applyJoblevel.name', align: 'left', width: 110},
            {display: '变动后部门', name: 'applyChangeOrg.name', align: 'left', width: 110},
            {display: '变动后职位', name: 'applyChangePosition.name', align: 'left', width: 100},
            {display: '变动后职级', name: 'applyChangeJoblevel.name', align: 'left', width: 110},
            {display: '创建日期', name: 'createTime', align: 'left', width: 75,dateFormat:"yyyy-MM-dd",formatters:"date"},
            {display: '生效日期', name: 'effectdate', align: 'left', width: 75,dateFormat:"yyyy-MM-dd",formatters:"date"} 
        ],
        fixedCellHeight:false,
        delayLoad:true,
        isScroll: true, checkbox:true,rownumbers:true,
        isChecked: f_isChecked,
        url:getPath()+'/hr/positionchange/listData'
    		
    }));
	searchData();
	
	bindEvent();
});

function statusRender(data,rowIndex){
	var className = "modify_font";
	if(data.billStatus == 'SAVE'){
		
	}else if(data.billStatus == 'SUBMIT'){
		className = "approve_font";
	}else if(data.billStatus == 'APPROVED'){
		className = "approve_font01";
	}else if(data.billStatus == 'REVOKE'){
		className = "modify_font";
	}else if(data.billStatus == 'REJECT'){
		className = "delete_font";
	}else{
		className = "modify_font";
	}
	return '<font class="'+className+'">'+data.billStatusName+'</font>';
}

function operateRender(data,filterData){
	var operateStr = "";
	if((data.creator.id==$("#currentUserId").val()) && (data.billStatus=="SAVE" || data.billStatus=="REVOKE" || data.billStatus=="REJECT")){
		operateStr = '<a href="javascript:editRow({id:\''+data.id+'\',type:\''+data.type+'\'});" class="modify_font">编辑</a>|<a href="javascript:deleteRow({id:\''+data.id+'\'});" class="delete_font">删除</a>';
	}
	if(data.billStatus == 'SUBMIT') { 
		if(operateStr){
			operateStr += " |";
		} 
		operateStr += '<a href="javascript:approveSingle(\'APPROVED\',\''+data.id+'\');" class="modify_font">审核</a>|<a href="javascript:approveSingle(\'REJECT\',\''+data.id+'\');" class="delete_font">驳回</a>';
	}
	if(data.billStatus == 'APPROVED' && $("#allBackApprove").val()=='Y') { 
		if(operateStr){
			operateStr += "  |";
		} 
		operateStr += '<a href="javascript:backApprove(\'APPROVED\',\''+data.id+'\');" class="modify_font">反审核</a>';
	}
	
	return operateStr;
}

//单个审核
function approveSingle(approveType,billId){
	
	if(!billId){
		art.dialog.tips("没有需要审核的数据！！");
		return ;
	}
	
	art.dialog.confirm("是否确认审批所选申请单？",function(){
		$.post(getPath()+"/hr/positionchange/approve",{billIds:billId,approveType:approveType},function(data){
			if(data.counter > 0){
				art.dialog.data("MSG",null);
				resetList();
			} else {
				art.dialog.tips("没有需要审核的数据！！");
			}
		},'json');
	});
}

//反审核
function backApprove(approveType,billId){
	
	if(!billId){
		art.dialog.tips("没有需要反审核的数据！！");
		return ;
	}
	art.dialog.confirm("反审核可能会影响业务数据,是否确认执行反审核？",function(){ 
		$.post(getPath()+"/hr/positionchange/backApprove",{billId:billId,approveType:approveType},function(data){
			if(data.STATE == "SUCCESS"){
				art.dialog.data("MSG",null);
				resetList();
			} else {
				art.dialog.tips(data.MSG);
			}
		},'json');
	});
}

function f_isChecked(rowdata){
	if(rowdata.billStatus == 'SUBMIT') {       
		return true;   
	}
	return false;       
}

function bindEvent(){
	
	//审核按钮
	$("#approveBtn").bind("click",function(){
		approve("APPROVED");
	});
	
	//撤销按钮
	/*$("#revokeBtn").bind("click",function(){
		approve("REVOKE");
	});*/
	
	//驳回按钮
	$("#rejectBtn").bind("click",function(){
		approve("REJECT");
	});
	
	//批量编辑按钮
	$("#editBtn").bind("click",function(){
		editRows();
	});
	
	//新增
	$("#toAddBtn").bind("click",addRow);
	//清空
	$("#resetBtn").click(function(){
		MenuManager.menus["effectdate"].resetAll();
		clearDataPicker('orgF7');
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
		$("#orgName").val($("#orgName").attr("defaultValue"));
		$("#orgId").val($("#orgId").attr("defaultValue"));
		$("#longNumber").val($("#longNumber").attr("defaultValue"));
		$("#billStatus").find("option").first().attr("selected","selected");
		$("#dateType").find("option").first().attr("selected","selected");
	});
	
	eventFun($("#keyConditions"));
	eventFun($("#orgName"));
	
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	
	$("#keyConditions").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
}


function approve(approveType){
	var bills = manager.getSelectedRows();
	var billIds = "";
	for(var i in bills){
		if(bills[i].billStatus == 'SUBMIT'){
			if(!billIds){
				billIds = bills[i].id;
			}else{
				billIds += (","+ bills[i].id);
			}
		}
	};
	
	var tipTitle = "审核";
	if("REJECT"==approveType){
		tipTitle = "驳回";
	}
	
	if(!billIds){
		art.dialog.tips("没有需要"+tipTitle+"的数据！！");
		return ;
	}
	
	art.dialog.confirm("是否确认"+tipTitle+"所选申请单？",function(){
		$.post(getPath()+"/hr/positionchange/approve",{billIds:billIds,approveType:approveType},function(data){
			if(data.counter > 0){
				art.dialog.data("MSG",null);
				resetList();
			} else {
				art.dialog.tips("没有需要审核的数据！！");
			}
		},'json');
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

function changeOrg(oldValue,newValue,doc){
	$("#longNumber").val(newValue.longNumber||'');
}

function searchData(){
	
	$list_dataParam['changeType'] = "TRANSFER";
	$list_dataParam['orderByClause'] = " phb.FCREATE_TIME desc";
	
	//日期范围类型
	var dateType = $('#dateType').val();
	$list_dataParam['dateType'] = dateType;
	
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
	/*var changeOrgId = $('#orgId').val();
	if(changeOrgId != null && changeOrgId != ""){
		$list_dataParam['changeOrgId'] = changeOrgId;
	}else{
		delete $list_dataParam['changeOrgId'];
	}*/
	
	var longNumber =  $("#longNumber").val();
	if(longNumber != null && longNumber != ""){
		$list_dataParam['longNumber'] = longNumber;
	}else{
		delete $list_dataParam['longNumber'];
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

function addRow(source){ 
	if($list_addUrl && $list_addUrl!=''){
		var paramStr = '';
		if($list_addUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		if(typeof(getAddRowParam) == "function"){
			var param = getAddRowParam();
			//临时增加不满足则不打开窗口
			if(param=='notValidate') return;
			if(param){
				for(var p in param){
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_addUrl+paramStr,
				{title:getTitle('ADD'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'提交',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this,"SUBMIT");
						}
						return false;
					}},{name:'保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this,"SAVE");
						}
						return false;
					}},{name:'取消',callback:function(){
						//dlg.iframe.contentWindow.saveAdd(this,"CANCEL");
						flag = false;
						return true;
					}}],
				 close:function(){
					 if(flag){
						 if(typeof(afterAddRow)=='function'){
							 afterAddRow();
						 }
						 resetList();
					 }
				 }
				});
	}
}

//批量编辑
function editRows(){
	var bills = manager.getSelectedRows();
	var billIds = "";
	for(var i in bills){
		if((bills[i].creator.id==$("#currentUserId").val()) 
				&&(bills[i].billStatus=="SAVE" || bills[i].billStatus=="REVOKE" || bills[i].billStatus=="REJECT")){
			if(!billIds){
				billIds = ("'"+bills[i].id+"'");
			}else{
				billIds += (","+ "'"+bills[i].id+"'");
			}
		}
	};
	
	if(!billIds){
		art.dialog.tips("请选择要编辑的数据！！");
		return ;
	}
	editRow({billIds:billIds});
}

function editRow(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT';
		}else{
			paramStr = '?VIEWSTATE=EDIT';
		}
		if(rowData.billIds){
			paramStr += "&billIds="+rowData.billIds;
		}
		if(rowData.id){
			paramStr += "&id="+rowData.id;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[{name:'提交',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this,"SUBMIT");
						}
						return false;
					}},{name:'保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this,"SAVE");
						}
						return false;
					}},{name:'取消',callback:function(){
						//dlg.iframe.contentWindow.saveAdd(this,"CANCEL");
						flag = false;
						return true;
					}}], 	
				 close:function(){
					
					 if(flag){
						 if(typeof(afterEditRow)=='function'){
							 afterEditRow();
						 }
						 refresh();
					 }
				 }
				});
	}
}


//查看行
function viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.id;
		}
		var buttons = [];
		if(rowData.billStatus == 'SUBMIT'){
			buttons.push({name:'审核',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.approveSingle){
					dlg.iframe.contentWindow.approveSingle(this,"APPROVED",rowData.billStatus);
				}
				return false;
			}});
			buttons.push({name:'驳回',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.approveSingle){
					dlg.iframe.contentWindow.approveSingle(this,"REJECT",rowData.billStatus);
				}
				return false;
			}});
		}
		buttons.push({name:'关闭'});
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:buttons}
		);
	}
}
