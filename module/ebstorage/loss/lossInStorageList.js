/**
 * 报损入库单
 */
$list_editWidth="1050px";
$list_editHeight="550px";
var enumData={FC_LOSS:'分仓报损',HC_LOSS:'合仓报损'};
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$("#tab li").click(function(){
		changeTab(this);
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '操作', name: '', align: 'center',  width: 120, isSort:false,render:opreateRender},
         {display: '报损单类型', name: 'type', align: 'center',  width: 80, isSort:false,render:renderEnum},
         {display: '报损仓库', name: 'lossStorage.name', align: 'center',  width: 100, isSort:false},
         {display: '报损时间', name: 'createDateStr', align: 'center',  width: 140, isSort:false},
         {display: '入库状态', name: 'status', align : 'center', width : 80, isSort:false,render:renderStatus},
         {display: '报损入库单号', name: 'number', align: 'center',  width: 120,render : rendernumber, isSort:false},
         {display: '商品条形码', name: 'item.goods.barCode', align: 'center',  width: 120, isSort:false},
         {display: '商品名称', name: 'item.goods.name', align: 'left',  width: 180, isSort:false},
         {display: '规格', name: 'item.goods.specifications', align: 'center',  width: 100, isSort:false},
         {display: '单位', name: 'item.goods.unit', align: 'center',  width: 100, isSort:false},
         {display: '报损数量', name: 'item.lossNum', align: 'center',  width: 100, isSort:false},
         {display: '入库数量', name: 'item.actIn', align: 'center',  width: 100, isSort:false},
         {display: '入库仓库', name: 'gotStorage.name', align: 'left',  width: 120, isSort:false}, 
         {display: '关联调拨单号', name: 'outOrder.number', align: 'center',  width: 120, isSort:false,render:nubmerLink},
         {display: '报损发货单号', name: 'reportedLoss.number', align: 'center', width: 120, isSort:false,render:reportedLossNumberLink}
        /* {display: '发货数量', name: 'item.outCount', align: 'center',  width: 100, isSort:false},
         {display: '实收数量', name: 'item.getCount', align: 'center',  width: 100, isSort:false}*/
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebstorage/lossinstorage/listData'
    }));
	var params2 ={};
	params2.width = 300;
	params2.fmtEndDate = true;
	params2.dateFmt = 'yyyy/MM/dd HH:mm:ss';
	params2.inputTitle = "报损时间";	
	MenuManager.common.create("DateRangeMenu","lossConfirmDate",params2);
});

function renderEnum(rowData,rowIndex,rowDomElement){
	return enumData[rowDomElement];
}
function renderStatus(data){
	if(data.status == "UN_INSTORAGE"){
		return "未入库";
	} else {
		return "已入库";
	}
}
function reportedLossNumberLink(data){
	if(data.reportedLoss != null){
		return '<a href="javascript:showReportedLossNumberDetail({id:\'' + data.reportedLoss.id + '\',number:\''+data.reportedLoss.number+'\'});">'+data.reportedLoss.number+'</a>';
	}
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
	$("#type").val($(obj).attr("key"));
	searchData();
}

//清空
function onEmpty(){
	MenuManager.menus["lossConfirmDate"].resetAll();
	$("#status option:first").prop("selected", 'selected');
	$("#number").val($("#number").attr("defaultValue"));
	$("#reportedLossNumber").val($("#reportedLossNumber").attr("defaultValue"));
	$("#outOrderNumber").val($("#outOrderNumber").attr("defaultValue"));
	$("#goodsParam").val($("#goodsParam").attr("defaultValue"));
	$("#lossStorageParam").val($("#lossStorageParam").attr("defaultValue"));
	searchData();
}

