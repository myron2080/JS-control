$list_editUrl = getPath()+"/ebstorage/out/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebstorage/out/add";//新增url
$list_deleteUrl = getPath()+"/ebstorage/out/delete";//删除url
$list_editWidth="1050px";
$list_editHeight="550px";
$list_dataType = "调拨单" ;
var approveEnum={UNAPPROVE:'未审批',APPROVED:'已审批',REJECT:'已驳回',UNSEND:'未发货',SENT:'已发货',GOT:'已收货',
		SUBMITED:'已提交',PICKING:'拣货中',PICKED:'拣货完成',HANG_UP:'已挂起',HAND_CANCEL:'已取消',CLOSED:'已关闭',
		ZC_READY_PICK:'总仓待拣货',ZC_PICKING:'总仓拣货中',ZC_PICKED:'总仓已拣货',ZC_SENDING:'总仓配送中',ZC_CLOSE:'总仓关闭',FC_GOT:'分仓已收货',
		FC_READY_PICK:'分仓待拣货',FC_PICKING:'分仓拣货中',FC_HANG_UP:'分仓已挂起',FC_PICKED:'分仓已拣货',FC_SENDING:'分仓配送中',
		HC_GOT:'合仓已收货',HAND_CANCEL:'手工取消',BATCH_ZC_OUT:'总分调拨单',BATCH_FC_OUT:'分合调拨单',COMMON_OUT:'普通调拨单'};
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$(".graybtn").click(function(){//清空按钮
		resetCommonFun("number,org,outApproveStatus,status");
		MenuManager.menus["outdate"].resetAll();
		MenuManager.menus["arrivalTime"].resetAll();
		MenuManager.menus["createDate"].resetAll();
		clearDataPicker('provide_f7');
		searchData();
	});
	
	$("#tab li").click(function(){
		changeTab(this);
	});
	
	$("#batchOutPick").click(function(){
		batchOutPickFun();
	});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
         columns:[
         {display: '操作',name: '', align: 'center', width: 80,render:operateRender, isSort:false},
         {display: '业务操作', name: 'sortStr', align: 'center', width: 80, render:yewuOperate},
         {display: '打印订单', name: '', align: 'center', width: 60, isSort:false,render:orderPrint},
         {display: '打印调拨单', name: '', align: 'center', width: 70, isSort:false,render:outOrderPrint},
         {display: '装车单', name: '', align: 'center', width: 160, isSort:false,render:renderBatchState},
         {display: '调拨时间', name: 'outTimeStr', align: 'center',  width: 130},
         {display: '调拨单号', name: 'number', align: 'center',  width: 120, isSort:false,render:nubmerLink},
         {display: '调拨类型', name: '', align: 'center',  width: 120, isSort:false,render:showTypeEnum},
         {display: '调出仓库', name: 'outStorage.name', align: 'left', width: 120},
         {display: '调入仓库', name: 'storage.name', align: 'left', width: 120},
         {display: '负责人/联系方式', name: 'storage.person.name', align: 'left', width: 160, isSort:false, render:showNameAndPhone},
         {display: '调拨状态', name: 'followStatus', align: 'center',  width: 80, render: rederStatus},
         {display: '订单跟踪', name: '', align: 'center', width: 60, isSort:false,render:orderFollow},
         {display: '剔除订单', name: '', align: 'center', width: 60, isSort:false,render:unMeetOrders},
         {display: '审核状态', name: 'approveStatus', align: 'center',  width: 60, isSort:false, render: renderEnum},
         {display: '上级调拨单', name: 'parent.number', align: 'center',  width: 120, isSort:false,render:nubmerParentLink},
         {display: '报损发货单', name: 'loss.number', align: 'left',  width: 120, isSort:false,render:lossRender},
         {display: '报损入库单', name: 'lossIn.number', align: 'left',  width: 120, isSort:false,render:lossInRender},
         {display: '批次号', name: 'outBatch.number', align: 'center',  width: 120},
         {display: '实发总数', name: 'goodsCount', align: 'center',  width: 60, isSort:false},
         {display: '实收数', name: 'allGetCount', align: 'center',  width: 60, isSort:false},
         {display: '总实收数', name: 'totalDamageCount', align: 'center',  width: 60, isSort:false},
         {display: '创建时间', name: 'createTimeStr', align: 'center',  width: 130},
         {display: '收货时间', name: 'arrivalTimeStr', align: 'center',  width: 130},
         {display: '创建人', name: 'creator.name', align: 'center',  width: 80, isSort:false},
         {display: '审批人', name: 'approve.name', align: 'left',  width: 80, isSort:false},
         {display: '审批时间', name: 'approveTimeStr', align: 'left',  width: 130, isSort:false},
         {display: '审批信息', name: 'approveInfo', align: 'left',  width: 200, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        checkbox : true,
        delayLoad : true,
        url:getPath() + '/ebstorage/out/listData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.id);
        }
    }));
	var params ={};
	params.width = 260;
	params.inputTitle = "调拨时间";
	MenuManager.common.create("DateRangeMenu","outdate",params);
	
	params ={};
	params.width = 260;
	params.inputTitle = "收货时间";	
	MenuManager.common.create("DateRangeMenu","arrivalTime",params);
	
	params ={};
	params.width = 260;
	params.inputTitle = "创建时间";	
	MenuManager.common.create("DateRangeMenu","createDate",params);
	
	MenuManager.menus["createDate"].setValue($("#todayDate").val(),$("#todayDate").val());
	MenuManager.menus["createDate"].confirm();
	
	$("#tab li:first").click();
});

