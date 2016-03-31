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
			{display: '操作', name: 'operate', align: 'left', width: 200,frozen:'true',render:function(data){
				var r = '';
				//r += '<a href="javascript:auditHistory(\''+data.processId+'\',\''+data.processSort+'\')">审批历史</a>';
				/*if(data.processSort=='WORKFLOW'){//会签不显示流程图
					r += ' | <a href="javascript:viewProcessChart(\''+data.processId+'\')">流程图</a>';
				}*/
				if(data.processId != null && data.processId != ''){
					r += '  <a href="javascript:showProcessView(\''+data.processId+'\',\''+data.objId+'\')">流程查看</a>';
				}
				if(data.status){
					if(data.status.value == 'SUBMIT' || data.status.value == 'REJECT'  || data.status.value == 'REFERED'){
						r += ' | <a href="javascript:referedProc(\''+data.processId+'\',\''+data.processSort+'\')">转交</a>';
						r += ' | <a href="javascript:suppendProcess(\''+data.processId+'\',\''+data.processSort+'\')">挂起</a>';
					}else if(data.status.value=='SUPPEND'){
						r += ' | <a href="javascript:toActivateProcess(\''+data.processId+'\',\''+data.processSort+'\')">激活</a>';
					}
				}
				if(data.status.value != 'APPROVED'){
					var deleteLink=data.billType!=null?data.billType.deleteLink:'';
					r += ' | <a href="javascript:deleteProcess(\''+data.id+'\',\''+data.processType+'\',\''+data.objId+'\',\''+deleteLink+'\',\''+data.processSort+'\')">删除</a>';
				}
				
				return r;
			}},
			{display: '流程状态', name: 'status.value', align: 'center',frozen:'true', width:60,render:function(data,filedData){
            	if(data.status != null){
            		return data.status.name;
            	}
            	return '';
            }},
            {display: '类型', name: 'processTypeDesc', align: 'left',frozen:'true', width: 80,ender:function(data){
            	if(data.processType){
            		if(data.processType=='COUNTERSIGN'){
            			return data.huiQianType+"[会签]";
            		}else{
            			return data.processTypeDesc;
            		}
            	}
            	return "";
          }},	  
            {display: '标题', name: 'name', align: 'left', frozen:'true',width: 460,render:function(data){
            	 
            	return '<a href="javascript:void(0);" onclick="processView(\''+data.processId+'\',\''+data.objId+'\',\''+data.processSort+'\')">'+data.name+'</a>';
            	}},
            {display: '发起人', name: 'creator.name', align: 'left', width: 70,render:function(data){
            	if(data.creator){
            		return data.creator.name;
            	}
            	return "";
            }},
            {display: '发起部门', name: 'org.name', align: 'left', width: 110,render:function(data){
            	if(data.org){
            		return data.org.name;
            	}
            	return "";
            }},
            {display: '发起时间', name: 'createTime', align: 'center', width: 150},
            {display: '结束时间', name: 'endTime', align: 'center', width: 150},
            {display: '当前处理人', name: 'processman.name', align: 'left', width: 70,render:function(data){
            	if(data.processman){
            		return data.processman.name;
            	}
            	return "";
            }},{display: '当前接收时间', name: 'lastUpdateTime', align: 'left', width: 150}
        ],
        url:getPath()+'/workflow/process/listData' ,
        delayLoad:true,
        onBeforeShowData:function(data){
        	$(".hover span[name='count']").text("("+data.recordCount+")");
        	searchDataCount();
        },
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	 
        	processView(rowData.processId,rowData.objId,rowData.processType);
        }
    }));
	searchData();
});
/**
 * 流程查看
 * @param processId
 * @param processSort
 */
function showProcessView(processId,id){
	dlg = art.dialog.open(getPath()+"/workflow/task/toProcessView2?VIEWSTATE=EDIT&id=" + processId+"&objId="+id,
			{title:"流程查看",
			lock:true,
			width:800,
			height:420,
			id:"viewProcessChart",
			close:function(){}
	 });
}
/**
 * 删除流程
 * @param processId
 * @param processType
 */
