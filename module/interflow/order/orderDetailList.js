$list_deleteUrl = getPath()+'/interflow/orderDetail/delete';
var cid="";
$(document).ready(function(){
	var oid=art.dialog.data("oid");
	 cid=art.dialog.data("cid");
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
	        {display: '点餐人', name: 'orderPerson.name', align: 'center', width: 100,},
            {display: '菜单', name: 'dishes.name', align: 'center', width: 140},
            {display: '类型', name: 'orderActivity.type.name', align: 'left', width: 50},
            {display: '份数', name: 'account', align: 'left', width: 50},
            {display: '单价', name: 'dishes.price', align: 'left', width: 80},
            {display: '价格', name: 'totalPrice', align: 'left', width: 50,render:toalPrice},
            {display: '参与时间', name: 'createTime', align: 'left', width: 80},
            {display: '备注', name: 'description', align: 'left', width: 150},
            {display: '操作', name: 'operate', align: 'center', width: 100,render:operateRender}
        ],
        height:'99%',
        fixedCellHeight:false,
        url:getPath()+'/interflow/orderDetail/listData?oid='+oid,
        onAfterShowData:function(){
        	$.post(getPath()+"/interflow/orderDetail/totalOrder",{tid:oid},function(data){
        		
                	$("#totalPerson").html(data.personCount);
                	$("#totalAccountt").html(data.account);
                	$("#totalAmounts").html(data.totalAmounts);
        	},'json');
        }
    }));
	$("#totalPerson").html();
});
function operateRender(data,filterData){
	var str="";
	if(curId==cid||curId==data.orderPerson.id){
		str= '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
		return str;
		
}
function toalPrice(data,filterData){
		return (data.dishes.price)*(data.account);
		
}