/**
 * 渲染 装车单 列
 * @param data
 */
function renderBatchState(data){
	var resLink='';
	if(null != data.tmpBatchPick){
		resLink+='<a href="javascript:void()" onclick="printBatchFun(\''+data.tmpBatchPick.id+'\')">打印装车单</a>&nbsp;';
		if(data.tmpBatchPick.status == 'NO'){//未装车
			resLink+='<a href="javascript:void()" onclick="updateBatchPickStatus(\''+data.tmpBatchPick.id+'\')">装车</a>&nbsp;';
			resLink+='<a href="javascript:void()" onclick="deleteBatchPick(\''+data.tmpBatchPick.id+'\')">删除</a>&nbsp;';
		}else if(data.tmpBatchPick.status == 'YES'){
			resLink+='<font color="green">已装车</font>';
		}
	}
	if(data.outType == 'BATCH_FC_OUT'){
		if(null != data.outBatchPick){
			resLink+='<font color="blue">已安排装车</font>';
		}else{
			resLink+='<font color="gray">未安排装车</font>';
		}
	}
	return resLink;
}

/**
 * 更新装车单状态
 * @param id
 */
function updateBatchPickStatus(id){
	art.dialog.confirm("确定装车?",function(){
		$.post(getPath()+'/ebstorage/outbatchpick/updateBatchPickStatus',{id:id},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips("装车成功");
			}else{
                art.dialog.tips(res.MSG);				
			}
			resetList();
		},'json')
	});
}

function printBatchFun(id){
	var dlg = art.dialog.open(getPath() + '/ebstorage/outbatchpick/printBatchFun/'+id,
			{title:'装车单_详情',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'printBatchFun',
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
			 }},{name:'关闭',callback:function(){
					return true;
				}}]
			});
}

function deleteBatchPick(id){
	art.dialog.confirm("确定删除该装车单?",function(){
		$.post(getPath()+'/ebstorage/outbatchpick/deleteBatchPick',{id:id},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips("删除成功");
				resetList();
			}
		},'json')
	});
}

/**
 * 生成装车单
 * @returns {Boolean}
 */
function batchOutPickFun(){
	var outOrderIds='';
	var _outParentId='';
	var _sameParent=true;
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			if(null == obj.outBatchPick && obj.outType == 'BATCH_FC_OUT'){
				outOrderIds+=obj.id+',';
                if(_outParentId == ''){
                	_outParentId=obj.parent.id
                }else{
                    if(_outParentId != obj.parent.id){
                    	_sameParent=false;
                    	return false;
                    }
                }
			}
		}
	}
	if (outOrderIds=='') {
		art.dialog.tips("请选择未装车的分合调拨单!");
		return false;
	}
	
	if(!_sameParent){
		art.dialog.tips("请选择同一总分调拨单下级的调拨单!");
		return false;
	}
	var flag = true;
	var dlg = art.dialog.open(getPath() + '/ebstorage/outbatchpick/toPreview?outOrderIds='+outOrderIds+'&outParentId='+_outParentId,
			{title:'装车单_预览',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'printBatchPrev',
			 button:[{name:'生成装车单',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.createBatchPick){
						dlg.iframe.contentWindow.createBatchPick(dlg);
					}
					return false;
			 }},{name:'关闭',callback:function(){
				 flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 refresh();
				 }
			 }
			});
}


