/**
 * 分店库存统计
 */

$list_editWidth="1050px";
$list_editHeight="550px";
$list_editUrl= getPath()+"/bi/storageRpt/edit";
$(document).ready(function() {
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '仓库名称', name: 'storageName', align: 'center', width: 110},
            {display: '期初库存', name: 'firstInventory', align: 'right', width:90, totalSummary: {
               	render: function (suminf, column, cell){
            		 return '<div>期初：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
            	},
            	align: 'left'
            }},
               {display: '期末库存', name: 'finalInventory', align: 'right', width:90, totalSummary: {
               	render: function (suminf, column, cell){
            		 return '<div>期末：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
            	},
            	align: 'left'
            }},
            {display: '商品总类', name: 'categoryCount', align: 'left', width:80, totalSummary: {
            	render: function (suminf, column, cell){
            		 return '<div>种类：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
            	},
            	align: 'left'
            }},
			{display: '本期入库单', columns:[
                                         {display: '笔数', name: 'instorageCount', align: 'center', width: 90, totalSummary: {
                                         	render: function (suminf, column, cell){
                                        		 return '<div>笔数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                        	},
                                        	align: 'left'
                                        }},
                                         {display: '金额', name: 'instorageAmount', align: 'right', width: 110, totalSummary: {
                                         	render: function (suminf, column, cell){
                                        		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                        	},
                                        	align: 'left'
                                        }}
			                           ]},
           {display: '本期出库单', columns:[
                                      {display: '出货笔数', name: 'outorderCount', align: 'center', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>笔数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '出货金额', name: 'outorderAmount', align: 'right', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '收货笔数', name: 'outorderInCount', align: 'center', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>笔数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '收货金额', name: 'outorderInAmount', align: 'right', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }}
		                           ]},     
           {display: '本期调拨单', columns:[
                                      {display: '调入笔数', name: 'transferInCount', align: 'center', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>笔数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '调入金额', name: 'transferInAmount', align: 'right', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '调出笔数', name: 'transferOutCount', align: 'center', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>笔数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '调出金额', name: 'transferOutAmount', align: 'right', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }}
		                           ]},
           {display: '本期退货单', columns:[
                                      {display: '退货笔数', name: 'backOutCount', align: 'center', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>笔数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '退货金额', name: 'backOutAmount', align: 'right', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '收货笔数', name: 'backInCount', align: 'center', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>笔数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '收货金额', name: 'backInAmount', align: 'right', width: 90, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }}
		                           ]}
        ],
        delayLoad : true,
        url: getPath()+"/bi/storageRpt/queryRptData",
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.id,rowData.storageName,queryStartDate,queryEndDate,rowData.storageId);
        }
    }));
	
	
	$("#serchBtn").click(function(){
		  selectList();
	});
	
	var params ={};
	params.width = 260;
	params.inputTitle = "统计日期";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	MenuManager.menus["createTime"].setValue(startTime,endTime);
	MenuManager.menus["createTime"].confirm();
	
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	 selectList();
        }
    });
	selectList();
});
//选择 仓库 backFun
function autoStorage(data,sourceObj){
	selectList();
}


function showdataDetail(id,storageName,queryStartDate,queryEndDate,storageId){
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/-/g,"/");
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/-/g,"/");
	} 
		//可个性化实现
		if($list_editUrl && $list_editUrl!=''){
			var paramStr;
			paramStr = '?storageName='+storageName+"&queryStartDate="+queryStartDate+"&queryEndDate="+queryEndDate+"&storageId="+storageId;
			var dlg=art.dialog.open($list_editUrl+paramStr,
					{title:"库存详情",
					lock:true,
					width:$list_editWidth,
					height:$list_editHeight,
					id:$list_dataType+'-VIEW',
					button:[{name:'关闭'}]}
			);
		}
}

var queryStartDate = "";
var queryEndDate = "";
//查询
function  selectList(){
	//提醒时间
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['startTime'] = queryStartDate;
	} else {
		delete $list_dataParam['startTime'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['endTime'] = queryEndDate;
	} else {
		delete $list_dataParam['endTime'];
	}
	$list_dataParam['storageId']=$("#storageId").val();
	resetList();
}
//清空
function onEmpty(){
	MenuManager.menus["createTime"].resetAll();
	$("#storageId").val("");
	$("#storageName").val("");
	selectList();
}

//导出
function importList(){
	var param = "";
	var storageId=$("#storageId").val();
	var startTime = MenuManager.menus["createTime"].getValue().timeStartValue;
	var endTime = MenuManager.menus["createTime"].getValue().timeEndValue;
	//查询开始时间
	if(startTime != ""){
		startTime = startTime.replace(/\//g,"-");
	} 
	//查询结束时间
	if(endTime != ""){
		endTime = endTime.replace(/\//g,"-");
	}
	
	param += "storageId=" + storageId;
	param += "&startTime=" + startTime;
	param += "&endTime=" + endTime;
	
	window.location.href=base+"/bi/storageRpt/exportExcel?"+param;
}