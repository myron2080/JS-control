function queryApply(){
	/*var key = $("#applytype").val();
	key = (key== $("#applytype").attr("defaultvalue"))?'':key;
	$(".audit-area-list").hide();
	$.each($(".audit-area li"),function(i,item){
		$(item).show();
		if(key&&$(item).attr('key').indexOf(key)<0){
			$(item).hide();
		}else{
			if($(item).parent().parent().parent().is(":visible")==false)
				$(item).parent().parent().parent().show();
		}
			
	});*/

	
}

function listPersonCount(){
	$.post(getPath()+"/workflow/processView/listCount",{personId:currentId},function(data){
		var total = 0;
		var waitapp = 0;
		$.each(data,function(key,value){
			$('#'+key).html('('+value+')');		
			if(key=='PERSONSUBMITCOUNT')waitapp=value;
		});		
		var s = '<span ><i style="float:left;">流程</i>'+(waitapp>0?('<i style="margin-top:5px;" class="number">'+waitapp+'</i>'):'')+'</span>';
		$("#PERSONSUBMITCOUNT").html(waitapp); 
		top.changeCurTabName(s,'workflowCenter');
	},'json');
}

function queryData(cur){
	// curstatus = $(".audit-top a.bluebg").attr("key");
	var curstatus = $("#applytype").val();
	var keyword = $("#keyword").val();
	if(keyword=='单据类型/标题/申请人')keyword = '';
	var para = {};
	para.status = curstatus;
	if(cur)
		para.currentPage = cur;
	else
		para.currentPage =  1;
	para.personId = currentId;
	para.pageSize = 10;
	para.keyword = keyword;
	$.post(getPath()+"/workflow/processView/queryData",para,function(data){
		$(".audit-content").html('');
		$(".audit-content").html($(data).find("#searchlist").html());
		$(".audit-content").scrollTop(0);	
		$("#pagediv").html('');
		$("#pagediv").html($(data).find("#pagediv").html());
		
	});
/*	$.post(getPath()+"/workflow/processView/listStatus",{personId:currentId,keyword:keyword},function(data){
		var total = 0;
		$.each(data,function(key,value){
			$('#'+key).html('('+value+')');
			total += value;
		});
		$("#ALLCOUNT").html('('+total+')');	
	},'json');*/
	listPersonCount();
}

function pagesearch(cur){
	if(curtype == "waitApprove"){
		queryData(cur);
	}else if(curtype == "approved"){
		queryCreateData(cur);
	}
}

function initWaitApprove(){
	$(".audit-top-l a").click(function(){
		$(".audit-top a.bluebg").removeClass('bluebg');
		$(this).addClass('bluebg');
		queryData();
	});
	
	$(".audit-content").height($(window).height()-95);
}

function viewProcessChart(processId){
	if(!processId) {art.dialog.tips("无相关流程");return;}
	art.dialog.open(getPath()+"/workflow/process/processChart?process=" + processId,{
		title:'查看流程图',
		id:'viewProcessChart',
		width:'1150px',
		height:'600px',
		lock:true,
		button:[{name:'确定'}]
	});
}

function auditHistory(processId){
	if(!processId) {art.dialog.tips("无相关审批历史");return;}
	art.dialog.open(getPath()+"/workflow/auditHistory/list?process=" + processId,{
		title:'审批历史',
		id:'auditHistory',
		width:'550px',
		height:'320px',
		lock:true,
		button:[{name:'确定'}]
	});
}


function dealProcess(obj,taskId,objId){
	art.dialog.data("getSignBillCount",getSignBillCount);
	if(taskId){	
		taskDescription = $(obj).parent().find('textarea').val();
		var dlg;
		if(taskDescription && taskDescription.substr(0,10)=='executeJs:'){
			taskDescription = taskDescription.replace(/#id#/g,objId);
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
					queryData();
				}
				});
		}
	}
}

