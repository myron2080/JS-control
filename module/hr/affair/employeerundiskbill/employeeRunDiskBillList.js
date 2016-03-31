$list_editUrl = getPath()+"/hr/employeerundiskbill/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/employeerundiskbill/add";//新增及查看url
$list_deleteUrl = getPath()+"/hr/employeerundiskbill/delete";//删除url
$list_dataType = "跑盘员";
$list_editWidth =700;
$list_editHeight = 400;
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
            {display: '单据状态', name: 'billStatus.label',align: 'left', width: 65,render:statusRender},
            {display: '员工编号', name: 'number', align: 'left', width: 120},
            {display: '员工姓名', name: 'name', align: 'left', width: 100},
            {display: '性别', name: 'sex.name', align: 'left', width: 80},
            {display: '部门', name: 'mainPositionOrg.name', align: 'left', width: 120},
            {display: '身份证号', name: 'idCard', align: 'center', width: 150},
            {display: '手机号码', name: 'phone', align: 'center', width: 120},
            {display: '创建日期', name: 'createTime', align: 'left', width: 75,dateFormat:"yyyy-MM-dd",formatters:"date"},
            {display: '生效日期', name: 'effectdate', align: 'left', width: 100,dateFormat:"yyyy-MM-dd",formatters:"date"} 
        ],
        fixedCellHeight:false,
        isScroll: true, checkbox:true,rownumbers:true,
        isChecked: f_isChecked,
        delayLoad:true,
       // height: '95%',
        url:getPath()+'/hr/employeerundiskbill/listData'
    		
    }));
	searchData();
	bindEvent();
});

function statusRender(data,rowIndex){
	var className = "modify_font";
	if(data.billStatus.value == 'SAVE'){
		
	}else if(data.billStatus.value == 'SUBMIT'){
		className = "approve_font";
	}else if(data.billStatus.value == 'APPROVED'){
		className = "approve_font01";
	}else if(data.billStatus.value == 'REVOKE'){
		className = "modify_font";
	}else if(data.billStatus.value == 'REJECT'){
		className = "delete_font";
	}else{
		className = "modify_font";
	}
	return '<font class="'+className+'">'+data.billStatus.label+'</font>';
}

function operateRender(data,filterData){
	var operateStr = "";
	if((data.creator.id==$("#currentUserId").val()) && (data.billStatus.value=="SAVE" || data.billStatus.value=="REVOKE" || data.billStatus.value=="REJECT")){
		operateStr = '<a href="javascript:editRow({id:\''+data.id+'\',type:\''+data.type+'\'});" class="modify_font">编辑</a>|<a href="javascript:deleteRow({id:\''+data.id+'\'});" class="delete_font">删除</a>';
	}
	
	if(data.billStatus.value == 'SUBMIT'&&$("#jump").val()=='true') { 
		if(operateStr){
			operateStr += " |";
		} 
		operateStr += '<a href="javascript:approveSingle(\'APPROVED\',\''+data.id+'\');" class="modify_font">审核</a>|<a href="javascript:approveSingle(\'REJECT\',\''+data.id+'\');" class="delete_font">驳回</a>';
	}
	
	return operateStr;
}

function f_isChecked(rowdata){
	if(rowdata.billStatus.value == 'SUBMIT') {       
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
		$.post(getPath()+"/hr/employeerundiskbill/approve",{billIds:billIds,approveType:approveType},function(data){
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
		$.post(getPath()+"/hr/employeerundiskbill/approve",{billIds:billId,approveType:approveType},function(data){
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
	
	$list_dataParam['orderByClause'] = " D.FCREATETIME desc";
	
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
	 
	//跑盘员入职组织
	/*var mainPositionOrgId = $('#orgId').val();
	if(mainPositionOrgId != null && mainPositionOrgId != ""){
		$list_dataParam['mainPositionOrgId'] = mainPositionOrgId;
	}else{
		delete $list_dataParam['mainPositionOrgId'];
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