function deleteProcess(processViewId,processType,objId,deleteLink,processSort){
	var url=""; 
	/*if(deleteLink!=null && deleteLink!=''){
		url=getPath()+"/"+deleteLink+objId;
	}else if(processType=='COUNTERSIGN'){ //会签单删除
		url=getPath()+"/interflow/sign/delete?id="+objId;
	}else if(processSort!='WORKFLOW'){ //使用鼎尖流程  但不是会签单的同意通用删除方法
		url=getPath()+"/djworkflow/delete";
	}else{ 
		url=getPath()+"/workflow/process/deleteByProcessView";
	} */
	  
	art.dialog.confirm("确认删除该流程？",function(){
		if((deleteLink!=null && deleteLink!='') || processType=='COUNTERSIGN'){ //如果单据删除链接不为空或者单据为会签单据 
			$.ligerDialog.confirm('是否删除业务单据？', function (yes) { 
				if(yes==true){
					if(deleteLink!=null && deleteLink!=''){
						url=getPath()+"/"+deleteLink+objId;
					}else if(processType=='COUNTERSIGN'){ //会签单删除
						url=getPath()+"/interflow/sign/delete?id="+objId;
					} 
				}else{
					if(processSort!='WORKFLOW'){ //使用鼎尖流程  但不是会签单的同意通用删除方法
						url=getPath()+"/djworkflow/delete";
					}else{ 
						url=getPath()+"/workflow/process/deleteByProcessView";
					} 
				}
				
				$.post(url,{processViewId:processViewId},function(res){
					art.dialog.tips(res.MSG);
					if(res.STATE == 'SUCCESS'){
						refresh();
					} 
			   },'json');
		   });
		}else{
			if(processSort!='WORKFLOW'){ //使用鼎尖流程  但不是会签单的同意通用删除方法
				url=getPath()+"/djworkflow/delete";
			}else{ 
				url=getPath()+"/workflow/process/deleteByProcessView";
			} 
			$.post(url,{processViewId:processViewId},function(res){
					art.dialog.tips(res.MSG);
					if(res.STATE == 'SUCCESS'){
						refresh();
					} 
			 },'json');
		}
	});
	
}

function searchData(){
	
	buildSearchParam();
	var suspensionState = $(".hover").attr("id");
	$list_dataParam['suspensionState'] = suspensionState;
	resetList();
}

function buildSearchParam(){
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
	
	var processType = $("#processType").val();
	if(processType==null || processType == ''){
		delete $list_dataParam['processType'];
		var processSort = $("#processSort").val();
		if(processSort=='HR' || processSort=='COST'){
			var processTypes="";
			$("#processType option[value!='']").each(function(idx,el){
				if(processTypes==""){
					processTypes="'"+$(el).val()+"'";
				}else{
					processTypes+="\,'"+$(el).val()+"'";
				}
			});
			$list_dataParam['processTypes'] = processTypes;
		}else{
			delete $list_dataParam['processTypes'];
		}
	}else{
		$list_dataParam['processType'] = processType;
	}
	 
	var signTypeId = $("#signTypeId").val();
	if(signTypeId==null || signTypeId == ''){
		delete $list_dataParam['signTypeId'];
	}else{
		$list_dataParam['signTypeId'] = signTypeId;
	}
	
	var processSort = $("#processSort").val();
	if(processSort==null || processSort == '' || processSort == 'HR' || processSort == 'COST'){
		delete $list_dataParam['processSort'];
	}else{
		$list_dataParam['processSort'] = processSort;
	}
	
	var orgLongNumber = $('#orgLongNumber').val();
	if(orgLongNumber==null || orgLongNumber == ''){
		delete $list_dataParam['orgLongNumber'];
	}else{
		$list_dataParam['orgLongNumber'] = orgLongNumber;
	}
	
	var includeChild = $('#includeChild').attr("checked");
	if(includeChild==null || includeChild == 'NO'){
		delete $list_dataParam['includeChild'];
	}else{
		$list_dataParam['includeChild'] = includeChild;
	}
	
	
}