function showTypeEnum(data){
	return approveEnum[data.outType];
}

/**
 * 关联报损入库单
 * @param data
 */
function lossInRender(data){
	if(null != data.lossIn){
		return '<a href="javascript:void(0);" onclick="toLossInStoragePage(\''+data.lossIn.id+'\')">'+data.lossIn.number+'</a>';
	}
	return '';
}

function toLossInStoragePage(id){
	var dlg = art.dialog.open(getPath() + '/ebstorage/lossinstorage/showlossInStorageDetail/'+id,
			{title:'报损入库单—查看',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'lossInStoragePage',
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printerInstorage){
						dlg.iframe.contentWindow.printerInstorage(dlg);
					}
					return false;
			 }},{name:'关闭',callback:function(){
					return true;
				}}]
			});
}

/**
 * 报损发货单操作
 */
function lossRender(data){
	if(null != data.loss){
		return '<a href="javascript:void(0);" onclick="toReportedLossPage(\''+data.loss.id+'\')">'+data.loss.number+'</a>';
	}
	return '';
}

/**
 * 跳转到   报损发货单页面
 * @param id
 */
function toReportedLossPage(id){
	var dlg = art.dialog.open(getPath() + '/ebstorage/reportedloss/showDetail/'+id,
			{title:'报损发货单 _查看',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'showDetail',
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printerInstorage){
						dlg.iframe.contentWindow.printerInstorage(dlg);
					}
					return false;
			 }},{name:'关闭',callback:function(){
					return true;
				}}]
			});
}


/**
 * 切换页签
 * @param obj
 */
function changeTab(obj){
	$("#tab li").each(function(){
		$(this).removeClass("hover");
	});
	$(obj).addClass("hover");
	if($(obj).attr("key")=="BATCH_ZC_OUT" || $(obj).attr("key")=="BATCH_FC_OUT"){
		$("#batchPickOrder").show();
		$("#batchSendOrder").show();
	}else{
		$("#batchPickOrder").hide();
		$("#batchSendOrder").hide();
	}
	$("#outType").val($(obj).attr("key"));
	searchData();
}

//订单跟踪
function orderFollow(data){
	return '<a href="javascript:void(0);" onclick="showOrderFollow(\''+data.id+'\')">订单跟踪</a>';
}

function unMeetOrders(data){
	return '<a href="javascript:void(0);" onclick="unMeetOrdersShow(\''+data.id+'\')">详情</a>';
}

function unMeetOrdersShow(id){
	var dlg=art.dialog.open(getPath()+'/ebsite/notMeetOrders/list?outOrderId='+id+'&height='+$list_editHeight+'&width='+$list_editWidth,
			{title:"未满足配送订单",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outOrderFollow',
			button:[{name:'关闭'}]}
	);
}

//打开订单 跟踪页面
function showOrderFollow(id){
	var dlg=art.dialog.open(getPath()+'/ebsite/outorderfollow/list?outOrderId='+id+'&height='+$list_editHeight+'&width='+$list_editWidth,
			{title:"订单跟踪",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outOrderFollow',
			button:[{name:'关闭'}]}
	);
}

function showNameAndPhone(data){
	if(null != data.storage.person){
		return data.storage.person.name+'/'+data.storage.person.phone;
	}else{
		return '';
	}
}
/**
 * 查询
 */
