$list_editUrl = getPath()+"/ebstorage/out/edit";//编辑及查看url
$list_dataType = "调拨单" ;
var approveEnum={UNAPPROVE:'未审批',APPROVED:'已审批',REJECT:'已驳回',UNSEND:'未发货',SENT:'已发货',GOT:'已收货',
		SUBMITED:'已提交',PICKING:'拣货中',PICKED:'拣货完成',HANG_UP:'已挂起',HAND_CANCEL:'已取消',CLOSED:'已关闭',
		ZC_READY_PICK:'总仓待拣货',ZC_PICKING:'总仓拣货中',ZC_PICKED:'总仓已拣货',ZC_SENDING:'总仓配送中',ZC_CLOSE:'总仓关闭',FC_GOT:'分仓已收货',
		FC_READY_PICK:'分仓待拣货',FC_PICKING:'分仓拣货中',FC_HANG_UP:'分仓已挂起',FC_PICKED:'分仓已拣货',FC_SENDING:'分仓配送中',
		HC_GOT:'合仓已收货',HAND_CANCEL:'手工取消',BATCH_ZC_OUT:'总分调拨单',BATCH_FC_OUT:'分合调拨单',COMMON_OUT:'普通调拨单'};
$(document).ready(function(){
	
	$("#batchOutPick").click(function(){
		batchOutPickFun();
	});
	
	$("#tab li").click(function(){
		changeTab(this);
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
         columns:[
         {display: '分配状态', name: '', align: 'center',  width: 130, render:renderBatchState},
         {display: '调拨时间', name: 'outTimeStr', align: 'center',  width: 130},
         {display: '调拨单号', name: 'number', align: 'center',  width: 120, isSort:false,render:nubmerLink},
         {display: '调拨类型', name: '', align: 'center',  width: 120, isSort:false,render:renderEnum},
         {display: '调出仓库', name: 'outStorage.name', align: 'left', width: 120},
         {display: '调入仓库', name: 'storage.name', align: 'left', width: 120},
         {display: '负责人/联系方式', name: 'storage.person.name', align: 'left', width: 160, isSort:false, render:showNameAndPhone},
         {display: '调拨状态', name: 'followStatus', align: 'center',  width: 80, render: renderEnum},
         {display: '订单跟踪', name: '', align: 'center', width: 60, isSort:false,render:orderFollow},
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
        checkbox : true,
        url:getPath() + '/ebstorage/out/listData?outParentId='+$("#outParentId").val(),
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.id);
        }
    }));
	
});

function renderBatchState(data){
	if(null != data.outBatchPick){
		return '<font color="blue">已分配</font>';
	}
	return '<font color="gray">未分配</font>';
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
	$("#batchPickState").val($(obj).attr("key"));
	searchData();
}

/**
 * 生成分配配送单
 * @returns {Boolean}
 */
function batchOutPickFun(){
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
	art.dialog.confirm("确定生成分批配送单?",function(){
		$.post(getPath()+'/ebstorage/outbatchpick/saveData',{outOrderIds:outOrderIds,outParentId:$("#outParentId").val()},function(res){
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
 * 查询
 */
function searchData(){
	var number=$("#number").val();
	if(number != '' && number != $("#number").attr("defaultValue")){
		$list_dataParam['number'] = number;
	}else{
		delete $list_dataParam['number'];
	}
	$list_dataParam['batchPickState'] = $("#batchPickState").val();
	resetList();
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

function renderEnum(data,index,value){
	return approveEnum[value];
}

function nubmerLink(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.id+'\')">'+data.number+'</a>';
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
				width:$("#width").val(),
				height:$("#height").val(),
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

function showNameAndPhone(data){
	if(null != data.storage.person){
		return data.storage.person.name+'/'+data.storage.person.phone;
	}else{
		return '';
	}
}

//订单跟踪
function orderFollow(data){
	return '<a href="javascript:void(0);" onclick="showOrderFollow(\''+data.id+'\')">订单跟踪</a>';
}

//打开订单 跟踪页面
function showOrderFollow(id){
	var dlg=art.dialog.open(getPath()+'/ebsite/outorderfollow/list?outOrderId='+id+'&height='+$list_editHeight+'&width='+$list_editWidth,
			{title:"订单跟踪",
			lock:true,
			width:$("#width").val(),
			height:$("#height").val(),
			id:'outOrderFollow',
			button:[{name:'关闭'}]}
	);
}

function nubmerParentLink(data){
	if(null != data.parent){
		return '<a href="javascript:void()" onclick="showdataDetail(\''+data.parent.id+'\')">'+data.parent.number+'</a>';
	}else{
		return '';
	}
}


