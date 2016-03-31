$list_addUrl = getPath()+"";//查看url
$list_editWidth = 450;
$list_editHeight = 140;

$list_dataType = "会签";//数据名称
 
$(document).ready(function(){
	 
	params ={};
	params.inputTitle = "申请日期";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	//默认值，当月
	MenuManager.menus["effectdate"].setValue(startDay,endDay);
	MenuManager.menus["effectdate"].confirm();
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'center', width: 100,render:renderOperation},
            {display: '审批状态', name: 'approveStatus.name', align: 'center', width: 100,render:renderStatus},
            {display: '申请部门', name: 'orgName', align: 'left', width: 120},
            {display: '申请人', name: 'personName', align: 'left', width: 100},
            {display: '申请类型', name: 'applyType.name', align: 'left', width: 100},
            {display: '会签标题', name: 'title', align: 'left', width: 300},
            {display: '登记人', name: 'creatorName', align: 'center', width: 100},
            {display: '创建日期', name: 'createTime', align: 'left', width: 120},
            {display: '下一处理人', name: 'nextApproveName', align: 'left', width: 200}
        ],
        url:getPath()+'/interflow/sign/listData',
        delayLoad:true,
        usePager:true,
        enabledSort:false,
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
	    	//查看
        	toSignView(rowData.id);
	    }
    }));
	
	bindEvent(); 
	searchData();
});

/**
 * 页签单击
 * @param obj
 */
function tabLiClick(obj){
	var objId = obj.id ;
	//移除全部样式
	$("div[class='ds_title']").find("ul:first li").each(function(n,liObj){
		if(liObj.id == objId){
			$(liObj).addClass("hover");
		}else{
			$(liObj).removeClass("hover");
		}
	});
	//不是全部
	if("li_all" != objId ){
		$("#signStatus").val(objId.split("-")[1]);
	}else{
		$("#signStatus").val("");
	}
	//查询
	searchData();
}

function bindEvent(){
	
	//查询
	$("#btnSearch").click(function(){
		searchData();
	});
	
	//清空
	$("#btnReset").click(function(){
		MenuManager.menus["effectdate"].resetAll();
		$("#applyPersonId").val("");
		$("#orgId").val("");
		$("#orgName").val($("#orgName").attr("defaultValue"));
		$("#applyPersonName").val($("#applyPersonName").attr("defaultValue"));
		$("#content").val($("#content").attr("defaultValue"));
		$("#approveStatusSel").val("");
	});
	
	eventFun($("#applyPersonName"));
	eventFun($("#content"));
	eventFun($("#orgName"));
}

function searchData(){
	
	$list_dataParam['orderByClause'] = " SB.FCREATETIME DESC";
	
	//申请人
	var applyPersonName = $('#applyPersonName').val();
	if(applyPersonName && applyPersonName!=$("#applyPersonName").attr("defaultValue")){
		$list_dataParam['applyPersonName'] = applyPersonName;
	}else{
		delete $list_dataParam['applyPersonName'];
	}
	//内容
	var content = $('#content').val();
	if(content && content!=$("#content").attr("defaultValue")){
		$list_dataParam['content'] = content;
	}else{
		delete $list_dataParam['content'];
	}
	
	//申请组织
	var orgId = $('#orgId').val();
	if(orgId){
		$list_dataParam['orgId'] = orgId;
	}else{
		delete $list_dataParam['orgId'];
	}
	
	//状态
	var signStatus = $('#signStatus').val();
	if(signStatus){
		$list_dataParam['signStatus'] = signStatus;
	}else{
		delete $list_dataParam['signStatus'];
	}
	
	//申请时间
	var applyStartDate = "";
	var applyEndDate = "";
	if(MenuManager.menus["effectdate"]){
		applyStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		applyEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	//查询开始时间
	if(applyStartDate != ""){
		$list_dataParam['applyStartDate'] = applyStartDate;
	} else {
		delete $list_dataParam['applyStartDate'];
	}
	//查询结束时间
	if(applyEndDate != ""){
		$list_dataParam['applyEndDate'] = applyEndDate;
	} else {
		delete $list_dataParam['applyEndDate'];
	}
	
	resetList();
}

/**
 * 会签申请
 */
function toSignApply(){
	var flag = true ;
	var reqUrl = getPath()+"/interflow/sign/apply";
	art.dialog.data("searchData",searchData);
	var dlg = art.dialog.open(reqUrl,
		{title:'会签申请',
			 lock:true,
			 width:'914px',
			 height:'500px',
			 id:"art_signapply",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveData){
						dlg.iframe.contentWindow.saveData(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 resetList();
				 }
			 }
		});
}

