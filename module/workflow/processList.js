var queryType = "";
$(document).ready(function(){
	$("div[class=system_tab_title] li").click(function(){
		$(this).addClass("hover").siblings("li").removeClass("hover");
		queryType = $(this).attr("id");
		searchData();
	});
	params ={};
	params.inputTitle = "范围";	
	MenuManager.common.create("DateRangeMenu","startTime",params);  
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
			{display: '操作', name: 'operate', align: 'left', width: 220,render:function(data){
				var r = '<a href="javascript:viewProcessChart(\''+data.processInstanceId+'\')">流程图</a>';
				r += ' | <a href="javascript:auditHistory(\''+data.processInstanceId+'\')">审批历史</a>';
				if(data.execution){
					r += ' | <a href="javascript:referedProc(\''+data.processInstanceId+'\')">转交</a>';
					if(data.execution.suspensionState == 1){
						r += ' | <a href="javascript:suppendProcess(\''+data.processInstanceId+'\')">挂起</a>';
					}else{
						r += ' | <a href="javascript:toActivateProcess(\''+data.processInstanceId+'\')">激活</a>';
					}
				}
				return r;
			}},
			{display: '流程状态', name: 'execution.suspended', align: 'center', width:50,render:function(data,filedData){
            	if(data.execution != null){
            		if(data.execution.suspensionState == 1){
            			return '正常';
            		}else{
            			return '挂起';
            		}
            	}else{
            		return '结束';
            	}
            }},
            {display: '主题', name: 'title', align: 'left', width: 420,render:function(data){
            	 
            	return '<a href="javascript:void(0);" onclick="processView(\''+data.processInstanceId+'\',\''+data.businessKey+'\',\''+data.processType+'\')">'+data.title+'</a>';
            	}},
            {display: '发起人', name: 'startUser.name', align: 'left', width: 100,render:function(data){return data.startUser.name}},
            {display: '发起部门', name: 'org.name', align: 'left', width: 100,render:function(data){return data.org.name}},
            {display: '发起时间', name: 'startTime', align: 'center', width: 150},
            {display: '当前处理人', name: 'currentDuePerson', align: 'left', width: 100,render:function(data){
            	if(queryType=="end"){
            		return "";
            	}
            	if(data['currentDuePerson']!=null && data['currentDuePerson'].length > 0){
            		var p = "";
            		for(var i = 0; i < data['currentDuePerson'].length;i++){
            			p+=data['currentDuePerson'][i].name+"&nbsp";
            		}
            		return p;
            	}
            	return "";
            }},{display: '当前接收时间', name: 'currentDuePerson', align: 'left', width: 150,render:function(data){
            	if(queryType=="end"){
            		return "";
            	}
            	if(data['currentDuePerson']!=null && data['currentDuePerson'].length > 0){
            		var p = "";
            		for(var i = 0; i < data['currentDuePerson'].length;i++){
            			p+=data['currentDuePerson'][i].createTime+"&nbsp";
            		}
            		return p;
            	}
            	return "";
            }}
        ],
        url:getPath()+'/workflow/process/listData' ,
        delayLoad:true,
        onBeforeShowData:function(data){
        	$(".hover span[name='count']").text("("+data.recordCount+")");
        	searchDataCount();
        },
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	 
        	processView(rowData.processInstanceId,rowData.businessKey,rowData.processType);
        }
    }));
	searchData();
});

function searchData(){
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["startTime"]){
		queryStartDate = MenuManager.menus["startTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["startTime"].getValue().timeEndValue;
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
	
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	var procdefName = $("#procdefName").val();
	$list_dataParam['procdefName'] = procdefName;
	var suspensionState = $(".hover").attr("id"); 
	$list_dataParam['suspensionState'] = suspensionState;
	resetList();
}

function searchDataCount(){
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["startTime"]){
		queryStartDate = MenuManager.menus["startTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["startTime"].getValue().timeEndValue;
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
	
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	
	var procdefName = $("#procdefName").val();
	$list_dataParam['procdefName'] = procdefName;
	
	var suspensionState = $(".hover").attr("id");
	var suspensionState1 ;
	var suspensionState2 ;
	//suspensionState = suspensionState == "approving"?"approving":"end";
	if(suspensionState == "approving"){
		suspensionState1 = "suppend";
		suspensionState2 = "end";
	}else if(suspensionState == "suppend"){
		suspensionState1 = "approving";
		suspensionState2 = "end";
	}else if(suspensionState == "end"){
		suspensionState1 = "suppend";
		suspensionState2 = "approving";
	}
	$list_dataParam['suspensionState'] = suspensionState1; 
	$.post(getPath()+"/workflow/process/getProcessCount",$list_dataParam,function(data){
		$("#"+suspensionState1+" span[name='count']").text("("+data+")");
	},'json');
	$list_dataParam['suspensionState'] = suspensionState2; 
	$.post(getPath()+"/workflow/process/getProcessCount",$list_dataParam,function(data){
		$("#"+suspensionState2+" span[name='count']").text("("+data+")");
	},'json');
	$list_dataParam['suspensionState'] = suspensionState; 
}

////清空
function resetCond(){
	MenuManager.menus["startTime"].resetAll();
	$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
} 

function viewProcessChart(processId){
	art.dialog.open(getPath()+"/workflow/process/processChart?process=" + processId,{
		title:'查看流程图',
		id:'viewProcessChart',
		width:'auto',
		height:'600px',
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

function referedProc(processInstanceId){
	var flag = false;
	dlg = art.dialog.open(getPath()+"/workflow/task/toRefered?VIEWSTATE=EDIT&id=" + processInstanceId,{
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
						flag = true;
					}
				});
				return false;
			}
		},{
			name:"取消"
		}],
		close:function(){
			if(flag){
				refresh();
			}
		}
	});
}
//挂起
function suppendProcess(process){
	art.dialog.confirm("确定挂起?",function(){
		$.post(getPath()+"/workflow/task/suppendProcess?id=" + process,{},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips("挂起成功",null,"succeed");
				refresh();
			}else{
				art.dialog.alert("挂起失败！");
			}
		},'json');
	});
}


