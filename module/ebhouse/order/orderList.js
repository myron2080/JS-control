$list_addUrl = base+"/ebhouse/order/add";//新增url
var $list_backOffUrl = base+"/ebhouse/order/backOff"; //退劵url
var $list_useCouponsUrl = base+"/ebhouse/order/useCoupons"; //使用劵url
var $list_cancelUrl = base+"/ebhouse/order/cancel";	//取消订单url
$list_editWidth = "950px";
$list_editHeight = "486px";

$(function(){
	params ={};
	params.inputTitle = "有效期";	
	MenuManager.common.create("DateRangeMenu","effectTime",params);
	
	bindEvent();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', align: 'center', width: 130,render:opearender},
            {display: '订单号', name: 'order.number', align: 'left', width: 100},
            {display: '名称', name: 'coupons.name', align: 'left', width: 180},
            {display: '金额', name: 'order.total', align: 'right', width: 70},
            {display: '已收金额', name: 'order.payPrice', align: 'right', width: 70},
            {display: '订单状态',  align: 'center', width: 80,render:statusNameRender},
            {display: '券状态',  align: 'center', width: 60,render:statusNameRender1},
            {display: '购买人', name: 'order.buyer.name', align: 'left', width: 60},
            {display: '购买人电话', name: 'order.buyer.phone', align: 'left', width: 90},
            {display: '购买日期', name: 'order.formatBuyDate', align: 'left', width: 75},
            {display: '最后收款日期', name: 'order.formatPayDate', align: 'left', width: 75},
            {display: '物业信息', name: 'coupons.remark', align: 'left', width: 130},
            {display: '有效期', align: 'left', width: 120,render:periodRender},
            {display: '特殊操作', align: 'left', width: 100,render:sp_opearender}
            
        ],onDblClickRow : function (data, rowindex, rowobj) {
    		recieveView(data);
        } ,
        delayLoad:true,
        url:base+'/ebhouse/order/listData'
    }));
	
	searchData();
});

$("#clearData").click(function(){	
	MenuManager.menus["effectTime"].resetAll();
	$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	$("#houseProjectId").val("");
	$("#orderStatus").val("");
	$("#couponsStatus").val("");
	searchData();
});

function statusNameRender(rowData){
	if("DEALREPORT" == rowData.order.status ){
		return '<span style="color:red">' + rowData.order.statusName + '</span>';
	}
	return rowData.order.statusName;
}

function statusNameRender1(rowData){
	if(!isNotNull(rowData.coupons.statusName)){
		return "未购买";
	}
	
	if(rowData.coupons.status != "USED"){
		var temp = new Date().getTime();
		var endDate = new Date(rowData.coupons.endTime).getTime();
		if(temp > endDate){
			var fmt_temp = formate_yyyyMMdd(new Date());
			var fmt_endDate = formate_yyyyMMdd(new Date(rowData.coupons.endTime));
			if(rowData.coupons.status != "OVERDUE" && fmt_temp != fmt_endDate){
				$.post(base+'/ebhouse/coupons/updateOverdue',{id:rowData.coupons.id},function(res){
				},'json');
			}
			if(fmt_temp != fmt_endDate){
				return "已过期";
			}else{
				return rowData.coupons.statusName;
			}
		}
	}
	return rowData.coupons.statusName;
}

function periodRender(rowData){
	if(null != rowData.coupons && (null != rowData.coupons.startTime || rowData.coupons.endTime)){
		return rowData.coupons.formatStartTime+"-"+rowData.coupons.formatEndTime;
	}
	return "";
}

