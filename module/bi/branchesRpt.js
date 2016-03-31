/**
 * 分店销售统计
 */
var queryStartDate = "";
var queryEndDate = "";
$list_editWidth="1050px";
$list_editHeight="550px";
$list_editUrl= getPath()+"/bi/storageRpt/editsupplierName";
$(document).ready(function() {
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$("#containBackBill").click(function(){
		selectList();
	});
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
		   {display: '分店名称', name: 'branchName', align: 'center', width: 130},
		   {display: '期初库存', name: 'firstInventory', align: 'center', width: 140, totalSummary: {
            	render: function (suminf, column, cell){
              		 return '<div>期初：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
              	},
              	align: 'left'
              }},
		   {display: '期末库存', name: 'finalInventory', align: 'center', width: 140, totalSummary: {
            	render: function (suminf, column, cell){
              		 return '<div>期末：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
              	},
              	align: 'left'
              }}, 
		   {display: '商品名称', name: 'goodsName', align: 'center', width: 130},
		   {display: '规格', name: 'guige', align: 'center', width: 100},
		   {display: '条形码', name: 'barCode', align: 'left', width: 100}, 
		   {display: '成本价', name: 'goodsPrice', align: 'right', width: 100}, 
		   {display: '销售商品数量', name: 'soldCount', align: 'center', width: 100, totalSummary: {
             	render: function (suminf, column, cell){
               		 return '<div>销售数量：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
               	},
               	align: 'left'
               }}, 
		   {display: '销售金额(元)', name: 'soldAmount', align: 'right', width: 120, totalSummary: {
             	render: function (suminf, column, cell){
               		 return '<div>销售金额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
               	},
               	align: 'left'
               }}
        ],
        delayLoad : true,
        url: getPath()+"/bi/storageRpt/queryBranchRpt",
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.storageId,rowData.goodsId,queryStartDate,queryEndDate);
        }
    }));
	
	function showdataDetail(storageId,goodsId,queryStartDate,queryEndDate){
		//可个性化实现
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/-/g,"/");
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/-/g,"/");
	} 
		if($list_editUrl && $list_editUrl!=''){
			var paramStr;
			paramStr = '?storageId='+storageId+"&queryStartDate="+queryStartDate+"&queryEndDate="+queryEndDate+"&goodsId="+goodsId;
			var dlg=art.dialog.open($list_editUrl+paramStr,
					{title:"销售订单详情",
					lock:true,
					width:$list_editWidth,
					height:$list_editHeight,
					id:'订单明细-VIEW',
					button:[{name:'关闭'}]}
			);
		}
}
	
	
	$("#serchBtn").click(function(){
		  selectList();
	});
	
	var params ={};
	params.width = 300;
	params.inputTitle = "确认时间";
	params.fmtEndDate = true;
	params.dateFmt = 'yyyy/MM/dd HH:mm:ss';
	MenuManager.common.create("DateRangeMenu","createTime",params);
	MenuManager.menus["createTime"].setValue(startTime,endTime);
	MenuManager.menus["createTime"].confirm();
	
	var params2 ={};
	params2.width = 300;
	params2.fmtEndDate = true;
	params2.dateFmt = 'yyyy/MM/dd HH:mm:ss';
	params2.inputTitle = "支付时间";	
	MenuManager.common.create("DateRangeMenu","payTime",params2);
	
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	 selectList();
        }
    });
	selectList();
});



//查询
function  selectList(){
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
	
	var keyWord = $('#keyWord').val();
	keyWord = keyWord.replace(/^\s+|\s+$/g, '');
	$('#keyWord').val(keyWord);
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	$list_dataParam['goodsId']=$("#goodsId").val();
	$list_dataParam['branchId']=$("#storageId").val();
	if($("#containBackBill").attr("checked")){
		$list_dataParam['containBackBill'] = '1';
	}else{
		delete $list_dataParam['containBackBill'];
	}
	resetList();
}
//选择分店
function autoFun(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	//清空 商品选择器
	$("#goodsNumber").val("");
	$("#goodsId").val("");
}

function autoGoods(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	selectList();
}
//清空
function onEmpty(){
	MenuManager.menus["createTime"].resetAll();
	$("#goodsId").val("");
	$("#goodsNumber").val("");
	$("#storageId").val("");
	$("#branchName").val("");
	$("#keyWord").val($("#keyWord").attr("defaultValue"));
	selectList();
}
//导出
function importList(){
	var param = "";
	var startTime = MenuManager.menus["createTime"].getValue().timeStartValue;
	var endTime = MenuManager.menus["createTime"].getValue().timeEndValue;
	var branchId = $("#storageId").val();
	var goodsId = $("#goodsId").val();
	var keyWord = $('#keyWord').val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		keyWord = keyWord.replace(/^\s+|\s+$/g, '');
	} else{
		keyWord = "";
	}
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
	param += "&branchId=" + branchId;
	param += "&goodsId=" + goodsId;
	param += "&keyWord=" + keyWord;
	if($("#containBackBill").attr("checked")){
		param += "&containBackBill=1";
	}
	window.location.href = base+"/bi/storageRpt/exportBranchExcel?"+param;
}