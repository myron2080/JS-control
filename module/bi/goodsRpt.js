/**
 * 出入库统计报表
 */
$list_editWidth="1050px";
$list_editHeight="550px";
$list_editUrl= getPath()+"/bi/storageRpt/editgoods";

var queryStartDate = "";
var queryEndDate = "";
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
            {display: '商品信息', columns:[
                                       {display: '商品名称', name: 'goodsName', align: 'center', width: 130},
                                       {display: '供应商', name: 'supplierName', align: 'center', width: 130},
                                       {display: '期初库存', name: 'firstInventory', align: 'center', width: 100, totalSummary: {
                                          	render: function (suminf, column, cell){
                                       		 return '<div>期初：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                       	},
                                       	align: 'left'
                                       }}, 
                               		   {display: '期末库存', name: 'finalInventory', align: 'center', width: 100, totalSummary: {
                                          	render: function (suminf, column, cell){
                                       		 return '<div>期末：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                       	},
                                       	align: 'left'
                                       }}, 
                                       {display: '商品类别', name: 'categoryName', align: 'center', width: 130},
                                       {display: '商品编码', name: 'goodsNumber', align: 'center', width: 130},
                                       {display: '规格型号', name: 'guige', align: 'center', width: 130},
                                       {display: '商品单价', name: 'goodsPrice', align: 'center', width: 100}
			                           ]},
			{display: '入库', columns:[
                                         {display: '次数', name: 'instorageCount', align: 'center', width: 80, totalSummary: {
                                         	render: function (suminf, column, cell){
                                        		 return '<div>次数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                        	},
                                        	align: 'left'
                                        }},
                                         {display: '数量', name: 'instorageNum', align: 'center', width: 100, totalSummary: {
                                         	render: function (suminf, column, cell){
                                        		 return '<div>数量：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                        	},
                                        	align: 'left'
                                        }},
                                         {display: '金额', name: 'instorageAmount', align: 'right', width: 100, totalSummary: {
                                         	render: function (suminf, column, cell){
                                        		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                        	},
                                        	align: 'left'
                                        }}
			                           ]},
           {display: '出库', columns:[
                                      {display: '次数', name: 'outCount', align: 'center', width: 80, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>次数：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '数量', name: 'outNum', align: 'center', width: 100, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>数量：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }},
                                      {display: '金额', name: 'outAmount', align: 'right', width: 100, totalSummary: {
                                      	render: function (suminf, column, cell){
                                    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                                    	},
                                    	align: 'left'
                                    }}
		                           ]}, 
		   {display: '盈亏', name: 'profit', align: 'right', width: 120, totalSummary: {
           	render: function (suminf, column, cell){
        		 return '<div>盈亏：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
        	},
        	align: 'left'
        }},
	   {display: '金额', name: 'amount', align: 'right', width: 120, totalSummary: {
       	render: function (suminf, column, cell){
    		 return '<div>金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
    	},
    	align: 'left'
        }}
        ],
        delayLoad : true,
        url: getPath()+"/bi/storageRpt/queryGoodsRpt",
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.id,rowData.storageName,queryStartDate,queryEndDate,rowData.goodsId);
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


function autoGoods(data,sourceObj){
	selectList();
}

function showdataDetail(id,storageName,queryStartDate,queryEndDate,goodsId){
		//可个性化实现
		if($list_editUrl && $list_editUrl!=''){
			var paramStr;
			paramStr = '?storageName='+storageName+"&queryStartDate="+queryStartDate+"&queryEndDate="+queryEndDate+"&goodsId="+goodsId;
			var dlg=art.dialog.open($list_editUrl+paramStr,
					{title:"出入库详情",
					lock:true,
					width:$list_editWidth,
					height:$list_editHeight,
					id:'商品统计-VIEW',
					button:[{name:'关闭'}]}
			);
		}
}

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
	
	$list_dataParam['provideExtId']=$("#provideExtId").val();
	$list_dataParam['goodsId']=$("#goodsId").val();
	resetList();
}
//清空
function onEmpty(){
	MenuManager.menus["createTime"].resetAll();
	$("#goodsId").val("");
	$("#goodsNumber").val("");
	$("#provideExtId").val("");
	$("#provideExtName").val("");
	selectList();
}
//导出
function importList(){
	var param = "";
	var goodsId = $("#goodsId").val();
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
	
	param += "startTime=" + startTime;
	param += "&endTime=" + endTime;
	param += "&goodsId=" + goodsId;
	window.location.href = base+"/bi/storageRpt/exportGoodsExcel?"+param;
}