function opearender(rowData){
	if(("PAYED" == rowData.order.status || "WAITINGPAY" == rowData.order.status || "PARTREFUND" == rowData.order.status || "PARTPAYED" == rowData.order.status)
			&& (rowData.coupons.status == 'PAID'|| rowData.coupons.status == 'USED')){	//已付款
		var str ="";
		if(rowData.coupons.status != 'USED'){
			str += "<a href='javascript:void(0)' onclick='useCoupons(\""+rowData.id+"\")'>使用</a>  ";
		}
		
		if(("PARTPAYED" == rowData.order.status || "WAITINGPAY" == rowData.order.status) && (rowData.coupons.status == 'PAID' 
			|| rowData.coupons.status == 'USED' || rowData.coupons.status == 'OVERDUE')){
			if(str.length > 0){
				str+= " | ";
			}
			str+= "<a href='javascript:void(0)' onclick='recieveAdd(\""+rowData.id+"\")'>收款</a>";
		}
		if("PAYED" == rowData.order.status && rowData.coupons.status == 'USED'){
			if(str.length > 0){
				str+= " | ";
			}
			str += "<a href='javascript:void(0)' onclick='toDealReportEdit(\"" + rowData.id + "\",\"FASTSALE\")'>转成交</a>";
			str += " | <a href='javascript:void(0)' onclick='toDealReportEdit(\"" + rowData.id + "\",\"INNERDATA\")'>转内场</a>";
		}
		return str;
	}
	
	if(!isNotNull(rowData.coupons.status)){
		return "<a href='javascript:void(0)' onclick='recieveOffLineAdd(\""+rowData.order.id+"\")'>收款</a>";
	}
	
	return "";
}

function sp_opearender(rowData){
	var str ="";
	if('CLOSED' != rowData.order.status && "REFUNDING" != rowData.order.status){
		if("REJECTED" == rowData.order.status){
			str+="<a href='javascript:void(0)' id='" + rowData.id + "' onclick='backOff(\""+rowData.id+"\")'>重新提交</a>  ";
		}else{
			var temp = new Date();
			var endDate = new Date(rowData.coupons.endTime);
			var fmt_temp = formate_yyyyMMdd(temp);
			var fmt_endDate = formate_yyyyMMdd(endDate);
			if((temp.getTime() <= endDate.getTime() || fmt_temp == fmt_endDate) && isNotNull(rowData.order.status) 
					&& "CLOSEDORDER" != rowData.order.status && !rowData.confirmFlag && "DEALREPORT" != rowData.order.status ){
				str+="<a href='javascript:void(0)' id='" + rowData.id + "' onclick='editOrder(\""+rowData.id+"\")'>修改</a>  ";
			}
		}
	}
	if(("PAYED" == rowData.order.status || "PARTREFUND" == rowData.order.status || "PARTPAYED" == rowData.order.status) && (rowData.coupons.status == 'PAID'|| rowData.coupons.status == 'USED')){	//已付款
		str+="<a href='javascript:void(0)' onclick='backOff(\""+rowData.id+"\")'>退劵</a>  ";
	}
	
	if(("PAYED" == rowData.order.status || "PARTREFUND" == rowData.order.status) && (rowData.coupons.status == 'OVERDUE')){	
		str+="<a href='javascript:void(0)' onclick='backOff(\""+rowData.id+"\")'>退劵</a>";
	}
	
	if("WAITINGPAY" == rowData.order.status){	//待付款
		str+= " <a href='javascript:void(0)' onclick='cancel(\""+rowData.order.id+"\")'>退单</a>";
	}
	
//	$.post(base+'/ebhouse/order/getFundByBillId',{orderId:rowData.order.id},function(res){
//		 var state=res.fundDetailStatus;
//		 if(state!='NOTCONFIRM'){
//			$("#" +rowData.id ).remove();
//		 }
//	},'json');
	
	//添加打印操作；如果是已付款或者已使用添加打印功能；
	if("PAYED" == rowData.order.status && "USED" == rowData.coupons.status){
		str+= " <a href='javascript:void(0)' onclick='sPring(\""+rowData.id+"\")'>打印预览</a>";
	}
	
	if("CLOSED" == rowData.order.status && rowData.coupons.status == 'REFUND'){
		str+= " <a href='javascript:void(0)' onclick='refundPrint(\""+rowData.id+"\")'>退款打印</a>";
	}
	
	return str;
	
}
/**
 * 退款打印
 * @param id
 */
function refundPrint(id){
	var dlg = art.dialog.open(base+"/ebhouse/order/refundPrint?id=" + id,
			{title:"退款打印",
			 lock:true,
			 width:'815px',
			 height:'575px',
			 id:"REFUNDPRING",
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.toPrint){
						dlg.iframe.contentWindow.toPrint(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 /*resetList();*/
			 }
			});
}
/**
 * 打印结算确认书
 * @param id
 */
