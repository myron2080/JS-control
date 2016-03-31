$list_editUrl = getPath()+"/hr/ask4Leave/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/ask4Leave/add";//新增url
$list_deleteUrl = getPath()+"/hr/ask4Leave/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "256px";
$list_dataType = "请假管理";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                {display: '单据编号', name: 'billNumber', align: 'left', width:150},
      			{display: '姓名', name: 'applyPerson.name', align: 'left', width:80},
      			{display: '部门', name: 'applyPerson.org.name', align: 'left', width:80 },
      			{display: '岗位', name: 'personPosition.name', align: 'left', width:120 },
      			{display: '请假类型', name: 'ask4LeaveType.name', align: 'left', width: 60 },
      			{display: '请假开始时间', name: 'ask4LeaveStartTime', align: 'left', width:80 },
      			{display: '请假结束时间', name: 'ask4LeaveEndTime', align: 'left', width: 80},
      			{display: '请假天数', name: 'leaveDays', align: 'left', width:60},
      			{display: '请假事由', name: 'reasons4Leave', align: 'left', width: 200},
      			{display: '请假日期', name: 'submitDate', align: 'left', width: 80},
      			{display: '请假状态', name: 'ask4LeaveStatus.name', align: 'left', width: 60,render:statusRender},
      			{display: '销假状态', name: 'cLeave.leaveClearanceStatus.name', align: 'left', width: 60,render:clearanceStatusRender},
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/hr/ask4Leave/listData',
        delayLoad:false
    }));
	$("#selectData").click(function(){
		selectList();
	});
	$("#addNew").click(function(){
		beforeAddRow();
	});
	//清除
	$("#clearData").click(function(){	
		$("#ask4LeaveType").val("—请假类型—");
		$("#ask4LeaveStatus").val("—请假状态—");
		MenuManager.menus["createTime"].resetAll();
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	});
	eventFun($("#keyConditions"));
});
function queryLeave(){
	var dlg = art.dialog.open(getPath()+'/hr/ask4Leave/queryLeave',{
		 title:'销假申请',
		 lock:true,
		 width:'800px',
		 height:'320px',
		 id:"queryLeave",
		 button:[{name:'关闭'}]
		});
}
var clearanceLeaveFlag=false;
function clearanceStatusRender(data,rowIndex){
	var clearanceStatus;
	if(data.cLeave!=null){
	clearanceStatus=data.cLeave.leaveClearanceStatus.value;
	var className = "modify_font";
	if(clearanceStatus == 'SAVE'){
	}else if(clearanceStatus == 'SUBMIT'){
		className = "approve_font";
	}else if(clearanceStatus == 'APPROVED'){
		className = "approve_font01";
		clearanceLeaveFlag=true;
	}else if(clearanceStatus == 'REVOKE'){
		className = "modify_font";
	}else if(clearanceStatus == 'REJECT'){
		className = "delete_font";
	}else{
		className = "modify_font";
	}
	return '<font class="'+className+'">'+data.cLeave.leaveClearanceStatus.name+'</font>';}
}
function statusRender(data,rowIndex){
	var className = "modify_font";
	if(data.ask4LeaveStatus.value == 'SAVE'){
	}else if(data.ask4LeaveStatus.value == 'SUBMIT'){
		className = "approve_font";
	}else if(data.ask4LeaveStatus.value == 'APPROVED'){
		className = "approve_font01";
	}else if(data.ask4LeaveStatus.value == 'REVOKE'){
		className = "modify_font";
	}else if(data.ask4LeaveStatus.value == 'REJECT'){
		className = "delete_font";
	}else{
		className = "modify_font";
	}
	return '<font class="'+className+'">'+data.ask4LeaveStatus.name+'</font>';
}

function operateRender(data,filterData){
	var operateStr = "";
	if((data.creator.id==$("#currentUserId").val()) && (data.ask4LeaveStatus.value=="SAVE" || data.ask4LeaveStatus.value=="REVOKE" || data.ask4LeaveStatus.value=="REJECT")){
		operateStr = '<a href="javascript:editRow({id:\''+data.id+'\'});" class="modify_font">编辑</a>|<a href="javascript:deleteRow({id:\''+data.id+'\'});" class="delete_font">删除</a>';
	//editRow({id:\''+data.id+'\',type:\''+data.type+'\'});
	}else if(data.ask4LeaveStatus.value == 'SUBMIT') { 
		if(operateStr){
			operateStr += " |";
		} 
		operateStr += '<a href="javascript:approveSingle(\'APPROVED\',\''+data.id+'\');" class="modify_font">审核</a>|<a href="javascript:approveSingle(\'REJECT\',\''+data.id+'\');" class="delete_font">驳回</a>';
	}else if(data.creator.id==$("#currentUserId").val() && data.ask4LeaveStatus.value == 'APPROVED') { 
		if(operateStr){
			operateStr += " |";
		} 
		if(data.cLeave==null){
		operateStr += '<a href="javascript:clearanceLeave(\''+data.id+'\');">销假</a>';}
	}
	return operateStr;
}

/*function bindEvent(){
	
	//审核按钮
	$("#approveBtn").bind("click",function(){
		approve("APPROVED");
	});
	
	//撤销按钮
	$("#revokeBtn").bind("click",function(){
		approve("REVOKE");
	});
	
	//驳回按钮
	$("#rejectBtn").bind("click",function(){
		approve("REJECT");
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
}*/



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
		$.post(getPath()+"/hr/ask4Leave/approve",{billIds:billIds,approveType:approveType},function(data){
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
		$.post(getPath()+"/hr/ask4Leave/approve",{billIds:billId,approveType:approveType},function(data){
			if(data.counter > 0){
				art.dialog.data("MSG",null);
				resetList();
			} else {
				art.dialog.tips("没有需要审核的数据！！");
			}
		},'json');
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
function clearanceLeave(id){
	var flag = true;
	var dlg = art.dialog.open(getPath()+"/hr/clearanceLeave/add?leaveId="+id,{
		 title:'销假申请',
		 lock:true,
		 width:'520px',
		 height:'350px',
		 id:"clearanceLeave",
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

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//请假类型
	var queryAsk4LeaveType= $("#ask4LeaveType").val();
	//请假状态
	var queryAsk4LeaveStatus= $("#ask4LeaveStatus").val();
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
	if(queryAsk4LeaveStatus == '' || queryAsk4LeaveStatus == null){
		delete $list_dataParam['queryAsk4LeaveStatus'];
	} else{
		$list_dataParam['queryAsk4LeaveStatus'] = queryAsk4LeaveStatus;
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
