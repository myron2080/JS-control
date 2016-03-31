$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:300,allowLeftResize:false,allowRightResize:false});
	$("#toolBar").ligerToolBar({
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
              {display: '操作', name: 'operate', align: 'center', width: 150,render:function(data){
            	  var r = '<a href="javascript:dealProcess(\''+data.id+'\');">处理</a>';
            	  r += '|<a href="javascript:viewProcessChart(\''+data.processInstanceId+'\')">流程图</a>';
            	  r += '|<a href="javascript:auditHistory(\''+data.processInstanceId+'\')">审批历史</a>';
            	  return r;
              }},
			{display: '主题', name: 'execution.title', align: 'left', width: 420},
			{display: '发起人', name: 'execution.initiator.name', align: 'left', width: 120},
			{display: '发起部门', name: 'execution.org.name', align: 'left', width: 120},
			{display: '开始时间', name: 'execution.createTime', align: 'center', width: 150}
        ],
        url:getPath()+'/workflow/process/myToDoProcessData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	dealProcess(rowData.id);
        }
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

function dealProcess(taskId){
	var datas = $list_dataGrid.getData();
	if(datas && datas.length > 0){
		var taskDescription;
		for(var i = 0; i < datas.length; i++){
			if(datas[i].id==taskId){
				taskDescription = datas[i].description;
				break;
			}
		}
		var dlg;
		if(taskDescription && taskDescription.substr(0,10)=='executeJs:'){
			eval(taskDescription.substr(10));
		}else{
			var flag = true;
			dlg = art.dialog.open(getPath()+"/workflow/task/toTask?VIEWSTATE=EDIT&id=" + taskId,
					{title:"任务处理",
				lock:true,
				width:960,
				height:580,
				id:"dealProcess",
				close:function(){
					refresh();
				}
				});
		}
	}
}

function referedPerson(oldValue,newValue,doc){
	art.dialog.confirm("确定转交?",function(){
		$.post(getPath()+"/workflow/task/refered",{id:$('#taskId').val(),to:newValue.id},function(res){
			if(res.STATE="SUCCESS"){
				art.dialog.tips("转交成功");
				refresh();
			}else{
				art.dialog.tips(res.MSG);
			}
		});
	});
}
