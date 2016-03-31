/**
 * 报损发货单 列表
 */
$list_editWidth="1050px";
$list_editHeight="550px";
var enumData={UNAPPROVE:'未审批',APPROVED:'已审批',UN_SEND:'未发货',SENDING:'发货中',GOT_CONFIRM:'已收货',FC_LOSS:'分仓报损',HC_LOSS:'合仓报损'};
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
         {display: '操作', name: '', align: 'center',  width: 120, isSort:false, render:opreateRender},
         {display: '报损类型', name: 'type', align: 'center',  width: 80, isSort:false,render:renderEnum},
         {display: '报损时间', name: 'createDateStr', align: 'center',  width: 160, isSort:false},
         {display: '发货时间', name: 'sendDateStr', align: 'center', width: 160, isSort:false},
         {display: '补货状态', name: 'sendStatus', align: 'center',  width: 80, isSort:false,render:renderEnum},
         {display: '报损发货单号', name: 'number', align: 'left',  width: 150,render : rendernumber, isSort:false},
         {display: '商品条形码', name: 'item.goods.barCode', align: 'center',  width: 120, isSort:false},
         {display: '商品名称', name: 'item.goods.name', align: 'center',  width: 120, isSort:false},
         {display: '规格', name: 'item.goods.specifications', align: 'center',  width: 80, isSort:false},
         {display: '计量单位', name: 'item.goods.unit', align: 'center',  width: 80, isSort:false},
         {display: '报损数量', name: 'item.replenishmentNum', align: 'center',  width: 80, isSort:false},
         {display: '补货数量', name: 'item.actSendNum', align: 'center',  width: 80, isSort:false},
         {display: '发货仓库', name: 'replenishmentStorage.name', align: 'center',  width: 80, isSort:false},
         {display: '报损仓库', name: 'lossStorage.name', align: 'center',  width: 120, isSort:false},
         {display: '审核状态', name: 'status', align: 'center',  width: 80, isSort:false,render:renderEnum},
         {display: '总分调拨单号', name: 'outOrder.number', align: 'left',  width: 150, isSort:false,render:nubmerLink},
         {display: '分合调拨单号', name: 'item.outOrder.number', align: 'left',  width: 150, isSort:false,render:nubmerLink2},
         {display: '报损入库单号', name: 'lossInStorage.number', align: 'left',  width: 150, isSort:false,render:instorageRender},
         {display: '应发数量', name: 'item.num', align: 'center',  width: 80, isSort:false},
         {display: '实发数量', name: 'item.actNum', align: 'center',  width: 80, isSort:false}
		],
        width:"99%",
        delayLoad : true,
        url:getPath() + '/ebstorage/reportedloss/listData'
    }));

	var params2 ={};
	params2.width = 300;
	params2.fmtEndDate = true;
	params2.dateFmt = 'yyyy/MM/dd HH:mm:ss';
	params2.inputTitle = "报损时间";	
	MenuManager.common.create("DateRangeMenu","lossConfirmDate",params2);
	searchData();
});

/**
 * 关联报损发货单 
 * @param data
 * @returns
 */
function instorageRender(data){
	if(null != data.lossInStorage){
		return '<a href="javascript:showInStorageDetail(\'' + data.lossInStorage.id + '\');">'+data.lossInStorage.number+'</a>';
	}else{
		return '';
	}
}
/**
 * 跳转报损入库单 页面
 * @param id
 * @returns
 */