function searchData(){
	/*
	var key = $("#key").val();
	if(key == '号码/分配号码/mac地址'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	*/
	//调拨时间
	var outTime_begin = "";
	var outTime_end = "";
	if(MenuManager.menus["outdate"]){
		outTime_begin = MenuManager.menus["outdate"].getValue().timeStartValue;
		outTime_end = MenuManager.menus["outdate"].getValue().timeEndValue;
	}
	
	if(outTime_begin != ""){
		$list_dataParam['outTime_begin'] = outTime_begin;
	} else {
		delete $list_dataParam['outTime_begin'];
	}
	if(outTime_end != ""){
		$list_dataParam['outTime_end'] = outTime_end;
	} else {
		delete $list_dataParam['outTime_end'];
	}
	
		//创建时间
	var createDate_begin = "";
	var createDate_end = "";
	if(MenuManager.menus["createDate"]){
		createDate_begin = MenuManager.menus["createDate"].getValue().timeStartValue;
		createDate_end = MenuManager.menus["createDate"].getValue().timeEndValue;
	}
	
	if(createDate_begin != ""){
		$list_dataParam['createDate_begin'] = createDate_begin;
	} else {
		delete $list_dataParam['createDate_begin'];
	}
	if(createDate_end != ""){
		$list_dataParam['createDate_end'] = createDate_end;
	} else {
		delete $list_dataParam['createDate_end'];
	}
	
    
	//收货时间
	var arrivalTime_begin = "";
	var arrivalTime_end = "";
	if(MenuManager.menus["arrivalTime"]){
		arrivalTime_begin = MenuManager.menus["arrivalTime"].getValue().timeStartValue;
		arrivalTime_end = MenuManager.menus["arrivalTime"].getValue().timeEndValue;
	}
	
	if(arrivalTime_begin != ""){
		$list_dataParam['arrivalTime_begin'] = arrivalTime_begin;
	} else {
		delete $list_dataParam['arrivalTime_begin'];
	}
	if(arrivalTime_end != ""){
		$list_dataParam['arrivalTime_end'] = arrivalTime_end;
	} else {
		delete $list_dataParam['arrivalTime_end'];
	}
	
	$list_dataParam['outType'] = $("#outType").val();;
	var followStatus=$("#followStatus").val();
	if(followStatus != ''){
		$list_dataParam['followStatus'] = followStatus;
	}else{
		delete $list_dataParam['followStatus'];
	}
	
	var outApproveStatus=$("#outApproveStatus").val();
	if(outApproveStatus != ''){
		$list_dataParam['outApproveStatus'] = outApproveStatus;
	}else{
		delete $list_dataParam['outApproveStatus'];
	}
	
	var number=$("#number").val();
	if(number != '' && number != $("#number").attr("defaultValue")){
		$list_dataParam['number'] = number;
	}else{
		delete $list_dataParam['number'];
	}
	var org=$("#storageId").val();
	if(org != '' && org != '收货分店'){
		$list_dataParam['storageId'] = org;
	}else{
		delete $list_dataParam['storageId'];
	}
	var outStorageId=$("#outStorageId").val();
	if(outStorageId != '' && outStorageId != '调拨仓库'){
		$list_dataParam['outStorageId'] = outStorageId;
	}else{
		delete $list_dataParam['outStorageId'];
	}
	$list_dataParam['curOrgLongNumber'] = $("#curOrgLongNumber").val();
	
	if(yq_qb != 'Y' && yq_zcdbzzfc != 'Y' && yq_zfcdbzhhr != 'Y' && yq_ptdb != 'Y'){
		return;
	}
	resetList();
}

//导出的方法
function importList(){
	var param = "";

	var status=$("#status").val();
	var number=$("#number").val();
	var org=$("#outStorageId").val();
	
	//调拨时间
	var outTime_begin = "";
	var outTime_end = "";
	if(MenuManager.menus["outdate"]){
		outTime_begin = MenuManager.menus["outdate"].getValue().timeStartValue;
		outTime_end = MenuManager.menus["outdate"].getValue().timeEndValue;
	}
	
	//调拨时间
	var arrivalTime_begin = "";
	var arrivalTime_end = "";
	if(MenuManager.menus["outdate"]){
		arrivalTime_begin = MenuManager.menus["arrivalTime"].getValue().timeStartValue;
		arrivalTime_end = MenuManager.menus["arrivalTime"].getValue().timeEndValue;
	}
	
	
	var numberDefault=$("#number").attr('defaultValue');
	param+="status="+status;
	param+="&number=";
	if (number!=numberDefault) {
		param+=number;
	}
	param+="&number="+number;
	param+="&org="+org;
	param+="&outTime_begin="+outTime_begin;
	param+="&outTime_end="+outTime_end;
	param+="&arrivalTime_begin="+arrivalTime_begin;
	param+="&arrivalTime_end="+arrivalTime_end;
	
	window.location.href=base+"/ebstorage/out/exportExcel?"+param;
}