function sPring(id){
	var dlg = art.dialog.open(base+"/ebhouse/order/toSPrint?id=" + id,
			{title:"打印预览",
			 lock:true,
			 width:'800px',
			 height:'375px',
			 id:"PRINT",
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.toPrint){
						dlg.iframe.contentWindow.toPrint(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 /*resetList();*/
			 }
			});
}

function editOrder(id){
	var dlg = art.dialog.open(base+"/ebhouse/order/toOrderEdit?id=" + id,
			{title:"修改",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:'375px',
			 id:"USE-COUPONS",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 resetList();
			 }
			});
}

/**
 * 退单
 * @param id
 */
function cancel(id){
	var dlg = art.dialog.open($list_cancelUrl+"?id="+id,
			{title:"退单",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:'170px'||'auto',
			 id:"CANCEL-ORDER",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 resetList();
			 }
			});
}



/**
 * 收款
 * @param id
 */
function recieveAdd(id){
	var dlg = art.dialog.open(base+"/ebhouse/order/recieveAdd" +"?id="+id,//再次收款url
			{title:"收款",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:'575px',
			 id:"USE-COUPONS",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveRecieve){
						dlg.iframe.contentWindow.saveRecieve(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 resetList();
			 }
			});
}


/**
 * 收款
 * @param id
 */
function recieveOffLineAdd(id){
	var dlg = art.dialog.open(base+"/ebhouse/order/recieveOffLineAdd" +"?id="+id,//再次收款url
			{title:"收款",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:'575px',
			 id:"USE-COUPONS",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 resetList();
			 }
			});
}


function toDealReportEdit(orderCouponsId,saleTypeFlag){
	art.dialog.data("dealType","DEAL");//INTENTION
	var tempDlg =art.dialog.open(base +"/ebhouse/order/toDealReportCheck",
			{
				id : "addDealreportAgencySelect",
				title : "订单转成交报告选择",
				background : '#333',
				width : 200,
				height : 20,
				lock : true,
				button : [ {
					className : 'aui_state_highlight',
					name : '确定',
					callback : function() {
						if(tempDlg.iframe.contentWindow && tempDlg.iframe.contentWindow.confrimCheck){
							tempDlg.iframe.contentWindow.confrimCheck(tempDlg);
							art.dialog.list['addDealreportAgencySelect'].close();
							if(art.dialog.data("dealType") == "DEAL"){
								var dlg =art.dialog.open(base +"/ebhouse/order/toDealReportEdit?saleTypeFlag=" + saleTypeFlag + "&orderCouponsId=" + orderCouponsId,
										{
											id : "addDealreportAgency",
											title : "订单转成交报告",
											background : '#333',
											width : 950,
											height : $list_editHeight,
											lock : true,
											button : [ {
												className : 'aui_state_highlight',
												name : '保存',
												callback : function() {
													if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveDealReport){
														dlg.iframe.contentWindow.saveDealReport(dlg);
														searchData();
													}
													return false;
												}
											} , {
												name : '取消',
												callback : function() {
												}   
											}],
											close:function(){					
												resetList();
											 }
										});	
							}else{
								var dlg =art.dialog.open(base +"/ebhouse/order/toIntentionDealreportEdit?saleTypeFlag=" + saleTypeFlag + "&orderCouponsId=" + orderCouponsId,
										{
											id : "addDealreportAgency",
											title : "订单转临订成交报告",
											background : '#333',
											width : 950,
											height : $list_editHeight,
											lock : true,
											button : [ {
												className : 'aui_state_highlight',
												name : '保存',
												callback : function() {
													if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveDealReport){
														dlg.iframe.contentWindow.saveDealReport(dlg);
														searchData();
													}
													return false;
												}
											} , {
												name : '取消',
												callback : function() {
												}   
											}],
											close:function(){					
												resetList();
											 }
										});
							}
						}
						return false;
					}
				} , {
					name : '取消',
					callback : function() {
					}   
				}]
			});	
}





/**
 * 查看
 * @param id
 */
