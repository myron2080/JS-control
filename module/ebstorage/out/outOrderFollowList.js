var statusEnum={ZC_READY_PICK:'总仓待拣货',ZC_PICKING:'总仓拣货中',ZC_PICKED:'总仓已拣货',ZC_SENDING:'总仓配送中',FC_GOT:'分仓已收货',
		FC_PICKING:'分仓拣货中',FC_HANG_UP:'分仓已挂起',FC_PICKED:'分仓已拣货',FC_SENDING:'分仓配送中',HC_GOT:'合仓已收货',HC_PART_GOT:'合仓部分收货'};
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '订单号', name: 'order.orderNo', align: 'center',  width: 120, isSort:false, render:renderOrder},
         {display: '批次号', name: 'outBatch.number', align: 'center',  width: 120, isSort:false},
         {display: '订单位置', name: 'track', align: 'left',  width: 180, isSort:false, render:showFollowDetail},
         {display: '订单状态', name: 'status', align: 'left',  width: 180, isSort:false, render:showStatus},
         {display: '创建时间', name: 'createDateStr', align: 'center',  width: 180, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebsite/outorderfollow/listData?outOrderId='+$("#outOrderId").val()+'&outBatchId='+$("#outBatchId").val()
    }));
});

function showFollowDetail(data){
	return '<a href="javascript:void(0);" onclick="showFollowDetailFun(\''+data.order.id+'\',\''+data.order.orderNo+'\');">'+data.track+'</a>';
}

function showStatus(data){
	return statusEnum[data.status];
}


/**
 * 查看订单 详情
 * @param data
 */
function showFollowDetailFun(orderId,orderNo){
	var dlg = art.dialog.open(getPath() + '/ebsite/orderline/list?orderId='+orderId,
			{title:'订单号: '+orderNo,
			 lock:true,
			 width:$("#width").val(),
			 height:$("#height").val(),
			 id:'orderFollowDetail',
			 button:[{name:'关闭'}]
			});

}

//显示订单详情
function renderOrder(data){
	return '<a href="javascript:showDetail(\''+data.order.id+'\');">'+data.order.orderNo+'</a>';
}

function showDetail(id){
	var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+id,
			{title:'订单细节',
			 lock:true,
			 width:$("#width").val(),
			 height:$("#height").val(),
			 id:'showDetail',
			 button:[{name:'关闭'}]
			});
}