function nubmerParentLink(data){
	if(null != data.parent){
		return '<a href="javascript:void()" onclick="showdataDetail(\''+data.parent.id+'\')">'+data.parent.number+'</a>';
	}else{
		return '';
	}
}
function nubmerLink(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.id+'\')">'+data.number+'</a>';
}

function viewDataDetail(id){
	var data={id:id};
	
	viewRow(data);
}
function showdataDetail(id){
		//可个性化实现
		if($list_editUrl && $list_editUrl!=''){
			var paramStr;
			if($list_editUrl.indexOf('?')>0){
				paramStr = '&VIEWSTATE=VIEW&id='+id;
			}else{
				paramStr = '?VIEWSTATE=VIEW&id='+id;
			}
			var dlg=art.dialog.open($list_editUrl+paramStr,
					{title:getTitle('VIEW'),
					lock:true,
					width:$list_editWidth,
					height:$list_editHeight,
					id:$list_dataType+'-VIEW',
					button:[{name:'打印',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
							dlg.iframe.contentWindow.printer(dlg);
						}
						return false;
					}},{name:'关闭'}]}
			);
		}
}
/**
 * 返回 审批状态
 * @param data
 * @returns
 */
function renderEnum(data){
	return approveEnum[data.approveStatus];
}

/**
 * 返回 调拨单状态
 * @param data
 * @returns
 */
function rederStatus(data){
	return approveEnum[data.followStatus];
}

/**
 * 操作
 */
function operateRender(data){
	//系统自动生成的  调拨批次数据 暂时 不能进行业务操作
//	if(data.outType == 'BATCH_OUT'){
//		return '';
//	}
	var resLink='';
	if(data.approveStatus == 'UNAPPROVE'){//未审核
		 if(edit_permission == 'Y'){
			 resLink+='<a href="javascript:editOutOrder(\'' + data.id + '\',\'编辑调拨单\');">编辑|</a>';
		 }
		 if(submit_permission == 'Y'){
			 resLink+='<a href="javascript:submitOutOrder(\'' + data.id + '\');">提交</a>';
		 }
		 return resLink;
	}else if(data.approveStatus == 'SUBMITED'){//已提交
		if(sp_permission == 'Y'){
			return '<a href="javascript:approveOutOrder(\'' + data.id + '\');">审批</a>';
		}else{
			return '';
		}
	}else if(data.approveStatus == 'REJECT'){//驳回
		if(resubmit_permission == 'Y'){
			resLink='<a href="javascript:editOutOrder(\'' + data.id + '\',\'重新提交\');">重新提交</a>';
		}
		return resLink;
	}else if(data.approveStatus == 'APPROVED'){//已审批
		if(tuihuo_permission == 'Y'){
			if(data.stauts == 'GOT'){
				
			}
		}
		/**
		 * 调拨单类型 为 总仓至 分仓 
		 *    状态 不在 已发货 已收货 手工取消  下 可以 进行 手工取消操作
		 */
		if(data.stauts != 'SENT' && data.stauts != 'GOT' && data.stauts != 'CLOSED' && data.stauts != 'HAND_CANCEL'  && data.outType == 'BATCH_ZC_OUT'){
			if(hand_cancel == 'Y'){
				resLink+='<a href="javascript:handCancel(\'' + data.id + '\');">手工取消</a>';
			}
		}
		return resLink;
	}
}

/**
 * 分批配送
 * @param data
 */
function batchOutPickDetail(data){
	var resLink='';
	if(data.outType == 'BATCH_ZC_OUT' && data.stauts == 'GOT'){
		resLink+='<a href="javascript:batchPick(\'' + data.id + '\');">分批配送</a>||';
		resLink+='<a href="javascript:batchOutPickDetailFun(\'' + data.id + '\');">详情</a>';
		resLink+='<a href="javascript:printBatchPick(\'' + data.id + '\');">打印分批</a>';
	}
	return resLink;
}

