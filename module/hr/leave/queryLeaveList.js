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
                {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender}, 
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
      			
        ],
        url:getPath()+'/hr/ask4Leave/listData?queryAsk4LeaveStatus=APPROVED&&queryClearanceStatus=queryLeave&&creatorId='+creatorId,
        delayLoad:false
    }));
	$("#selectData").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){	
		$("#ask4LeaveType").val("—请假类型—");
		MenuManager.menus["createTime"].resetAll();
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	});
	eventFun($("#keyConditions"));
});
function queryLeave(){
	var dlg = art.dialog.open(getPath()+'/hr/ask4Leave/queryLeave',{
		 title:'销假申请',
		 lock:true,
		 width:'520px',
		 height:'320px',
		 id:"queryLeave",
		 button:[{name:'关闭'}]
		});
}
var clearanceLeaveFlag=false;
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