function showInStorageDetail(id){
	var dlg = art.dialog.open(getPath() + '/ebstorage/lossinstorage/showlossInStorageDetail/'+id,
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

function renderEnum(rowData,rowIndex,rowDomElement){
	return enumData[rowDomElement];
}

function rendernumber(data){
	return '<a href="javascript:showDetail({id:\'' + data.id + '\',number:\''+data.number+'\'});">'+data.number+'</a>';
}

function nubmerLink(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.outOrder.id+'\')">'+data.outOrder.number+'</a>';
}
function nubmerLink2(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.item.outOrder.id+'\')">'+data.item.outOrder.number+'</a>';
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
function showDetail(obj){
	var dlg = art.dialog.open(getPath() + '/ebstorage/reportedloss/showDetail/'+obj.id,
			{title:'报损发货单 _查看',
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
//清空
function onEmpty(){
	MenuManager.menus["lossConfirmDate"].resetAll();
	$("#status option:first").prop("selected", 'selected');
	$("#number").val($("#number").attr("defaultValue"));
	$("#outOrderid").val($("#outOrderid").attr("defaultValue"));
	searchData();
}
function searchData() {
	var number=$("#number").val();
	if (number != ""&& number != $("#number").attr("defaultValue")) {
		$list_dataParam['number'] = number.trim();
	} else {
		delete $list_dataParam['number'];
	}
	var outOrderNumber=$("#outOrderNumber").val();
	if (outOrderNumber != "" && outOrderNumber != $("#outOrderNumber").attr("defaultValue")) {
		$list_dataParam['outOrderNumber'] = outOrderNumber.trim();
	} else {
		delete $list_dataParam['outOrderNumber'];
	}
	$list_dataParam['type'] = $("#type").val();
	var status=$("#status").val();
	if(status != ""){
		$list_dataParam['status'] = status;
	} else {
		delete $list_dataParam['status'];
	}
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
	var goodsParam=$("#goodsParam").val();
	if(goodsParam != '' && goodsParam != $("#goodsParam").attr("defaultValue")){
		$list_dataParam['goodsParam'] = goodsParam.trim();
	}else{
		delete $list_dataParam['goodsParam'];
	}
	
	var lossStorageParam=$("#lossStorageParam").val();
	if(lossStorageParam != '' && lossStorageParam != $("#lossStorageParam").attr("defaultValue")){
		$list_dataParam['lossStorageParam'] = lossStorageParam.trim();
	}else{
		delete $list_dataParam['lossStorageParam'];
	}
	resetList();
}
//导出
function importList(){
	var param = "";
	var number=$("#number").val();
	var outOrderid=$("#outOrderid").val();
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
	if (outOrderid != ""&& outOrderid != $("#outOrderid").attr("defaultValue")) {
		param += "outOrderid=" + outOrderid;
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
	
	window.location.href=base+"/ebstorage/reportedloss/exportExcel?"+param;
}
function opreateRender(data){
	var got_flag=false;//收货权限
	var out_flag=false;//发货权限
	if(data.replenishmentStorage.orgLongNumber == $("#curOrgLongNumber").val()){
		out_flag=true;
	}
	if(data.lossStorage.orgLongNumber == $("#curOrgLongNumber").val()){
		got_flag=true;
	}
	var resLink='';
	if(data.sendStatus == 'UN_SEND'){//未发货之前 可进行 审核操作
		if(data.status == 'UNAPPROVE'){
			if(sh){
				resLink+='<a href="javascript:approvedLoss(\'' + data.id + '\',\'APPROVED\');">审核</a>';
			}
		}else if(data.status == 'APPROVED'){
			if(sh){
				resLink+='<a href="javascript:approvedLoss(\'' + data.id + '\',\'UNAPPROVE\');">取消审核</a>|';
			}
			if(qrfh){
				if(out_flag){
					resLink+='<a href="javascript:confirmSend(\'' + data.id + '\');">确认发货</a>';
				}
			}
		}
	}else{
		if(data.sendStatus == 'SENDING'){
			if(qrsh){
				if(got_flag){
					resLink+='<a href="javascript:confirmGot(\'' + data.id + '\');">确认收货</a>';
				}
			}
		}
	}
	return resLink;
}

/**
 * 确认收货
 * @param id
 */
function confirmGot(id){
	var flag = true;
	var dlg = art.dialog.open(getPath() + '/ebstorage/reportedloss/confirmGot/'+id,
			{title:'报损发货单_确认收货',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'confirmGotDialog',
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(dlg);
					}
					return false;
				}},{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
				 close:function(){
					 if(flag){
						 refresh();
					 }
				 }
			});
}


/**
 * 确认发货
 * @param id
 */
function confirmSend(id){
	var flag = true;
	var dlg = art.dialog.open(getPath() + '/ebstorage/reportedloss/confirmSend/'+id,
			{title:'报损发货单_确认发货',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'confirmSendDialog',
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(dlg);
					}
					return false;
				}},{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
				 close:function(){
					 if(flag){
						 refresh();
					 }
				 }
			});
}

function approvedLoss(id,status){
	var _title="确定要审核该报损发货单?";
	if(status == 'UNAPPROVE'){//取消审核操作
		_title="确定要取消审核该报损发货单?";
	}
	art.dialog.confirm(_title,function(){
		$.post(getPath()+'/ebstorage/reportedloss/approve',{id:id,status:status},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips("操作成功",1.5);
				resetList();
			}else{
				art.dialog.tips(res.MSG,1.7);
			}
		},'json');
	});
}