/**
 * 批量打印 分批配送单
 * @param id
 */
function printBatchPick(id){
	
}

/**
 * 跳转分批配送详情 页面
 * @param id
 */
function batchOutPickDetailFun(id){
	var dlg=art.dialog.open(getPath()+'/ebstorage/outbatchpick/detail?outParentId='+id+'&width='+$list_editWidth+'&height='+$list_editHeight,
			{title:"分批配送详情",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outbatchpickDetail',
			button:[{name:'关闭'}]}
	);
}

/**
 * 生成集配单
 */
function batchPick(id){
	var dlg=art.dialog.open(getPath()+'/ebstorage/outbatchpick/list?outParentId='+id+'&width='+$list_editWidth+'&height='+$list_editHeight,
			{title:"生成集配单",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outbatchpick',
			button:[{name:'关闭'}]}
	);
}

/**
=======
=======
 * 分批配送
 * @param data
 */
function batchOutPickDetail(data){
	var resLink='';
	if(data.outType == 'BATCH_ZC_OUT' && data.stauts == 'GOT'){
		resLink+='<a href="javascript:batchPick(\'' + data.id + '\');">集配</a>||';
		resLink+='<a href="javascript:batchOutPickDetailFun(\'' + data.id + '\');">详情</a>';
	}
	return resLink;
}

/**
 * 跳转分批配送详情 页面
 * @param id
 */
function batchOutPickDetailFun(id){
	var dlg=art.dialog.open(getPath()+'/ebstorage/outbatchpick/detail?outParentId='+id+'&width='+$list_editWidth+'&height='+$list_editHeight,
			{title:"分批配送详情",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outbatchpickDetail',
			button:[{name:'关闭'}]}
	);
}

/**
 * 生成集配单
 */
function batchPick(id){
	var dlg=art.dialog.open(getPath()+'/ebstorage/outbatchpick/list?outParentId='+id+'&width='+$list_editWidth+'&height='+$list_editHeight,
			{title:"生成集配单",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outbatchpick',
			button:[{name:'关闭'}]}
	);
}

/**
>>>>>>> .r6866
 * 手工取消调拨单
 * @param id
 */
function handCancel(id){
	art.dialog.confirm("确认是否取消此调拨指令，重新安排配送?",function(){
		$.post(getPath()+'/ebsite/outorderfollow/handcancel',{id:id},function(res){
			 if(res.STATE == 'SUCCESS'){
				   art.dialog.tips("操作成功");
				   resetList();
			   }else{
				   art.dialog.tips(res.MSG);
			   }
		},'json');
	});
}
function orderPrint(data){
	if (dy_outorder=='Y') {
		if (data.outType=='BATCH_FC_OUT') {
			return '<a href="javascript:void();" onclick="printOrderList(\''+data.id+'\');">打印订单</a>';
		}
	}
	return '';
}

/**
 * 打印订单
 */
