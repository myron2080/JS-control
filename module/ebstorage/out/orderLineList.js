$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '跟踪记录', name: 'desc', align: 'left',  width: 260, isSort:false},
         {display: '时间', name: 'createDateStr', align: 'center',  width: 140, isSort:false},
         {display: '操作人', name: 'opreator', align: 'center',  width: 140, isSort:false},
         {display: '电话', name: 'phone', align: 'center', width: 120, isSort:false}
		],
        width:"99%",
        url:getPath() + '/ebsite/orderline/listData?orderId='+$("#orderId").val()
    }));
});