function dealSelfProcess(obj,type,objId,status){
	var dlg;
	var flag = true;
	 
	//如果单据状态是驳回,处理操作为修改
	if(status=='REJECT'){
		editCountersign(objId);
	}else{
		art.dialog.data("searchApproveData",queryData);
		art.dialog.data("getSignBillCount",getSignBillCount);
		var reqUrl = getPath()+"/interflow/sign/signView?doType=approve&signId="+objId;		
		dlg = art.dialog.open(reqUrl,
			{title:'会签审核',
				 lock:true,
				 width:'860px',
				 height:'500px',
				 id:"art_signapprove"
		});
	}
	 
}

function resetList(){
	queryData();
}

function initApproved(){

	
	changeTypeCombox= $('#changeTypeList').ligerComboBox({ isShowCheckBox: true, isMultiSelect: true,
        data: [
               { text: '申请类别', id: '' },
               { text: '入职', id: 'ENROLL' },
               { text: '调职', id: 'TRANSFER' },
               { text: '晋升', id: 'PROMOTION' },
               { text: '降职', id: 'DEMOTION' },
               { text: '兼职', id: 'INCREASE_PARTTIMEJOB' },
               { text: '撤职', id: 'DISMISS_PARTTIMEJOB' },
               { text: '离职', id: 'LEAVE' },
               { text: '转正', id: 'POSITIVE' },
               { text: '复职', id: 'REINSTATEMENT'},
               { text: '新增跑盘', id: 'RUNDISK'},
               { text: '删除跑盘', id: 'DELRUNDISK'},
               { text: '会签', id: 'COUNTERSIGN'}
           ], valueFieldID: 'changeType',initValue:'',initText:'申请类别'
          
     }); 
	queryCreateData();
	$(".audit-content").height($(window).height()-95);
}

function queryCreateData(cur){
	var para = {};
	var keyword = $("#keyword").val();
	if(keyword=='主题/申请人') keyword = '';
	var changeType = $("#changeType").val();
	var ctypestr = '';
	if(changeType){
		var cary = changeType.split(';');
		for(var i=0;i<cary.length;i++){
			ctypestr += '\''+cary[i]+'\',';
		}
		if(cary.length>0) ctypestr = ctypestr.substring(0,ctypestr.length-1);
	}
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		para['queryStartDate'] = queryStartDate;
	} else {
		delete para['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		para['queryEndDate'] = queryEndDate;
	} else {
		delete para['queryEndDate'];
	}
	para['changeType'] = ctypestr;
	if(cur)
		para['currentPage'] = cur;
	else
		para['currentPage'] = 1;
	
	para['pageSize'] = 10;	
	para['personId'] = currentId;
	para['keyword'] = keyword;
	
	 
	var processType = $("#processType").val();
	if(processType==null || processType == ''){
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
			para['processTypes'] = processTypes;
		} 
	}else{
		para['processType'] = processType;
	}
	 
	var signTypeId = $("#signTypeId").val();
	if(signTypeId==null || signTypeId == ''){
		delete para['signTypeId'];
	}else{
		para['signTypeId'] = signTypeId;
	}
	
	var processSort = $("#processSort").val();
	if(processSort==null || processSort == '' || processSort == 'HR' || processSort == 'COST'){
		delete para['processSort'];
	}else{
		para['processSort'] = processSort;
	}
	
	
	
	$.post(getPath()+"/workflow/processView/queryCreateData",para,function(data){
		$(".audit-content").html('');
		$(".audit-content").html($(data).find("#searchlist").html());
		$(".audit-content").scrollTop(0);
		$("#pagediv").html('');
		$("#pagediv").html($(data).find("#pagediv").html());
	});
	
}

function delProcess(id,processType,url){
 
	if("COUNTERSIGN"==processType){ //会签单据删除
		url = getPath()+'/interflow/sign/delete?id='+id;
	}else{
		url=getPath()+"/"+url+id;
	}
	delProcessApply(url,id);
}

function editProcess(id,processType,status,url,size){

	var w =parseInt(size.split("X")[0]);
	var h=parseInt(size.split("X")[1]);
	 
	if("COUNTERSIGN"==processType){
		editCountersign(id);
		return;
	}else{
		url=getPath()+"/"+url+id;
	}
	
	if(status=='SAVE'||status=='REVOKE'){
		editProcessApply(url,w,h,1);
	}else{
		saveSubmit(url,w,h,1);
	}
}

