var left;
var right;
$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "放盘日期";
	MenuManager.common.create("DateRangeMenu","putDate",params);
	
	params.inputTitle = "成交日期";
	MenuManager.common.create("DateRangeMenu","dealDate",params);
	var columnsParam=[ 
		                {display: '排名', name: 'G_INDEX', align: 'center', width: 80},
			            {display: '楼盘名称', name: 'G_NAME', align: 'center', width: 180},
			            {display: '放盘总量', name: 'G_COU', align: 'center', width: 120}
		                  ];
	var columnsTwo=[ 
		                {display: '排名', name: 'G_INDEX', align: 'center', width: 80},
			            {display: '楼盘名称', name: 'G_NAME', align: 'center', width: 180},
			            {display: '成交总量', name: 'G_COU', align: 'center', width: 120}
		                  ];
	left = $("#leftGrid").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        parms:{saleType:$("#saleTypeOne").val()},
        url:getPath() + '/bi/p2pHotAnalysis/getHouse'
    }));
	right = $("#rightGrid").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsTwo,
        parms:{saleType:$("#saleTypeTwo").val()},
        url:getPath() + '/bi/p2pHotAnalysis/getTrade'
    }));
});

function searchDataOne(){
	var sD = "";
	var eD = "";
	if(MenuManager.menus["putDate"]){//天
		sD = MenuManager.menus["putDate"].getValue().timeStartValue;
		eD = MenuManager.menus["putDate"].getValue().timeEndValue;
	}
	$list_dataParam['saleType']=$("#saleTypeOne").val();
	$list_dataParam['startTime']=sD;
	$list_dataParam['endTime']=eD;
	
	left.setOptions({
		parms:$list_dataParam
	});
	left.loadData();
	left.changePage('first');
}

function searchDataTwo(){
	var sD = "";
	var eD = "";
	if(MenuManager.menus["dealDate"]){//天
		sD = MenuManager.menus["dealDate"].getValue().timeStartValue;
		eD = MenuManager.menus["dealDate"].getValue().timeEndValue;
	}
	$list_dataParam['saleType']=$("#saleTypeTwo").val();
	$list_dataParam['startTime']=sD;
	$list_dataParam['endTime']=eD;
	
	right.setOptions({
		parms:$list_dataParam
	});
	right.loadData();
	right.changePage('first');
}