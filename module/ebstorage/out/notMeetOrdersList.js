$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '订单号', name: 'order.orderNo', align: 'center',  width: 120, isSort:false, render:renderOrder},
         {display: '调拨批次号', name: 'outBatch.number', align: 'center',  width: 120, isSort:false},
         {display: '调拨单号', name: 'outOrder.number', align: 'center',  width: 120, isSort:false},
         {display: '缺货商品', name: 'goods.name', align: 'left',  width: 180, isSort:false},
         {display: '缺货数量', name: 'num', align: 'center',  width: 80, isSort:false},
         {display: '创建时间', name: 'createDateStr', align: 'center',  width: 180, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebsite/notMeetOrders/listData?outOrderId='+$("#outOrderId").val()+'&outBatchId='+$("#outBatchId").val()
    }));
});

function showFollowDetail(data){
	return '<a href="javascript:void(0);" onclick="showFollowDetailFun(\''+data.order.id+'\',\''+data.order.orderNo+'\');">'+data.track+'</a>';
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