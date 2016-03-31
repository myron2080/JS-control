var changeTypeCombox;
function initProcessApplyData(){
	//设置显示格式
	//$list_defaultGridParam['bookingCarStatus'] = $("#tab").find("li.hover").attr("key");
	
	$("#main").ligerLayout({});
	changeTypeCombox= $('#changeTypeList').ligerComboBox({ isShowCheckBox: true, isMultiSelect: true,
        data: [
               { text: '申请类别', id: 'aa' },
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
               { text: '删除跑盘', id: 'DELRUNDISK'}
           ], valueFieldID: 'changeType',initValue:'aa',initText:'申请类别'
          
     }); 
	//$("#toolBar").append($('#filter').html());
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	    columns: [ 
	        {display: '主题', name: 'title', align: 'left', width: 450,render:addPic},
	        {display: '申请类别', name: 'changeType.name', align: 'left', width: 100},
	        {display: '申请人', name: 'applyName', align: 'left', width: 100},
	        {display: '当前处理人', name: 'currProcessName', align: 'left', width: 100},
	        {display: '制单日期', name: 'createTime', align: 'left', width: 120},
	        {display: '审批情况',name:"status.name", align: 'left', width: 100,render:setColorFont},
	        {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
	    ],
	    fixedCellHeight:false,
	    delayLoad:true,
	    url:getPath()+'/hr/processApply/listData',
	    onDblClickRow:function(rowData,rowIndex,rowDomElement){
	    	//viewIncomePay(rowData.id,from);
			if(rowData.changeType.value=='ENROLL'){
				viewProcessApply(getPath()+"/hr/employeeOrientation/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"900px","600px");
			}else if(rowData.changeType.value=='TRANSFER'){
				viewProcessApply(getPath()+"/hr/positionchange/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"750px","350px");
			}else if(rowData.changeType.value=='PROMOTION'){
				viewProcessApply(getPath()+"/hr/positionpromotion/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"750px","350px");
			}else if(rowData.changeType.value=='DEMOTION'){
				viewProcessApply(getPath()+"/hr/positiondemotion/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"750px","350px");
			}else if(rowData.changeType.value=='INCREASE_PARTTIMEJOB'){
				viewProcessApply(getPath()+"/hr/positionincreaseptjob/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"750px","350px");
			}else if(rowData.changeType.value=='DISMISS_PARTTIMEJOB'){
				viewProcessApply(getPath()+"/hr/positiondismissptjob/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"750px","350px");
			}else if(rowData.changeType.value=='LEAVE'){
				viewProcessApply(getPath()+"/hr/affair/leaveOffice/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"1000px","350px");
			}else if(rowData.changeType.value=='POSITIVE'){
				viewProcessApply(getPath()+"/hr/affair/positive/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"1000px","450px");
			}else if(rowData.changeType.value=='REINSTATEMENT'){
				viewProcessApply(getPath()+"/hr/affair/reinstatement/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"1000px","350px");
			}else if(rowData.changeType.value=='RUNDISK'){
				viewProcessApply(getPath()+"/hr/employeerundiskbill/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"750px","350px");
			}else if(rowData.changeType.value=='DELRUNDISK'){
				viewProcessApply(getPath()+"/hr/employeedelrundisk/edit?VIEWSTATE=VIEW&id="+rowData.id+"",'查看',"750px","350px");
			}
	    },
	    pageSizeOptions:[15,20,30],
	    pageSize:15,
	    width:"88%",
	    onAfterShowData:function(){
	    	var key = $("#processPag").find("li.hover").attr("key");
	    	if(key!=""){
	    		$.post(getPath()+"/hr/processApply/updateRead",{status:key},function(res){
	    			if(res.STATE=="SUCCESS"){
	    				$("#"+key).html('');
	    				parent.getProcessCount();
	    				window.parent.top.initMessageCount();
	    			}
	    		},'json');
	    	}
	    }
			
	}));
	searchData();
	//bindEvent();
}

function addPic(data){
	if(data.status==null ||data.status==''){
		return "";
	}
	//alert(data.isread);
	if(data.status.value=='APPROVED' || data.status.value=='REJECT'){
		if(!data.isread){
			return data.title+"<img src='"+getPath()+"/default/style/images/common/new.gif'>";
		}else{
			return data.title;
		}
	}else{
		return data.title;
	}
}
function setColorFont(data){
	if(data.status==null ||data.status==''){
		return "";
	}
	if(data.status.value=='APPROVED'){
		return '<a class="approve_font01" href="javascript:void(0)">'+data.status.name+'</a>';
	}else if (data.status.value=='SUBMIT'){
		return '<a class="approve_font" href="javascript:void(0)">'+data.status.name+'</a>';
	}else if(data.status.value=='SAVE'){
		return '<a class="modify_font" href="javascript:void(0)">'+data.status.name+'</a>';
	}else if (data.status.value=='REVOKE' || data.status.value=='REJECT'){
		return '<a class="delete_font" href="javascript:void(0)">'+data.status.name+'</a>';
	}
}
function operateRender(data){
	if(data.status==null ||data.status==''){
		return "";
	}
	if(data.status.value=='SAVE' || data.status.value=="REJECT" || data.status.value=='REVOKE'){//editProcessApply
		if(data.changeType.value=='ENROLL'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/employeeOrientation/edit?id='+data.id+'","900px","600","flag")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/employeeOrientation/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='TRANSFER'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/positionchange/edit?id='+data.id+'","750px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/positionchange/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='PROMOTION'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/positionpromotion/edit?id='+data.id+'","750px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/positionpromotion/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='DEMOTION'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/positiondemotion/edit?id='+data.id+'","750px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/positiondemotion/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='INCREASE_PARTTIMEJOB'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/positionincreaseptjob/edit?id='+data.id+'","750px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/positionincreaseptjob/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='DISMISS_PARTTIMEJOB'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/positiondismissptjob/edit?id='+data.id+'","750px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/positiondismissptjob/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='LEAVE'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/affair/leaveOffice/edit?id='+data.id+'","1000px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/affair/leaveOffice/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='POSITIVE'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/affair/positive/edit?id='+data.id+'","1000px","450px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/affair/positive/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='REINSTATEMENT'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/affair/reinstatement/edit?id='+data.id+'","1000px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/affair/reinstatement/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='RUNDISK'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/employeerundiskbill/edit?id='+data.id+'","750px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/employeerundiskbill/delete","'+data.id+'")>删除</a>';
		}else if(data.changeType.value=='DELRUNDISK'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=editProcessApply("'+getPath()+'/hr/employeedelrundisk/edit?id='+data.id+'","750px","350px")>编辑</a>'+
			'&nbsp;&nbsp;<a class="delete_font" href="javascript:void(0)" onclick=delProcessApply("'+getPath()+'/hr/employeedelrundisk/delete","'+data.id+'")>删除</a>';
		}
	}
	
	if(data.status.value=='SUBMIT'){
		/* 注释撤销 update by li.biao 2013-7-15 17:16:02 for ou.haibin
		if(data.changeType.value=='ENROLL'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus1("'+getPath()+'/hr/employeeOrientation/changeStatu","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='TRANSFER'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus2("'+getPath()+'/hr/positionchange/approve","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='PROMOTION'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus2("'+getPath()+'/hr/positionpromotion/approve","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='DEMOTION'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus2("'+getPath()+'/hr/positiondemotion/approve","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='INCREASE_PARTTIMEJOB'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus2("'+getPath()+'/hr/positionincreaseptjob/approve","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='DISMISS_PARTTIMEJOB'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus2("'+getPath()+'/hr/positiondismissptjob/approve","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='LEAVE'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus1("'+getPath()+'/hr/affair/leaveOffice/changeStatu","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='POSITIVE'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus1("'+getPath()+'/hr/affair/positive/changeStatu","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='REINSTATEMENT'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus1("'+getPath()+'/hr/affair/reinstatement/changeStatu","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='RUNDISK'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus2("'+getPath()+'/hr/employeerundiskbill/approve","'+data.id+'")>撤销</a>';
		}else if(data.changeType.value=='DELRUNDISK'){
			return '<a class="modify_font" href="javascript:void(0)" onclick=updateBillStatus2("'+getPath()+'/hr/employeedelrundisk/approve","'+data.id+'")>撤销</a>';
		}
		*/
	}
}

//查询
function searchData(){
	
	var status = $("#processPag").find("li.hover").attr("key");
	if(status!=''){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	
	var changeType = $("#changeType").val();
	if(changeType!="" && changeType!="aa"){
		$list_dataParam['changeType'] = changeType;
	}else{
		delete $list_dataParam['changeType'];
	}
	//制单日期
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
	
	//主题、申请人
	var key = $('#key').val()==$("#key").attr("defaultValue")?"":$('#key').val();
	if(key != null && key != ""){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
	var personId = loginUserId;
	if(personId!=null && personId!=''){
		$list_dataParam['personId'] = personId;
	}else{
		delete $list_dataParam['personId'];
	}
	resetList();
}

function clearAll(){
	$('#key').val($("#key").attr("defaultValue"));
	$("#startValue").val('');
	$("#endValue").val('');
	$("#changeTypeList").val('申请类别');
	$("#changeType").val('aa');
}

function addProcessApply(url,title,w,h,resizeFlag){
	if(resizeFlag){
		if(h > ($(window).height()-150)){
			h = ($(window).height()-150) + "px";
		} else {
			h = h+"px";
		}
	}
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:title,
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
					 if(typeof(afterAddRow)=='function'){
						 afterAddRow();
					 }
					 resetList();
				 }
			 }
			});
}
function viewProcessApply(url,title,w,h){
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:title,
			 lock:true,
			 width:w,
			 height:h,
			 id:"addEmp",
			 button:[{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
//			 close:function(){
//				 if(flag){
//					 if(typeof(afterAddRow)=='function'){
//						 afterAddRow();
//					 }
//					 resetList();
//				 }
//			 }
				
			});
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
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}


function delProcessApply(url,id){
	art.dialog.confirm("确定删除该单据吗？",function(){
		$.post(url,{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips(res.MSG);
				resetList();
			}
		},'json');
	});
}

function updateBillStatus1(url,id){
	art.dialog.confirm("是否撤销此单据？",function(){
		$.post(url,{billId:id,billStatu:'REVOKE'},function(data){
    		if(data.STATE=="SUCCESS"){
    			art.dialog.tips(data.MSG);
    			resetList();
    			art.dialog.close();
    		}else{
    			art.dialog.tips(data.MSG);
    			resetList();
    		}
    	});
	});
}

function updateBillStatus2(url,id){
	art.dialog.confirm("是否撤销此单据？",function(){
		$.post(url,{billIds:id,approveType:'REVOKE'},function(data){
    		if(data.STATE=="SUCCESS"){
    			art.dialog.tips(data.MSG);
    			resetList();
    			art.dialog.close();
    		}else{
    			art.dialog.tips(data.MSG);
    			resetList();
    		}
    	});
	});
}