function toActivateProcess(process){
	var flag = false;
	dlg = art.dialog.open(getPath()+"/workflow/task/toActivateProcess?id=" + process,{
		title:'激活',
		id:'toActivateProcess',
		width:'420px',
		height:'160px',
		lock:true,
		button:[{
			name:'确定',
			callback:function(){
				art.dialog.confirm("确定激活?",function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveActivateProcess){
						dlg.iframe.contentWindow.saveActivateProcess(dlg);
						flag = true;
					}
				});
				return false;
			}
		},{
			name:"取消"
		}],
		close:function(){
			if(flag){
				refresh();
			}
		}
	});
}

function activateProcess(process){
	art.dialog.confirm("确定激活?",function(){
		$.post(getPath()+"/workflow/task/activateProcess?id=" + process,{},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips("激活成功",null,"succeed");
				refresh();
			}else{
				art.dialog.alert("激活失败！");
			}
		},'json');
	});
}



function processView(processInstanceId,id,processType){

	if(processInstanceId&& "COUNTERSIGN"!=processType){	
	 
		dlg = art.dialog.open(getPath()+"/workflow/task/toProcessView?VIEWSTATE=EDIT&id=" + processInstanceId,
				{title:"流程查看",
			lock:true,
			width:960,
			height:580,
			id:"dealProcess",
			close:function(){
				 
			}
			});
	}else{
		viewProcess(id,processType);
	}
}


function viewProcess(id,processType){
	var url = "";
	var w = 0,h=0;
	if("ENROLL"==processType){
		url = getPath()+'/hr/employeeOrientation/edit?VIEWSTATE=VIEW&id='+id;
		w=900;
		h=600;
	}else if("TRANSFER"==processType){
		url = getPath()+'/hr/positionchange/edit?VIEWSTATE=VIEW&id='+id;
		w=750;
		h=350;
	}else if("PROMOTION"==processType){
		url = getPath()+'/hr/positionpromotion/edit?VIEWSTATE=VIEW&id='+id;
		w=750;
		h=350;
	}else if("DEMOTION"==processType){
		url = getPath()+'/hr/positiondemotion/edit?VIEWSTATE=VIEW&id='+id;
		w=750;
		h=350;
	}else if("INCREASE_PARTTIMEJOB"==processType){
		url = getPath()+'/hr/positionincreaseptjob/edit?VIEWSTATE=VIEW&id='+id;
		w=750;
		h=350;
	}else if("DISMISS_PARTTIMEJOB"==processType){
		url = getPath()+'/hr/positiondismissptjob/edit?VIEWSTATE=VIEW&id='+id;
		w=750;
		h=350;
	}else if("LEAVE"==processType){
		url = getPath()+'/hr/affair/leaveOffice/edit?VIEWSTATE=VIEW&id='+id;
		w=1000;
		h=350;
	}else if("POSITIVE"==processType){
		url = getPath()+'/hr/affair/positive/edit?VIEWSTATE=VIEW&id='+id;
		w=1000;
		h=450;
	}else if("REINSTATEMENT"==processType){
		url = getPath()+'/hr/affair/reinstatement/edit?VIEWSTATE=VIEW&id='+id;
		w=1000;
		h=350;
	}else if("RUNDISK"==processType){
		url = getPath()+'/hr/employeerundiskbill/edit?VIEWSTATE=VIEW&id='+id;
		w=750;
		h=350;
	}else if("DELRUNDISK"==processType){
		url = getPath()+'/hr/employeedelrundisk/edit?VIEWSTATE=VIEW&id='+id;
		w=750;
		h=350;
	}else if("COUNTERSIGN"==processType){
		url = getPath()+'/interflow/sign/signView?doType=view&signId='+id;
		w=803;
		h=580;
	}else if("ASK4LEAVE"==processType){
		url = getPath()+'/hr/ask4Leave/edit?VIEWSTATE=VIEW&id='+id;
		w=500;
		h=256;
	}else if("CLEARANCELEAVE"==processType){
		url = getPath()+'/hr/clearanceLeave/edit?VIEWSTATE=VIEW&id='+id;
		w=500;
		h=350;
	}else if("EXPENSE"==processType){
		url = getPath()+'/cost/expense/edit?VIEWSTATE=VIEW&id='+id;
		w=880;
		h=520;
	}
	
	viewProcessApply(url,w,h);
}

function viewProcessApply(url,w,h,resizeFlag){


	if(resizeFlag){
		if(h > ($(window).height()-150)){
			h = ($(window).height()-150) + "px";
		} else {
			h = h+"px";
		}
	}
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:'查看',
			 lock:true,
			 width:w,
			 height:h,
			 id:"viewProcess",
			 button:[{name:'关闭'}]
			});
}
