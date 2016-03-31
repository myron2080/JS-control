$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '客户姓名', name: 'customerName', align: 'left', width: 100},
            {display: '拨号人',name:'user.name',align:'center',width:100},
            {display: '呼叫号码',name:'callPhone',align:'left',width:120},
            {display: '拨打号码',name:'callNumber',align:'left',width:120},
            {display: '呼叫状态',name:'callStatusStr',align:'center',width:100},
            {display: '呼叫时长', name: 'callCount', align: 'center', width: 100}
        ],
	    checkbox:false,
	    fixedCellHeight:false,
	    enabledSort:true,
	    parms:{customerId:customerId},
	    url:base+"/bageCustomerList/calllHistoryData"
    }));
});