/**
 * 
 */
function renderOperation(data){
	var signStatus = $("#signStatus").val();
	var status = data.approveStatus.value ;
	var stepId = data.step ? data.step.id : "" ;
	var showHtml = "" ;

	if(signStatus!="doApprove" && signStatus!="approved"){
		if(stepId == ""){//还未有人审批，可修改
			showHtml += "<a href='javascript:void(0);' onclick=toSignApplyEdit('"+data.id+"')>修改</a>";
		}else if(status == "SUBMIT"){//审批中，可撤销
			showHtml += "<a href='javascript:void(0);' onclick=doCallBack('"+data.id+"')>撤销</a>";
		}else if(status == "CALLBACK" || status == "REJECT"){//或者撤销或者驳回，可修改
			showHtml += "<a href='javascript:void(0);' onclick=toSignApplyEdit('"+data.id+"')>修改</a>";
		}
	}else if(signStatus == 'doApprove'){//会签审核
		showHtml += "<a href='javascript:void(0);' onclick=toSignApprove('"+data.id+"')>审核</a>";
	}else if(signStatus == 'approved'){//我已审批
		showHtml = "" ;
	}
	return showHtml ;
}

function renderStatus(data){
	var status = data.approveStatus.value ;
	var showHtml = "" ;
	if(status == "SUBMIT"){
		showHtml += "<a class='approve_font' href='javascript:void(0)'>审批中</a>" ;
	}else if(status == "APPROVED"){
		showHtml += "<a class='approve_font01' href='javascript:void(0)'>审批完成</a>" ;
	}else if(status == "REJECT"){
		showHtml += "<a class='delete_font' href='javascript:void(0)'>已驳回</a>" ;
	}else if(status == "CALLBACK"){
		showHtml += "<a class='delete_font' href='javascript:void(0)'>已撤销</a>" ;
	}
	return showHtml ;
}

/**
 * 审核
 * @param signBillId
 */
function toSignApprove(signBillId){
	var reqUrl = getPath()+"/interflow/sign/signView?doType=approve&signId="+signBillId;
	art.dialog.data("searchApproveData",searchData);
	art.dialog.data("getSignBillCount",window.parent.parent.getSignBillCount);
	art.dialog.data("initMessageCount",window.parent.parent.top.initMessageCount);
	var dlg = art.dialog.open(reqUrl,
		{title:'会签审核',
			 lock:true,
			 width:'803px',
			 height:'542px',
			 id:"art_signapprove"
	});
}

/**
 * 编辑
 * @param signBillId
 */
function toSignApplyEdit(signBillId){
	var reqUrl = getPath()+"/interflow/sign/edit?id="+signBillId;
	art.dialog.data("searchData",searchData);
	var flag = true ;
	var dlg = art.dialog.open(reqUrl,
		{title:'会签申请编辑',
			 lock:true,
			 width:'914px',
			 height:'542px',
			 id:"art_signapproveedit",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveData){
						dlg.iframe.contentWindow.saveData(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 resetList();
				 }
			 }
	});
}

/**
 * 撤销
 * @param signBillId
 */
function doCallBack(signBillId){
	$.post(getPath()+"/interflow/sign/doCallBack",{
		signBillId:signBillId
	},function(res){
		if(res.STATE == "SUCCESS"){
			art.dialog.tips("撤销成功");
			searchData();
		}else{
			art.dialog.tips("撤销失败");
		}
	},'json');
}

/**
 * 查看
 * @param signBillId
 */
function toSignView(signBillId){
	var reqUrl = getPath()+"/interflow/sign/signView?doType=view&signId="+signBillId;
	art.dialog.data("searchApproveData",searchData);
	var dlg = art.dialog.open(reqUrl,
		{title:'会签查看',
			 lock:true,
			 width:'803px',
			 height:'542px',
			 id:"art_signview"
	});
}