function cancelProcess(id,processType){



	var url = "";
	
	if("ENROLL"==processType){
		url = getPath()+'/hr/employeeOrientation/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("TRANSFER"==processType){
		url = getPath()+'/hr/positionchange/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("PROMOTION"==processType){
		url = getPath()+'/hr/positionpromotion/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("DEMOTION"==processType){
		url = getPath()+'/hr/positiondemotion/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("INCREASE_PARTTIMEJOB"==processType){
		url = getPath()+'/hr/positionincreaseptjob/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("DISMISS_PARTTIMEJOB"==processType){
		url = getPath()+'/hr/positiondismissptjob/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("LEAVE"==processType){
		url = getPath()+'/hr/affair/leaveOffice/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("POSITIVE"==processType){
		url = getPath()+'/hr/affair/positive/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("REINSTATEMENT"==processType){
		url = getPath()+'/hr/affair/reinstatement/cancleBill?id='+id+'&billStatu=REVOKE';
		
	}else if("RUNDISK"==processType){
		url = getPath()+'/hr/employeerundiskbill/cancleBill?id='+id+'&billStatu=REVOKE';;
		
	}else if("DELRUNDISK"==processType){
		url = getPath()+'/hr/employeedelrundisk/cancleBill?id='+id+'&billStatu=REVOKE';;
		
	}else if("ASK4LEAVE"==processType){
		url = getPath()+'/hr/ask4Leave/cancleBill?id='+id;
	}else if("CLEARANCELEAVE"==processType){
		url = getPath()+'/hr/clearanceLeave/cancleBill?id='+id;
	}else if("COUNTERSIGN"==processType){
		url = getPath()+'/interflow/sign/doCallBack?signBillId='+id;
	}
	cancelProcessApply(url,id);
}

function editProcessApply(url,w,h,resizeFlag){

	if(resizeFlag){
		if(h > ($(window).height()-150)){
			h = ($(window).height()-150) + "px";
		} else {
			h = h+"px";
		}
	}
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:'修改',
			 lock:true,
			 width:w,
			 height:h,
			 id:"addEmp",
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
				 queryCreateData();
				}
			 }
			});
}

function saveSubmit(url,w,h,resizeFlag){

	if(resizeFlag){
		if(h > ($(window).height()-150)){
			h = ($(window).height()-150) + "px";
		} else {
			h = h+"px";
		}
	}
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:'修改',
			 lock:true,
			 width:w,
			 height:h,
			 id:"addEmp",
			 button:[{name:'提交',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveSubmit){
						dlg.iframe.contentWindow.saveSubmit(dlg);
					}
					return false;
				}},{name:'保存',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this,"SUBMIT");
					}
					return false;
				}},{name:'取消',callback:function(){
					//dlg.iframe.contentWindow.saveAdd(this,"CANCEL");
					flag = false;
					return true;
				}}], 	
			 close:function(){
				if(flag){
				 queryCreateData();
				}
			 }
			});
}

function editCountersign(signBillId){

	var reqUrl = getPath()+"/interflow/sign/edit?id="+signBillId;
	
	art.dialog.data("searchData",pagesearch);
	var flag = true ;
	var dlg = art.dialog.open(reqUrl,
		{title:'会签申请编辑',
			 lock:true,
			 width:'914px',
			 height:'500px',
			 id:"art_signapproveedit",
			 button:[{name:'提交',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this,'SUBMIT');
					}
					return false;
				}},{name:'保存',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this,'SAVE');
					}
					return false;
				}} 
			 ,{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
	});
}

function delProcessApply(url,id){

	art.dialog.confirm("确定删除该单据吗？",function(){
		$.post(url,{},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips(res.MSG);
				queryCreateData();
				
			}else{
				art.dialog.tips(res.MSG);
			}
		},'json');
	});
}

