$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:300,allowLeftResize:false,allowRightResize:false});
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'view',text:'查看流程图',click:viewProcessChart,icon:'memeber'},
		       {id:'history',text:'审批历史',click:auditHistory,icon:'search2'}
		]
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '流程', name: 'variables.title', align: 'left', width: 420},
            {display: '发起人', name: 'variables.initiator.name', align: 'left', width: 120},
            {display: '发起部门', name: 'variables.org.name', align: 'left', width: 120},
            {display: '发起时间', name: 'variables.variables.createTime', align: 'center', width: 150}
        ],
        url:getPath()+'/workflow/process/historyListData'
    }));
});

function referedProc(){
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		dlg = art.dialog.open(getPath()+"/workflow/task/toRefered?VIEWSTATE=EDIT&id=" + row.processId,{
			title:'转交',
			id:'referedTasks',
			width:'420px',
			height:'160px',
			lock:true,
			button:[{
				name:'确定',
				callback:function(){
					art.dialog.confirm("确定转交?",function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(dlg);
						}
					});
					return false;
				}
			},{
				name:"取消"
			}]
		});
	}else{
		art.dialog.tips('请先选择流程');
	}
}

function startDemo(){
	$.post(getPath() + "/workflow/process/startDemo",{},function (res){
		if(res.STATE=='SUCCESS'){
			art.dialog.tips('启动成功',null,"succeed");
			refresh();
		}else{
			art.dialog.alert('启动失败');
		}
	},'json');
	
}

function viewProcessChart(){
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		art.dialog.open(getPath()+"/workflow/process/processChart?process=" + row.processId,{
			title:'查看流程图',
			id:'viewProcessChart',
			width:'auto',
			height:'auto',
			lock:true,
			button:[{name:'确定'}]
		});
	}else{
		art.dialog.tips('请先选择流程');
	}
}

function auditHistory(){
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		art.dialog.open(getPath()+"/workflow/auditHistory/list?process=" + row.processId,{
			title:'审批历史',
			id:'auditHistory',
			width:'550px',
			height:'320px',
			lock:true,
			button:[{name:'确定'}]
		});
	}else{
		art.dialog.tips('请先选择流程');
	}
}