function searchDataCount(){
	
	buildSearchParam();
	
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

function auditHistory(processId,processType){
	art.dialog.open(getPath()+"/workflow/auditHistory/list?process=" + processId+"&processType="+processType,{
		title:'审批历史',
		id:'auditHistory',
		width:'550px',
		height:'320px',
		lock:true,
		button:[{name:'确定'}]
	});
}
/**
 * 转交
 * @param processInstanceId 流程实例ID
 * @param processType 流程类型
 */
function referedProc(processInstanceId,processType){
	var flag = false;
	var url=getPath()+"/workflow/task/toRefered?VIEWSTATE=EDIT&id=";
	if(processType!='WORKFLOW'){ //会签
		url=getPath()+"/interflow/sign/toRefered?VIEWSTATE=EDIT&id="
	} 
	dlg = art.dialog.open(url + processInstanceId,{
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
function suppendProcess(process,processType){
	art.dialog.confirm("确定挂起?",function(){
		var url=getPath()+"/workflow/task/suppendProcess?id=";
		if(processType!='WORKFLOW'){ //会签
			url=getPath()+"/djworkflow/suppendOrActiveProcess?status=SUPPEND&id="
		} 
		$.post(url + process,{},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips("挂起成功",null,"succeed");
				refresh();
			}else{
				art.dialog.alert("挂起失败！");
			}
		},'json');
	});
}


function toActivateProcess(process,processType){
	var flag = false;
	/*if(processType=='COUNTERSIGN'){//会签流程激活
		art.dialog.confirm("确定激活?",function(){
			$.post(getPath()+"/djworkflow/suppendProcess?status=SUBMIT&id=" + process,{processType:processType},function(res){
				if(res.STATE == 'SUCCESS'){
					art.dialog.tips("激活成功",null,"succeed");
					refresh();
				}else{
					art.dialog.alert("激活失败！");
				}
			},'json');
		});
	}else{*/
		dlg = art.dialog.open(getPath()+"/workflow/task/toActivateProcess?id=" + process+"&processType="+processType,{
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
	//}
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



function processView(processId,id,processSort){
	if("WORKFLOW"==processSort){	
		dlg = art.dialog.open(getPath()+"/workflow/task/toProcessView?VIEWSTATE=EDIT&id=" + processId,
				{title:"流程查看",
			lock:true,
			width:960,
			height:580,
			id:"dealProcess",
			close:function(){
				 
			}
			});
	}else{
		dlg = art.dialog.open(getPath()+"/interflow/sign/signView?doType=view&signId=" + id+"&processId="+processId,
				{title:"流程查看",
			lock:true,
			width:960,
			height:580,
			id:"dealProcess",
			close:function(){
				 
			}
		 });
	}
}
 
function processSortChange(){
	var processSort=$("#processSort").val();
	if(processSort=='HR' || processSort=='COST'){ //如果选的是行政和财务类的 
		$.post(getPath()+"/workflow/process/getBillType?modeType=" + processSort,{},function(data){
			//$("#processType option:gt(0)").remove();
			$("#processType")[0].options.length=0;
			$("#processType").append("<option value=''>全部</option>");
			for(var i=0;i<data.length;i++){
				$("#processType").append("<option value='"+data[i].number+"'>"+data[i].name+"</option>");
			}
		},'json');
		$("#processType").val("");
		$("#processType_li").show();
		
		$("#signTypeId_li").hide();
		$("#signTypeId").val("");
	}else if(processSort=='SELFCUSTOM'){
		$("#processType").val("");
		$("#processType_li").hide();
		
		$("#signTypeId_li").show();
		$("#signTypeId").val("");
		
	}else{
		$("#processType").val("");
		$("#processType_li").hide();
		
		$("#signTypeId_li").hide();
		$("#signTypeId").val("");
	}
	
}

function changeApplyOrg(oldValue,newValue,doc){
	$("#orgLongNumber").val(newValue.longNumber);
}

function resetQuery(){
	$("#orgLongNumber").val("");
	$("#orgId").val("");
	$("#orgName").val("");
	$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	$("#processSort").val("");
	MenuManager.menus["startTime"].resetAll();
	$("#includeChild").attr("checked",false);
}

/**
 * 导出Excel
 */
function exportExcle(){
	var data = $list_dataGrid.getData();
	if(data.length > 0 ){
		//构建查询参数
		buildSearchParam();
		var suspensionState = $(".hover").attr("id");
		$list_dataParam['suspensionState'] = suspensionState;
		var param = "" ;
		for(var p in $list_dataParam){
			param += "&" + p + "="+ $list_dataParam[p] ;
		}
		var url = getPath()+"/workflow/process/exportExcel?tmp="+new Date().getTime() + param;
		var frame = $('#downLoadFile');
    	frame.attr('src',url);
	}else{
		art.dialog.tips('当前查询结果集没有导出数据！');
	}
}