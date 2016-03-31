$list_editUrl = getPath()+"/hr/clearanceLeave/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/clearanceLeave/add";//新增url
$list_deleteUrl = getPath()+"/hr/clearanceLeave/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "350px";
$list_dataType = "销假管理";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
                {display: '单据编号', name: 'billNumber', align: 'left', width:150},
      			{display: '姓名', name: 'leave.applyPerson.name', align: 'left', width:130},
      			{display: '部门', name: 'leave.applyPerson.org.name', align: 'left', width:80 },
      			{display: '岗位', name: 'leave.personPosition.name', align: 'left', width:80 },
      			{display: '请假类型', name: 'leave.ask4LeaveType.name', align: 'left', width: 60},
      			{display: '实际开始时间', name: 'actualStartTime', align: 'left', width:80 },
      			{display: '实际结束时间', name: 'actualEndTime', align: 'left', width: 80},
      			{display: '请假天数', name: 'actualLeaveDays', align: 'left', width:60},
      			{display: '销假事由', name: 'reasons4Cleareance', align: 'left', width: 200},
      			{display: '销假状态', name: 'leaveClearanceStatus.name', align: 'left', width: 120,render:statusRender},
      			{display: '销假日期', name: 'submitDate', align: 'left', width: 80},
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/hr/clearanceLeave/listData',
        delayLoad:false
    }));
	$("#selectData").click(function(){
		selectList();
	});
	$("#addNoteApply").click(function(){
		beforeAddRow();
	});
	//清除
	$("#clearData").click(function(){	
		
		$("#ask4LeaveType").val("—请假类型—");
		$("#leaveClearanceStatus").val("—请假状态—");
		MenuManager.menus["createTime"].resetAll();
	});
	eventFun($("#keyConditions"));
});
function statusRender(data,rowIndex){
	var className = "modify_font";
	if(data.leaveClearanceStatus.value == 'SAVE'){
	}else if(data.leaveClearanceStatus.value == 'SUBMIT'){
		className = "approve_font";
	}else if(data.leaveClearanceStatus.value == 'APPROVED'){
		className = "approve_font01";
	}else if(data.leaveClearanceStatus.value == 'REVOKE'){
		className = "modify_font";
	}else if(data.leaveClearanceStatus.value == 'REJECT'){
		className = "delete_font";
	}else{
		className = "modify_font";
	}
	return '<font class="'+className+'">'+data.leaveClearanceStatus.name+'</font>';
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

function approve(approveType){
	var bills = manager.getSelectedRows();
	var billIds = "";
	for(var i in bills){
		if(bills[i].billStatus.value == 'SUBMIT'){
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
		$.post(getPath()+"/hr/clearanceLeave/approve",{billIds:billIds,approveType:approveType},function(data){
			if(data.counter > 0){
				art.dialog.data("MSG",null);
				resetList();
			} else {
				art.dialog.tips("没有需要审核的数据！！");
			}
		},'json');
	});
}
//单个审核
function approveSingle(approveType,billId){
	
	if(!billId){
		art.dialog.tips("没有需要审核的数据！！");
		return ;
	}
	
	art.dialog.confirm("是否确认审批所选申请单？",function(){
		$.post(getPath()+"/hr/clearanceLeave/approve",{billIds:billId,approveType:approveType},function(data){
			if(data.counter > 0){
				art.dialog.data("MSG",null);
				resetList();
			} else {
				art.dialog.tips("没有需要审核的数据！！");
			}
		},'json');
	});
}
function operateRender(data,filterData){
	var operateStr = "";
	if((data.creator.id==$("#currentUserId").val()) && (data.leaveClearanceStatus.value=="SAVE" || data.leaveClearanceStatus.value=="REVOKE" || data.leaveClearanceStatus.value=="REJECT")){
		operateStr = '<a href="javascript:editRow({id:\''+data.id+'\'});" class="modify_font">编辑</a>|<a href="javascript:deleteRow({id:\''+data.id+'\'});" class="delete_font">删除</a>';
	//editRow({id:\''+data.id+'\',type:\''+data.type+'\'});
	}else if(data.leaveClearanceStatus.value == 'SUBMIT') { 
		if(operateStr){
			operateStr += " |";
		} 
		operateStr += '<a href="javascript:approveSingle(\'APPROVED\',\''+data.id+'\');" class="modify_font">审核</a>|<a href="javascript:approveSingle(\'REJECT\',\''+data.id+'\');" class="delete_font">驳回</a>';
	}
	return operateStr;
}
function clearance(data){
	art.dialog.confirm('确定销假?',function(){
	$.post(getPath()+"/hr/clearanceLeave/clearance",data,function(res){
		if(res.STATE=="SUCCESS"){
			art.dialog.tips(res.MSG,null,"succeed");
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
	return true;
	},function(){
		return true;
	});
}

function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	addRow({});
}

//新增
$("#addNoteApply").click(function(){
	alert("新增");
	beforeAddRow();
});
/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//请假类型
	var queryAsk4LeaveType= $("#ask4LeaveType").val();
	//销假状态
	var queryLeaveClearanceStatus= $("#leaveClearanceStatus").val();
	//归属时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	//查询请假类型
	if(queryAsk4LeaveType == '' || queryAsk4LeaveType == null){
		delete $list_dataParam['queryAsk4LeaveType'];
	} else{
		$list_dataParam['queryAsk4LeaveType'] = queryAsk4LeaveType;
	}
	//查询请假状态
	if(queryLeaveClearanceStatus == '' || queryLeaveClearanceStatus == null){
		delete $list_dataParam['queryLeaveClearanceStatus'];
	} else{
		$list_dataParam['queryLeaveClearanceStatus'] = queryLeaveClearanceStatus;
	}
	//关键字条件 [单据编号/姓名/部门/岗位]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	resetList();
}
function editRow(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
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
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