function recieveView(data){
	if(isNotNull(data.id)){
		var dlg = art.dialog.open(base+"/ebhouse/order/orderView" +"?id="+data.id,
				{title:"查看",
			lock:true,
			width:$list_editWidth||'auto',
			height:'555px',
			id:"USE-COUPONS",
			button:[{name:'关闭',callback:function(){
				flag = false;
				return true;
			}}],
			close:function(){
				resetList();
			}
				});
	}else{
		art.dialog.tips("线上购券未付款无查看信息.");
	}
}
/**
 * 使用劵
 * @param id
 */
function useCoupons(id){
	var dlg = art.dialog.open($list_useCouponsUrl+"?id="+id,
			{title:"使用",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:'250px',
			 id:"USE-COUPONS",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 resetList();
			 }
			});
}

/**
 * 退劵
 * @returns
 */
function backOff(id){
	var dlg = art.dialog.open($list_backOffUrl+"?id="+id,
			{title:"退劵",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:$list_editHeight||'auto',
			 id:"BACK-OFF",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 resetList();
			 }
			});
}

function searchData(){
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
	}
	
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
	
	//项目id
	var houseProjectId  = $("#houseProjectId").val();
	if(null == houseProjectId || "" == houseProjectId ){
		delete $list_dataParam['houseProjectId'];
	} else {
		$list_dataParam['houseProjectId'] = houseProjectId;
	}
	
	
	//当前人员id
	var currentId  = $("#currentId").val();
	if(null == currentId || "" == currentId ){
		delete $list_dataParam['currentId'];
	} else {
		$list_dataParam['currentId'] = currentId;
	}
	
	//订单状态
	var orderStatus = $("#orderStatus").val();
	if(null == orderStatus || "" == orderStatus ){
		delete $list_dataParam['orderStatus'];
	} else {
		$list_dataParam['orderStatus'] = orderStatus;
	}
	
	//券状态
	var couponsStatus = $("#couponsStatus").val();
	if(null == couponsStatus || "" == couponsStatus ){
		delete $list_dataParam['couponsStatus'];
	} else {
		$list_dataParam['couponsStatus'] = couponsStatus;
	}
	
	
	//万能搜索框
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	
	if(null != $("li.hover").attr("key")){
		$list_dataParam['orderTabStatus'] = $("li.hover").attr("key");
	}
	resetList();
}

/**
 * 绑定事件
 */
function bindEvent(){

	//切换页签
	$("#tab li").each(function(){
		$(this).bind("click",function(){
			$(this).siblings("li").removeClass("hover");
			$(this).addClass("hover");
			searchData();
		});
	});
	
	
	$("#addBtn").bind("click",function(){
		var dlg = art.dialog.open($list_addUrl,
				{title:"买券",
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:'515px',
				 id:"USE-COUPONS",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 resetList();
				 }
				});
	});
	
	$("#searchBtns").bind("click",function(){
		searchData();
	});
	
	//回车查询
	inputEnterSearch("searchKeyWord",searchData);
}

$("#exportBtn").click(function(){	
	 exportOrderByCond();
});

/**
* 导出Excel
*/ 
var param = "";
function exportOrderByCond(){
	param = "";	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		setParam('queryStartDate',queryStartDate);
	} 
	//查询结束时间
	if(queryEndDate != ""){
		setParam('queryEndDate',queryEndDate);
	} 
	
	//项目id
	var houseProjectId  = $("#houseProjectId").val();
	if(null != houseProjectId && "" != houseProjectId ){
		setParam('houseProjectId',houseProjectId);
	}
	
	//订单状态
	var orderStatus = $("#orderStatus").val();
	if(null != orderStatus && "" != orderStatus ){
		setParam('orderStatus',orderStatus);
	} 
	
	//万能搜索框
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
	}else{
		setParam('key',kw);
	}
	
	if(null != $("li.hover").attr("key")){
		setParam('orderTabStatus', $("li.hover").attr("key"));
	}
var url = getPath()+"/ebhouse/order/exportOrderByCond"+param;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}
function setParam(name,value){
	if(param==""){
		param="?"+name+"="+value;
		}else if(""!=value){
		param+="&"+name+"="+value;
		}
}