function cancelProcessApply(url,id){

	art.dialog.confirm("确定撤销该单据吗？",function(){
		$.post(url,{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips(res.MSG);
				queryCreateData();
			}
		},'json');
	});
}

function addProcessApply(url,title,size,resizeFlag){
	var w=parseInt(size.split("X")[0]);
	var h=parseInt(size.split("X")[1])
	
	if(resizeFlag){
		if(h > ($(window).height()-150)){
			h = ($(window).height()-150);
		}
	}
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:title,
			 lock:true,
			 width:w+"px",
			 height:h+"px",
			 id:"addEmp",
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
				 
			 }
			});
}
 

function addExpense(){
	var dlg = art.dialog.open(getPath()+"/cost/expense/add",{
		id : 'add',
		title:"新增报销单",
		width : 880,
		height : 520,
		lock:true,
		button:[{name:"保存",callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveMethod){
				dlg.iframe.contentWindow.saveMethod(dlg);
			}
			return false;
		}},{name:"提交",callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.submitMethod){
				dlg.iframe.contentWindow.submitMethod(dlg);
			}
			return false;   
		}}],
		cancelVal: '关闭',
	    cancel: true,
	    close:function(){	
	    	listPersonCount();
	    }
	});
}

function editExpense(id){
	var dlg = art.dialog.open(getPath()+"/cost/expense/edit?id="+id,{
		id : 'edit',
		title:"编辑报销单",
		width : 880,
		height : 520,
		lock:true,
		button:[{name:"保存",callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveMethod){
				dlg.iframe.contentWindow.saveMethod(dlg);
			}
			return false;
		}},{name:"提交",callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.submitMethod){
				dlg.iframe.contentWindow.submitMethod(dlg);
			}
			return false;
		}}],
		cancelVal: '关闭',
	    cancel: true,
	    close:function(){	
	    	searchData();
	    }
	});
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
		w=900;
		h=500;
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

function processView2(processInstanceId,id,processType){
	 
	dlg = art.dialog.open(getPath()+"/workflow/task/toProcessView2?VIEWSTATE=EDIT&id=" + processInstanceId+"&objId="+id,
		{title:"流程查看",
		lock:true,
		width:960,
		height:620,
		id:"dealProcess",
		close:function(){}
		});
	 
}

//processView('${item.processId}','${item.objId}','${item.processSort}','${item.billType.viewLink}','${item.billType.viewSize }')
function processView(processId,id,processSort,viewLink,viewSize ){
	if(processId==null || processId==''){
		var w=parseInt(viewSize.split("X")[0]);
		var h=parseInt(viewSize.split("X")[1]);
		dlg = art.dialog.open(getPath()+"/"+viewLink+id,
				{title:"流程查看",
			lock:true,
			width:w+"px",
			height:h+"px",
			id:"dealProcess",
			close:function(){
				 
			}
		 });
	}
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
function toBillPrint(processId,id,processType){
	var url = "";
	var w = 0,h=0;
	if("COUNTERSIGN"==processType){//会签
		url = getPath()+'/interflow/sign/toSignBillPrint?signId='+id+'&processId='+processId;
		w=900;
		h=500;
	}else if(processType=='REIMBURSEMENT'){
		url = getPath()+'/basedata/printConfig/commPrint?id='+id+'&processId='+processId+"&number="+processType;
		w=900;
		h=500;
	}else{
		return false;
	}
	var dlg = art.dialog.open(url,
			{title:'查看',
			 lock:true,
			 width:w+"px",
			 height:h+"px",
			 id:"viewProcess",
			 button:[{name:"打印",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.toPrint){
						dlg.iframe.contentWindow.toPrint();
					}
					return false;
				}},
				{name:'关闭'}
				]
			});
}

function getSignBillCount(){
	$.post(getPath()+"/workflow/processView/listCount",{personId:currentId},function(data){
		var total = 0;
		var waitapp = data["PERSONSUBMITCOUNT"];
		$(top.document).find("#processCenterIframe:first").contents().find("#PERSONSUBMITCOUNT:first").html(waitapp);
		$(top.document).find("#ct_process").html(waitapp);
	},'json');
	
}