function printOrderList(id){
	var dlg=art.dialog.open(getPath()+'/ebsite/outorderfollow/printOrderList?outOrderId='+id+'&height='+$list_editHeight+'&width='+$list_editWidth,
			{title:"打印订单",
			lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			id:'printOrderList',
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
	);
}
/**
 * 退货单录入 
 * @param id 调拨单ID
 */
function toBackGoods(id){
	var url = base + "/ebstorage/backgoods/adCKBackGoods?outId=" + id;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:'退货单录入',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"editBackGoods",
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}

/**
 * 业务操作
 * @param data
 */
function yewuOperate(data){
	if(data.approveStatus != 'APPROVED'){//未审核通过 
		return '';
	}
	var out_flag=false;//判断是否有   调拨单  调出仓库 的  操作 权限
	var got_flag=false;//判断 是否有 收货仓库  操作 权限
	var curOrgLongNumber=$("#curOrgLongNumber").val();
	if(data.outStorage.orgLongNumber == curOrgLongNumber){
		out_flag=true;
	}
	if(data.storage.orgLongNumber == curOrgLongNumber){
		got_flag=true;
	}
	
	var status=data.stauts;
	if(status == 'UNSEND'){//未发货
		if(out_flag){
			if(jianhuo_begin == 'Y'){
				return '<a href="javascript:pickFun(\''+data.id+'\',\'PICKING\');">开始拣货</a>';
			}else{
				return '';
			}
			
		}else{
			return '';
		}
	}else if(status == 'PICKING' || status == 'RE_PICKING'){//拣货中  
		if(out_flag){
			if(jianhuo_begin == 'Y'){
				return '<a href="javascript:pickEndFun(\''+data.id+'\');">拣货完成</a>';
			}else{
				return '';
			}
		}else{
			return '';
		}
	}else if(status == 'PICKED'){//拣货完成
		if(out_flag){
			if(qrfh_permission == 'Y'){
				return '<a href="javascript:confirmSendGoods(\''+data.id+'\',\'SENT\');">确认发货</a>';
			}
		}else{
			return '';
		}
	}else if(status == 'SENT'){//已发货
		if(got_flag){
			if(qrsh_permission == 'Y'){
				return '<a href="javascript:confirmGotGoods(\''+data.id+'\');">确认收货</a>';
			}
		}
	}
	return '';
}

/**
 * 修改拣货状态
 * @param id
 * @param status
 */
function pickFun(id,stauts){
	$.post(getPath()+'/ebsite/outorderfollow/updatePickStatus',{id:id,stauts:stauts},function(res){
		   if(res.STATE == 'SUCCESS'){
			   art.dialog.tips("操作成功");
			   resetList();
		   }else{
			   art.dialog.tips(res.MSG);
		   }
	},'json');
}

/**
 * 提交调拨单 至 可 审批状态
 * @param id
 */
function submitOutOrder(id){
	art.dialog.confirm("确定要提交该调拨单?",function(){
		   $.post(base+"/ebstorage/out/submitOutOrder",{id:id},function(res){
			   if(res.STATE == 'SUCCESS'){
				   art.dialog.tips("操作成功");
				   resetList();
			   }else{
				   art.dialog.tips(res.MSG);
			   }
		   },'json');
	});
}

/**
 * 确认收货操作
 */
function confirmGotGoods(id){
	var flag = true;
	var dlg = art.dialog.open(base + "/ebstorage/out/confirmGot?id=" + id,{
		 title:'确认收货',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"confirmOutOrder",
		 button:[{name:'确认',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});

}

/**
 * 拣货完成  填写 实发数量
 * @param id
 */
function pickEndFun(id){
	var flag = true;
	var dlg = art.dialog.open(base + "/ebstorage/out/pickEnd?id=" + id,{
		 title:'拣货完成',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"pickEndDialog",
		 button:[{name:'确认',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}

/**
 * 确认发货
 * @param id
 * @param type
 */
function confirmSendGoods(id){
	var flag = true;
	var dlg = art.dialog.open(base + "/ebstorage/out/confirmSend?id=" + id,{
		 title:'确认发货',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"confirmOutOrder",
		 button:[{name:'确认',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}

function showSummary(data){
	return '<span title="'+data.summary+'">'+data.summary+'</span>';
}

function approveOutOrder(id){
	var flag = true;
	var dlg = art.dialog.open(base + "/ebstorage/out/approve?id=" + id,{
		 title:'审批调拨单',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"approveOutOrder",
		 button:[{name:'同意',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'驳回',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.rejectOutOrder(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}

/**
 * 新增/修改弹出页面
 */
function editOutOrder(id,title){
	var url = base + "/ebstorage/out/add";
	if(id){
		url = base + "/ebstorage/out/edit?id=" + id;
	}
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:title,
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"editOutOrder",
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}

//回车查询事件
document.onkeydown=function(e){
	var keyCode= ($.browser.msie) ? e.keyCode : e.which ;  
	if(keyCode == 13){ 
		if(isAllfocus("number,org,status")){
			searchData();
		}
    }
}
//添加清空事件
function onEmpty(){
	delete $list_dataParam['number'];
	delete $list_dataParam['outStorageId'];
	delete $list_dataParam['storageId'];
	delete $list_dataParam['outApproveStatus'];
	delete $list_dataParam['status'];
	delete $list_dataParam['followStatus'];
	$("#number").val("调拨单号");
	$("#outStorageId").val("");
	$("#outStorageName").val("");
	$("#storageId").val("");
	$("#storageName").val("");
	$("#outApproveStatus").val("");
	$("#status").val("");
	$("#followStatus").val("");
	MenuManager.menus["outdate"].resetAll();
	MenuManager.menus["arrivalTime"].resetAll();
	MenuManager.menus["createDate"].resetAll();
	searchData();
}
//批量打印调拨单
function batchPrintOutorder(){
	/**
	 * 拼接选中调拨单的ID
	 */
	var outOrderIds='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			outOrderIds+=obj.id+',';
		}
	}
	if (outOrderIds=='') {
		art.dialog.tips("请选择数据!");
		 return false;
	}
	var url = base + "/ebstorage/outBatch/printOutOrderListByIds?outOrderIds="+outOrderIds;
	var flag = true;
	
	var dlg = art.dialog.open(url,{
		 title:'批量打印调拨单',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"printOutOrderListByIds",
		 button:[{name:'打印',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
					dlg.iframe.contentWindow.printer(dlg);
				}
				return false;
			}},{name:'关闭'}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}
//批量打印订单
function batchPrintOrder(){
	/**
	 * 拼接选中订单的ID
	 */
	var ids='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			ids+=obj.id+',';
		}
	}
	if (ids=='') {
		art.dialog.tips("请选择数据!");
		 return false;
	}
	var url = base + "/ebsite/outorderfollow/printOrderListByIds?ids="+ids;
	var flag = true;
	
	var dlg=art.dialog.open(url,
			{title:"批量打印订单",
			lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			id:'printOrderListByIds',
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
	);
}

////批量拣货
function batchPickOrder(){
	var ids='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			if(obj.stauts=='UNSEND'){
				ids+=obj.id+';';
			}			
		}
	}
	if (ids=='') {
		art.dialog.tips("请选择待拣货调拨单!");
		 return false;
	}
		art.dialog.confirm("确定批量拣货吗？",function(){
			$.post(getPath()+'/ebsite/outorderfollow/batchUpdatePickStatus',{id:ids,stauts:"PICKING"},function(res){
				   if(res.STATE == 'SUCCESS'){
					   art.dialog.tips("更新成功");
					   timeout();
				   }else{
					   art.dialog.tips(res.MSG);
				   }
			},'json');
		});
}

function timeout(){
	window.setTimeout(function(){ resetList(); },3000);
}

////批量发货
function batchSendOrder(){	
	var ids='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			if(obj.stauts=='PICKED'){
				ids+=obj.id+';';
			}			
		}
	}
	if (ids=='') {
		art.dialog.tips("请选择待已拣货调拨单!");
		 return false;
	}
	art.dialog.confirm("确定批量确认发货吗？",function(){
		$.post(getPath()+'/ebsite/outorderfollow/batchSendOutOrder',{id:ids,stauts:"SENT"},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips(res.MSG);
				timeout();
			}else{
				art.dialog.tips(res.MSG);
			}
		},'json');
	});
}
//打印调拨单
function outOrderPrint(data){
	if(null != data.parent){
		return '<a href="javascript:void();" onclick="showOutOrderList(\''+data.parent.id+'\');">打印调拨单</a>';
	}else {
		return '';
	}
}
function showOutOrderList(parentId){
	var dlg=art.dialog.open(getPath()+'/ebstorage/out/showOutOrderList?parentId='+parentId+'&width='+$list_editWidth+'&height='+$list_editHeight,
			{title:"查看子调拨单",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'showChildOutOrder',
			 button:[{name:'查看打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
	);
}
//批量拣货完成
function batchPickOrderEnd(){
	var ids='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			console.log(obj);
			if(obj.stauts=='PICKING' ||　obj.stauts=='RE_PICKING'){
				ids+=obj.id+';';
			}		
		}
	}
	if (ids=='') {
		art.dialog.tips("请选择拣货中的调拨单!");
		 return false;
	}
	art.dialog.confirm("确定批量确拣货完成吗？",function(){
		$.post(getPath()+'/ebsite/outorderfollow/batchPickOutOrderEnd',{ids:ids},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips(res.MSG);
				setTimeout(function(){
					resetList();
				},3000);
			}else{
				art.dialog.tips(res.MSG);
			}
			
		},'json');
	});
}