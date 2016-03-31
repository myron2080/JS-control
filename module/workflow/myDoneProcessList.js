$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:300,allowLeftResize:false,allowRightResize:false});
	$("#toolBar").ligerToolBar({
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
	          {display: '操作', name: 'operate', align: 'center', width: 150,render:function(data){
	        	  var r = '<a href="javascript:viewProcessChart(\''+data.processInstanceId+'\')">流程图</a>';
	        	  r += '|<a href="javascript:auditHistory(\''+data.processInstanceId+'\')">审批历史</a>';
	        	  return r;
	          }},
			{display: '主题', name: 'title', align: 'left', width: 420},
            {display: '当前处理人', name: 'currentDuePerson', align: 'left', width: 120,render:function(data){
            	if(data['currentDuePerson']!=null && data['currentDuePerson'].length > 0){
            		var p = "";
            		for(var i = 0; i < data['currentDuePerson'].length;i++){
            			p+=data['currentDuePerson'][i].name+"&nbsp";
            		}
            		return p;
            	}
            	return "";
            }},
            {display: '发起人', name: 'startUser.name', align: 'left', width: 120},
            {display: '发起部门', name: 'org.name', align: 'left', width: 120},
            {display: '发起时间', name: 'startTime', align: 'center', width: 150},
            {display: '流程状态', name: 'execution.suspended', align: 'center', width:50,render:function(data,filedData){
            	if(data.execution != null){
            		if(data.execution.suspensionState == 1){
            			return '<span style="color:blue;">运行中</span>';
            		}else{
            			return '<span style="color:red;">己挂起</span>';
            		}
            	}else{
            		return '<span style="color:gray;">己结束</span>';
            	}
            }}
        ],
        url:getPath()+'/workflow/process/myDoneProcessData'
    }));
});

function viewProcessChart(processId){
	art.dialog.open(getPath()+"/workflow/process/processChart?process=" + processId,{
		title:'查看流程图',
		id:'viewProcessChart',
		width:'auto',
		height:'auto',
		lock:true,
		button:[{name:'确定'}]
	});
}

function auditHistory(processId){
	art.dialog.open(getPath()+"/workflow/auditHistory/list?process=" + processId,{
		title:'审批历史',
		id:'auditHistory',
		width:'550px',
		height:'320px',
		lock:true,
		button:[{name:'确定'}]
	});
}