function opreateRender(data){
	var resLink = "";
	if(data.status == "UN_INSTORAGE") {
		resLink+='<a href="javascript:inStorage(\'' + data.id + '\');">入库</a>';
	}
	return resLink;
}
function showReportedLossNumberDetail(obj){
	var dlg = art.dialog.open(getPath() + '/ebstorage/reportedloss/showDetail/'+obj.id,
			{title:'报损补货单 _查看',
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
function inStorage(data){
	var result = true;
	var dlg = art.dialog.open(getPath() + '/ebstorage/lossinstorage/lossInstorageDetail/'+data,
			{title:'报损入库',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'lossInstorageDetail',
			 button:[{name:'保存',callback:function(){
				 	var actIn = '';
				 	var lossNum = '';
				 	this.iframe.contentWindow.$("span[id='lossNum']").each(function(){
				 		lossNum += $(this).text() + ",";
				 	});
				 	this.iframe.contentWindow.$("span[id='actInId']").each(function(){
				 		actIn += $(this).text() + ",";
				 	});
				 	$.each(actIn, function(index, element){
				 		if(lossNum[index] != ',' && actIn[index] != ',') {
				 			if(actIn[index] > lossNum[index]) {
				 				art.dialog.alert("实入库存数不能大于报损数量");
				 				result = false;
				 			}
				 		}
				 	});
				 	if(result){
					 	$.ligerDialog.confirm('是否保存', function (yes){
					 		if(yes) {
								$.post(base + "/ebstorage/lossinstorage/lossInstorageDetail", {id : data, actIn : actIn}, function(res){
									 if(res.MSG == "SUCCESS"){
										window.location.reload();
									 } else {
										$.ligerDialog.error("保存失败");
									 } 
								},"json");
					 		} else {
					 			return true;
					 		}
						 });
				 	}
				 }},{name:'关闭',callback:function(){
						return true;
					}}]
				});
}

function nubmerLink(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.outOrder.id+'\')">'+data.outOrder.number+'</a>';
}
function showdataDetail(id){
	//可个性化实现
	var url=getPath()+"/ebstorage/out/edit";
	if(url && url!=''){
		var paramStr;
		if(url.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+id;
		}
		var dlg=art.dialog.open(url+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth,
				height:$list_editHeight,
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
function rendernumber(data){
	return '<a href="javascript:showDetail({id:\'' + data.id + '\',number:\''+data.number+'\'});">'+data.number+'</a>';
}
function showDetail(obj){
	var dlg = art.dialog.open(getPath() + '/ebstorage/lossinstorage/showlossInStorageDetail/'+obj.id,
			{title:'报损入库单 - 查看',
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
//导出
function importList(){
	var param = "";
	var number=$("#number").val();
	var outOrderNumber=$("#outOrderNumber").val();
	var status=$("#status").val();
	var queryStartDate = MenuManager.menus["lossConfirmDate"].getValue().timeStartValue;
	var queryEndDate = MenuManager.menus["lossConfirmDate"].getValue().timeEndValue;
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
	} 
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
	}

	if (number != ""&& number != $("#number").attr("defaultValue")) {
		param += "number=" + number;
	}
	if (outOrderNumber != ""&& outOrderNumber != $("#outOrderNumber").attr("defaultValue")) {
		param += "outOrderNumber=" + outOrderNumber;
	}
	if(status != ""){

		param += "status=" + status;
	}
	//查询开始时间
	if(queryStartDate != ""){
		param += "&queryStartDate=" + queryStartDate;
	}
	//查询结束时间
	if(queryEndDate != ""){
		param += "&queryEndDate=" + endTime;
	}
	
	window.location.href=base+"/ebstorage/lossinstorage/exportExcel?"+param;
}
function searchData() {
	var number=$("#number").val();
	if (number != ""&& number != $("#number").attr("defaultValue")) {
		$list_dataParam['number'] = number.trim();
	} else {
		delete $list_dataParam['number'];
	}
	var reportedLossNumber = $("#reportedLossNumber").val();
	if(reportedLossNumber != "" && reportedLossNumber != $("#reportedLossNumber").attr("defaultValue")) {
		$list_dataParam['reportedLossNumber'] = reportedLossNumber.trim();
	} else {
		delete $list_dataParam['reportedLossNumber'];
	}
	var outOrderNumber=$("#outOrderNumber").val();
	if (outOrderNumber != ""&& outOrderNumber != $("#outOrderNumber").attr("defaultValue")) {
		$list_dataParam['outOrderNumber'] = outOrderNumber.trim();
	} else {
		delete $list_dataParam['outOrderNumber'];
	}
	var goodsParam = $("#goodsParam").val();
	if(goodsParam != '' && goodsParam != $("#goodsParam").attr("defaultValue")) {
		$list_dataParam['goodsParam'] = goodsParam.trim();
	} else {
		delete $list_dataParam['goodsParam'];
	}
	var lossStorageParam = $("#lossStorageParam").val();
	if(lossStorageParam != '' && lossStorageParam != $("#lossStorageParam").attr("defaultValue")) {
		$list_dataParam['lossStorageParam'] = lossStorageParam.trim();
	} else {
		delete $list_dataParam['lossStorageParam'];
	}
	var status=$("#status").val();
	if(status != ""){
		$list_dataParam['status'] = status;
	} else {
		delete $list_dataParam['status'];
	}
	$list_dataParam['type'] = $("#type").val();
	var queryStartDate = MenuManager.menus["lossConfirmDate"].getValue().timeStartValue;
	var queryEndDate = MenuManager.menus["lossConfirmDate"].getValue().timeEndValue;

	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	resetList();
}
