$list_editUrl = getPath() + "/ebsite/order/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/order/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/order/delete";// 删除url
$list_editWidth = "1010px";
$list_editHeight = "500px";
$list_dataType = "商品列表";// 数据名称
$(document).ready(
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [{
							display : '打印',
							name : '',
							align : 'center',
							width : 65,
							render:printOrder
						} ,{
							display : '操作',
							name : 'operate',
							align : 'center',
							width : 210,
							render : operateRender
						}, {
							display : '订单编号',
							name : '',
							align : 'center',
							width : 180,
							render : orderNoRender
						}, {
							display : '状态',
							name : 'status.name',
							align : 'center',
							width : 60
						}, {
							display : '物流状态',
							name : 'logisticsStatus.name',
							align : 'center',
							width : 120
						}, {
							display : '购买类型',
							name : 'buyTypeEnum.name',
							align : 'center',
							width : 60
						}, {
							display : '配送方式',
							name : 'pickupWay.name',
							align : 'center',
							width : 100
						}, {
							display : '收货地址',
							name : 'addressInfo',
							align : 'center',
							width : 130
						}, {
							display : '下单人',
							name : 'member.name',
							align : 'center',
							width : 80,
							render:function showName(data){if(data.member){if(data.member.nickName == '')return data.member.mobilePhone;else return data.member.nickName;}else{return ''}}
						}, {
							display : '下单人手机号',
							name : 'member.mobilePhone',
							align : 'center',
							width : 80
						}, {
							display : '下单时间',
							name : 'enterOrderTime',
							align : 'center',
							width : 130
						},{
							display : '下单设备',
							name : 'sysType',
							align : 'center',
							width : 80,
							render:function(data){if(data.sysType == 1){return '安卓';}else if(data.sysType == 2){return '苹果';}else if(data.sysType == 3){return 'PC';}else{return '';}}
						}, {
							display : '支付时间',
							name : 'payTime',
							align : 'center',
							width : 130
						},{
							display : '拣货人',
							name : 'pickingPeople.name',
							align : 'center',
							width : 80
						} , {
							display : '拣货时间',
							name : 'pickingTime',
							align : 'center',
							width : 130
						} , {
							display : '配送分店',
							name : 'storage.name',
							align : 'center',
							width : 80
						}, {
							display : '配送编号',
							name : 'person.number',
							align : 'center',
							width : 80
						}, {
							display : '配送员',
							name : 'person.name',
							align : 'center',
							width : 80
						}, {
							display : '确认接单',
							name : 'isGet',
							align : 'center',
							width : 80,
							render : function(data){
								if(data.isGet==0){
									return "否";
								}else {
									return "是";
								}
							}
						}, {
							display : '确认接单时间',
							name : 'isGetTime',
							align : 'center',
							width : 100
						},{
							display : '确认配送时间',
							name : 'confirmDate',
							align : 'center',
							width : 100
						}, {
							display : '配送截止时间',
							name : 'personSendTime',
							align : 'center',
							width : 130
						}, {
							display : '购买数量',
							name : 'num',
							align : 'center',
							width : 60
						}, {
							display : '订单价格',
							name : 'actual',
							align : 'center',
							width : 120,
							totalSummary:
		                    {
		                        render: function (suminf, column, cell)
		                        {
		                            return '<div>订单总计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
		                        },
		                        align: 'left'
		                    }
						}, {
							display : '优惠金额',
							name : 'couponPrice',
							align : 'center',
							width : 120,
							totalSummary:
		                    {
		                        render: function (suminf, column, cell)
		                        {
		                            return '<div>优惠总计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
		                        },
		                        align: 'left'
		                    }
						}, {
							display : '配送费',
							name : 'sendCost',
							align : 'center',
							width : 120,
							totalSummary:
		                    {
		                        render: function (suminf, column, cell)
		                        {
		                            return '<div>配送总计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
		                        },
		                        align: 'left'
		                    }
						}, {
							display : '支付总计',
							name : 'total',
							align : 'center',
							width : 120,
							totalSummary:
		                    {
		                        render: function (suminf, column, cell)
		                        {
		                            return '<div>支付总计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
		                        },
		                        align: 'left'
		                    }
						}, {
							display : '配送时间类型',
							name : 'dateStage.name',
							align : 'center',
							width : 130
						}, {
							display : '是否需要发票',
							name : 'isInvoice',
							align : 'center',
							width : 100,
							render:function(data){if(data.isInvoice == 1){return '是'}else{return '否'}}
						}/*, {
							display : '发票内容',
							name : 'invoiceDesc',
							align : 'center',
							width : 130
						}*/, {
							display : '退单时间',
							name : 'chargeBackTime',
							align : 'center',
							width : 130
						}, {
							display : '退单操作人',
							name : 'chargeBackOprator.nickName',
							align : 'center',
							width : 100,
							render:function showBOName(data){
								if(data.chargeBackOprator){
									if(data.chargeBackOprator.nickName == '')
										return data.chargeBackOprator.mobilePhone;
									else return data.chargeBackOprator.nickName;
								}else{
									return ''
								}
							}
						} , {
							display : '确认收货人',
							name : '',
							align : 'center',
							width : 100,
							render:function showName(data){if(data.confirmMember !=null ){if(data.confirmMember.nickName == '')return data.confirmMember.mobilePhone;else return data.confirmMember.nickName;}else{return '';}}
						} , {
							display : '确认时间',
							name : 'finishTime',
							align : 'center',
							width : 130
						}, {
							display:'订单操作原因',
							name:'operateCauseEnumStr',
							align:'left',
							width:'150'
						},{
							display : '打印信息',
							name : '',
							align : 'center',
							width : 320,
							render:function showPrint(data){if(data.lastPrintName !=null && data.lastPrintName !=''){return data.lastPrintName+'于'+data.lastPrintTime+'最后打印,共打印了'+data.printCount+'次';}}
						}],
						delayLoad : true,
						onDblClickRow:function(rowData,rowIndex,rowDomElement){
							showDetail(rowData);
					    },
					    checkbox:true,
						url : getPath() + '/ebsite/order/listData'
					}));
			
			var params ={};
			params.width = 310;
			params.inputTitle = "下单时间";	
			params.dateFmt = 'yyyy/MM/dd HH:mm:ss';
			params.fmtEndDate = true;
			MenuManager.common.create("DateRangeMenu","createdate",params);
			
			params.inputTitle = "退单时间";	
			MenuManager.common.create("DateRangeMenu","outOrderDate",params);
			
			params.inputTitle = "确认收货时间";
			MenuManager.common.create("DateRangeMenu","finishTime",params);
			
			params.inputTitle = "支付时间";
			MenuManager.common.create("DateRangeMenu","payDate",params);
			//初始化时间
			var curentDate=new Date();
			MenuManager.menus["payDate"].setValue(curentDate.toLocaleDateString()+" 00:00:00",curentDate.toLocaleDateString()+" 23:59:59");
			MenuManager.menus["payDate"].confirm();
			
			
			searchData();
			$("#tab").find("li").click(function() {
				$(this).addClass("hover");
				$(this).siblings("li").removeClass("hover");
				searchData();
			});
			// 回车 事件
			$('#keyWord,#storageKey,#addressInfo').on('keyup', function(event) {
				if (event.keyCode == "13") {
					searchData();
				}
			});
			
			//导出按钮
			$("#exportBtn").bind("click",function(){
				exportOrder();
			});
			//批量打印订单
			$("#printOrderBatch").bind("click",function(){
				printOrderBatch();
			});
			
			//一键分配未分配的调拨单
			$("#onceKeyFp").bind("click",function(){
				onceKeyFp();
			});
			
			$("#importInventory a").click(function(){//订单编码导入
				importUpdateStatus();
			});
		});

//导入
function importUpdateStatus(){
	var flag = false;
	var url= base+"/ebsite/order/updateStatusPage"
	var dlg = art.dialog.open(url,
			{title:"订单编码导入",
			 lock:true,
			 width:'635px',
			 height:'130px',
			 id:"importUpdateStatusDialog",
			 button:[{name:"导入",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
						dlg.iframe.contentWindow.saveImportData(this);
					}
					return false;
				}},{name:'取消',callback:function(){
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


//一键分配未分配的调拨单
function onceKeyFp(){
	//提示用户操作
	art.dialog.confirm('一键分配未分配的订单,请确认?',function(){
		//禁用操作
		$("#onceKeyFp").off("click");
		$("#onceKeyFp").removeClass("greenbtn");
		$("#onceKeyFp").addClass("graybtn");
		$.post(base+'/ebsite/order/onceKeyFp',{},function(res){
			art.dialog.alert(res.MSG);
			if(res.STATE == 'SUCCESS'){
				searchData();
			}
			$("#onceKeyFp").bind("click",function(){
				onceKeyFp();
			});
			$("#onceKeyFp").removeClass("graybtn");
			$("#onceKeyFp").addClass("greenbtn");
		},'json');
		return true;
	},function(){
		return true;
	});
}


/**
 * 清空按钮
 */
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	$('#addressInfo').attr("value", $("#addressInfo").attr("defaultValue"));
	delete $list_dataParam['pickupWay'];
	$("#pickupWay").val('');
	delete $list_dataParam['buyTypeEnum'];
	$("#buyTypeEnum").val('');
	delete $list_dataParam['dateStage'];
	$('#dateStage').val('');
	$('#totalMin').val('');
	$('#totalMax').val('');
	$('#logisticsStatus').val('');
	$('#sendStorageId').val('');
	$('#sendStorageName').attr("value",$("#sendStorageName").attr("defaultValue"));
	$("#storageKey").attr("value",$("#storageKey").attr("defaultValue"));
	$("#personIsGet").removeAttr("checked");
	$("#iserror").removeAttr("checked");
	
	$("#distributionClerkIsNull").removeAttr("checked");
	$("#pickingPeopleIsNull").removeAttr("checked");
	
	MenuManager.menus["createdate"].resetAll();
	MenuManager.menus["outOrderDate"].resetAll();
	MenuManager.menus["finishTime"].resetAll();
	MenuManager.menus["payDate"].resetAll();
	//清空，捡货人/配送人
	clearDataPicker('pickingPeople');
	clearDataPicker('dealPerson');
	searchData();
}
/**
 * 打印数据
 *  add by lhh
 */
function printOrder(data){
	var returnHtml="";
	//var  key=$("#tab").find("li.hover").attr("key");
//	if (data.status.value == 'ALREADYPAY') {
//		if (data.lastPrintName!=null && data.lastPrintName!='') {
//			returnHtml+='<div title=\''+data.lastPrintName+'于'+data.lastPrintTime+'最后打印,共打印了'+data.printCount+'次'+'\'>';
//			returnHtml+='<a  href="javascript:printeOrderList({id:\'' + data.id+ '\',orderNo:\''+data.orderNo+'\'});">打印('+data.printCount+')</a>';
//			returnHtml+='</div>'
//		}else {
//			returnHtml+='<div title=未打印过>';
//			returnHtml+='<a  href="javascript:printeOrderList({id:\'' + data.id+ '\',orderNo:\''+data.orderNo+'\'});">打印('+data.printCount+')</a>';
//			returnHtml+='</div>'
//		}
//	}
	if(data.status.value != 'ALREADYORDER'){
		if (data.lastPrintName!=null && data.lastPrintName!='') {
			returnHtml+='<div title=\''+data.lastPrintName+'于'+data.lastPrintTime+'最后打印,共打印了'+data.printCount+'次'+'\'>';
			returnHtml+='<a  href="javascript:printeOrderList({id:\'' + data.id+ '\',orderNo:\''+data.orderNo+'\'});">打印('+data.printCount+')</a>';
			returnHtml+='</div>'
		}else {
			returnHtml+='<div title=未打印过>';
			returnHtml+='<a  href="javascript:printeOrderList({id:\'' + data.id+ '\',orderNo:\''+data.orderNo+'\'});">打印('+data.printCount+')</a>';
			returnHtml+='</div>'
		}
	}
	return returnHtml;
}
function printeOrderList(data){
	if (dy!='Y') {
		art.dialog.tips('您无权操作此项！');
		return ;
	}else{
	var dlg = art.dialog.open(getPath() + '/ebsite/order/printOrderDetail/?id='+data.id+"&orderNo="+data.orderNo,
			{title:'打印订单',
			 lock:true,
			 width:'760px',
			 height:'340px',
			 id:'showDetail',
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]
			});
	}
}
/**
 * 导出Excel
 */ 
function exportOrder(){
	var params='';
	// 订单状态
	if ($("#tab").find("li.hover").attr("key") != "") {
		params += '&status='+$("#tab").find("li.hover").attr("key");
	}
	// 关键字
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		params +='&keyWord='+keyWord;
	} 
	var pickupWay = $("#pickupWay").val();
	if (pickupWay) {
		params +='&pickupWay='+pickupWay;
	}
	var buyTypeEnum = $("#buyTypeEnum").val();
	if (buyTypeEnum) {
		params +='&buyTypeEnum='+buyTypeEnum;
	}
	var dateStage = $("#dateStage").val();
	if (dateStage) {
		params +='&dateStage='+dateStage;
	}
	
	//创建时间
	var createTime_begin = "";
	var createTime_end = "";
	if(MenuManager.menus["createdate"]){
		createTime_begin = MenuManager.menus["createdate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["createdate"].getValue().timeEndValue;
	}
	if(createTime_begin != ""){
		params +='&createTime_begin='+createTime_begin;
	} 
	if(createTime_end != ""){
		params +='&createTime_end='+createTime_end;
	}
	
	//退单时间
	var outOrderTime_begin = "";
	var outOrderTime_end = "";
	if(MenuManager.menus["outOrderDate"]){
		outOrderTime_begin = MenuManager.menus["outOrderDate"].getValue().timeStartValue;
		outOrderTime_end = MenuManager.menus["outOrderDate"].getValue().timeEndValue;
	}
	if(outOrderTime_begin != ""){
		params +='&outOrderTime_begin='+outOrderTime_begin;
	}
	if(outOrderTime_end != ""){
		params +='&outOrderTime_end='+outOrderTime_end;
	} 
	
	//确认收货时间
	var finishTime_begin = "";
	var finishTime_end = "";
	if(MenuManager.menus["finishTime"]){
		finishTime_begin = MenuManager.menus["finishTime"].getValue().timeStartValue;
		finishTime_end = MenuManager.menus["finishTime"].getValue().timeEndValue;
	}
	if(finishTime_begin != ""){
		params +='&finishTime_begin='+finishTime_begin;
	}
	if(finishTime_end != ""){
		params +='&finishTime_end='+finishTime_end;
	} 
	
	//支付时间
	var payDate_begin = "";
	var payDate_end = "";
	if(MenuManager.menus["payDate"]){
		payDate_begin = MenuManager.menus["payDate"].getValue().timeStartValue;
		payDate_end = MenuManager.menus["payDate"].getValue().timeEndValue;
	}
	if(payDate_begin != ""){
		params +='&payDate_begin='+payDate_begin;
	}
	if(payDate_end != ""){
		params +='&payDate_end='+payDate_end;
	}
	
	//配送仓库
	var storageId = $('#sendStorageId').val();
	if (storageId) {
		params +='&storageId='+storageId;
	} 
	//订单总价最低值
	var totalMin = $('#totalMin').val();
	//订单总价最高值
	var totalMax = $('#totalMax').val();
	if (totalMin) {
		params +='&totalMin='+totalMin;
	}
	if (totalMax) {
		params +='&totalMax='+totalMax;
	}
	
	// 是否删除，级联搜索
	var isDelete = $('#isDelete').attr("checked");
	if (isDelete && isDelete == 'checked') {
		params +='&isDelete=1';
	}else{
		params +='&isdeleteext=y';
	}
	
	//导出过滤已拆分的订单
	var url = getPath()+"/ebsite/order/exportOrder?isSplit=1&l=1"+params;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}

//显示订单详情
function orderNoRender(data){
	var returnHtml='';
	if(data.status.value=="ALREADDISTRIBUTION"||data.status.value=="ALREADYPAY"||data.status.value=="ALREADRECEIPT")
	{
		  returnHtml+='<a href="javascript:showDetail({id:\'' + data.id + '\',orderNo:\''+data.orderNo+'\'});">'+data.orderNo+'</a>';
	}
	else 
	{
		  returnHtml+='<a href="javascript:showDetail1({id:\'' + data.id + '\',orderNo:\''+data.orderNo+'\'});">'+data.orderNo+'</a>';	
	}
	if(data.isDelete == 1){//表示已删除
		returnHtml += ' <span style="font-size:10px;color:red;">已删</span>';
	}
	return returnHtml;
}

function showDetail(obj){
	//var flag = true;
/*	if(sfxssqshan=='Y')//判断是否有此权限
	{
		flag = false;
	}	*/
	if(sfxssqshan=='Y')
	{
		var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+obj.id,
				{title:'订单细节',
				 lock:true,
				 width:(window.screen.width  * 53 /100)+"px",
				 height:(window.screen.height  * 41 /100)+"px",
				 id:'showDetail',
				// button:[{name:'关闭'}]
				 button:[{name:'申请售后',disabled:false,callback:function(){
					    applicationAferSale(obj);
						return false;
					}},{name:'关闭',callback:function(){
						flag = false;
						return true;
					}}]
				});
	}
	else
	{
		var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+obj.id,
				{title:'订单细节',
				 lock:true,
				 width:(window.screen.width  * 53 /100)+"px",
				 height:(window.screen.height  * 41 /100)+"px",
				 id:'showDetail',
				 button:[{name:'关闭'}]
				});
	}	
}
function showDetail1(obj){
/*	var flag = false;
	if(sfxssqshan=='Y')//判断是否有此权限
	{
		flag = true;
	}*/
	if(sfxssqshan=="Y")
    {
		var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+obj.id,
				{title:'订单细节',
				 lock:true,
				 width:(window.screen.width  * 53 /100)+"px",
				 height:(window.screen.height  * 41 /100)+"px",
				 id:'showDetail1',
				 //button:[{name:'关闭'}]
				 button:[{name:'申请售后',disabled:true,callback:function(){
						return false;
					}},{name:'关闭',callback:function(){
						flag = false;
						return true;
					}}]
				});
    }
	else
	{
		var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+obj.id,
				{title:'订单细节',
				 lock:true,
				 width:(window.screen.width  * 53 /100)+"px",
				 height:(window.screen.height  * 41 /100)+"px",
				 id:'showDetail1',
				 button:[{name:'关闭'}]
				});
	}
}
  
//显示申请售后页面
function applicationAferSale(obj){
	var dlg = art.dialog.open(getPath() + '/ebsite/order/applicationAferSale?id='+obj.id,
			{title:'申请售后',
			 lock:true,
			 width:(window.screen.width  * 18 /100)+"px",
			 height:(window.screen.height  * 20 /100)+"px",
			 id:'applicationAferSale'
			});
}

function initCount() {
	var params='';
	// 订单状态
	/*if ($("#tab").find("li.hover").attr("key") != "") {
		params += '&status='+$("#tab").find("li.hover").attr("key");
	}*/
	
	//创建时间
	var createTime_begin = "";
	var createTime_end = "";
	if(MenuManager.menus["createdate"]){
		createTime_begin = MenuManager.menus["createdate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["createdate"].getValue().timeEndValue;
	}
	if(createTime_begin != ""){
		params +='&createTime_begin='+createTime_begin;
	} 
	if(createTime_end != ""){
		params +='&createTime_end='+createTime_end;
	}
	
	// 关键字
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		params +='&keyWord='+keyWord;
	} 
	// 收货地址
	var addressInfo = $("#addressInfo").val();
	if (addressInfo && ($('#addressInfo').attr("defaultValue") != addressInfo)) {
		params +='&addressInfo='+addressInfo;
	} else {
		delete $list_dataParam['addressInfo'];
	}
	var pickupWay = $("#pickupWay").val();
	if (pickupWay) {
		params +='&pickupWay='+pickupWay;
	}
	var buyTypeEnum = $("#buyTypeEnum").val();
	if (buyTypeEnum) {
		params +='&buyTypeEnum='+buyTypeEnum;
	}
	var dateStage = $("#dateStage").val();
	if (dateStage) {
		params +='&dateStage='+dateStage;
	}
	//物流状态
	var logisticsStatus=$("#logisticsStatus").val();
	if (logisticsStatus) {
		params +='&logisticsStatus='+logisticsStatus;
	}
	//退单时间
	var outOrderTime_begin = "";
	var outOrderTime_end = "";
	if(MenuManager.menus["outOrderDate"]){
		outOrderTime_begin = MenuManager.menus["outOrderDate"].getValue().timeStartValue;
		outOrderTime_end = MenuManager.menus["outOrderDate"].getValue().timeEndValue;
	}
	if(outOrderTime_begin != ""){
		params +='&outOrderTime_begin='+outOrderTime_begin;
	}
	if(outOrderTime_end != ""){
		params +='&outOrderTime_end='+outOrderTime_end;
	} 
	
	
	//确认收货时间
	var finishTime_begin = "";
	var finishTime_end = "";
	if(MenuManager.menus["finishTime"]){
		finishTime_begin = MenuManager.menus["finishTime"].getValue().timeStartValue;
		finishTime_end = MenuManager.menus["finishTime"].getValue().timeEndValue;
	}
	if(finishTime_begin != ""){
		params +='&finishTime_begin='+finishTime_begin;
	}
	if(finishTime_end != ""){
		params +='&finishTime_end='+finishTime_end;
	} 
	
	//支付时间
	var payDate_begin = "";
	var payDate_end = "";
	if(MenuManager.menus["payDate"]){
		payDate_begin = MenuManager.menus["payDate"].getValue().timeStartValue;
		payDate_end = MenuManager.menus["payDate"].getValue().timeEndValue;
	}
	if(payDate_begin != ""){
		params +='&payDate_begin='+payDate_begin;
	}
	if(payDate_end != ""){
		params +='&payDate_end='+payDate_end;
	} 
	
	//配送仓库
	var storageId = $('#sendStorageId').val();
	if (storageId) {
		params +='&storageId='+storageId;
	} 
	//订单总价最低值
	var totalMin = $('#totalMin').val();
	//订单总价最高值
	var totalMax = $('#totalMax').val();
	if (totalMin) {
		params +='&totalMin='+totalMin;
	}
	if (totalMax) {
		params +='&totalMax='+totalMax;
	}
	//捡货人
	var pickingPeopleId=$("#pickingPeopleId").val();
	if(pickingPeopleId != $("#pickingPeopleId").attr("defaultValue") && pickingPeopleId.trim!=""){
		params +='&pickingPeopleId='+pickingPeopleId;
	}
	//配送人
	var personId=$("#personId").val();
	if(personId != $("#personId").attr("defaultValue") && personId.trim!=""){
		params +='&personId='+personId;
	}
	// 是否删除，级联搜索
	var isDelete = $('#isDelete').attr("checked");
	if (isDelete && isDelete == 'checked') {
		params +='&isDelete=1';
	}else{
		params +='&isdeleteext=y';
	}
	if($('#personIsGet:checked').attr('checked') == true || $('#personIsGet:checked').attr('checked') == 'checked'){
		params +='&isGet=1';
	}
	if($('#iserror:checked').attr('checked') == true || $('#iserror:checked').attr('checked') == 'checked'){
		params +='&iserror=1';
	}
	if($('#pickingPeopleIsNull:checked').attr('checked') == true || $('#pickingPeopleIsNull:checked').attr('checked') == 'checked'){
		params +='&pickingPeopleIsNull=1';
	}
	if($('#distributionClerkIsNull:checked').attr('checked') == true || $('#distributionClerkIsNull:checked').attr('checked') == 'checked'){
		params +='&distributionClerkIsNull=1';
	}
	$.post(base + '/ebsite/order/getCountByStatus?1=1'+params, {
		
	}, function(res) {
		//这里获取所有的数据
		$.each(res[0],function(i,n){
			$('#'+i).html('('+n+')');
		});
	}, 'json');
}

function operateRender(data, filterData) {
	var returnHtml='';
	
	//如果已经删除了订单，没有其他操作了
	if(data.isSplit == 1){//表示已经删除了或者拆分的订单
		//no something....
	}else{
		if(data.status.value == 'ALREADYPAY'){//表示已支付
			//先分配拣货人
			if(data.pickingPeople == null || data.pickingPeople.id == ''){//分配拣货人
				if(jhr == 'Y'){//有操作权限
					returnHtml +='<a href="javascript:fpjhr({id:\'' + data.id + '\'});">';

					if(data.iserror==1){
						returnHtml+='<font color=\"red\">';
					}
					returnHtml +='分配拣货人';
					if(data.iserror==1){
						returnHtml+='</font>';
					}
					returnHtml +='</a>';
				}
				//在没有分配拣货人的时候，可以做拆单处理
				/*if(cf == 'Y'){//拆分权限存在
					if(jhr == 'Y'){
						returnHtml +=' | <a href="javascript:orderSplit({id:\'' + data.id + '\'});">拆分订单</a>';
					}else{
						returnHtml +='<a href="javascript:orderSplit({id:\'' + data.id + '\'});">拆分订单</a>';
					}
				}*/
			}else{
				//分配送货人
				if(data.person == null || data.person.id == ''){
					//判断订单的物流状态,如果是没有物流状态或者合仓已经确认收货才显示分配拣货人和配送人
					if (data.logisticsStatus==null || data.logisticsStatus.value=='HC_GOT') {
						if(!data.iserror==1){
							if(againjhr == "Y"){
								returnHtml += '<a href="javascript:fpjhr({id:\'' + data.id + '\'});">';								
								returnHtml += '重新分配拣货人';
								returnHtml += '</a>';
							  }
						}else{
							if(cw_zxfpjhr == "Y"){
								returnHtml += '<a href="javascript:fpjhr({id:\'' + data.id + '\'});">';
								if(data.iserror==1){
									returnHtml+='<font color=\"red\">';
								}
								returnHtml += '重新分配拣货人';
								if(data.iserror==1){
									returnHtml+='</font>';
								}
								returnHtml += '</a>';
							  }
						}
					}
					if(psr == 'Y'){
						returnHtml += ' | <a href="javascript:distribution({id:\'' + data.id + '\'});">';
						if(data.iserror==1){
							returnHtml+='<font color=\"red\">';
						}
						returnHtml += '分配送货人';
						if(data.iserror==1){
							returnHtml+='</font>';
						}
						returnHtml += '</a>';
					}
				}else{
					//判断订单的物流状态,如果是没有物流状态或者合仓已经确认收货才显示分配拣货人和配送人
					if (data.logisticsStatus==null || data.logisticsStatus.value=='HC_GOT') {
						if(!data.iserror==1){
							if(againjhr == "Y"){
								returnHtml += '<a href="javascript:fpjhr({id:\'' + data.id + '\'});">';
								returnHtml += '重新分配拣货人';
							}
							if(agingpsr == "Y"){
								returnHtml +='</a> | <a href="javascript:distribution({id:\'' + data.id + '\'});">';								
								returnHtml +='重新分配送货人';								
								returnHtml +='</a>';
							}
						}else{
							if(cw_zxfpjhr == "Y"){
								returnHtml += '<a href="javascript:fpjhr({id:\'' + data.id + '\'});">';
								if(data.iserror==1){
									returnHtml+='<font color=\"red\">';
								}
								returnHtml += '重新分配拣货人';
								if(data.iserror==1){
									returnHtml+='</font>';
								}
							}
							if(cw_zxfppsy == "Y"){
								returnHtml +='</a> | <a href="javascript:distribution({id:\'' + data.id + '\'});">';
								if(data.iserror==1){
									returnHtml+='<font color=\"red\">';
								}
								returnHtml +='重新分配送货人';
								if(data.iserror==1){
									returnHtml+='</font>';
								}
								returnHtml +='</a>';
							}
						}
					}
				}
			  }
		}else if(data.status.value == 'ALREADDISTRIBUTION'){
			if(qr == 'Y'){
				returnHtml += ' <a href="javascript:confirmOper({id:\'' + data.id + '\'});">';
				if(data.iserror==1){
					returnHtml+='<font color=\"red\">';
				}
				returnHtml +='确认收货';
				if(data.iserror==1){
					returnHtml+='</font>';
				}
				returnHtml +='</a>';
			}
		}else if(data.status.value == 'ALREADYORDER'){//如果已经下单，提示，增加删除功能
			if(sc == 'Y'){
				returnHtml +=' <a href="javascript:deleteOrder({id:\'' + data.id + '\'});">';
				if(data.iserror==1){
					returnHtml+='<font color=\"red\">';
				}
				if(data.iserror==1){
					returnHtml+='</font>';
				}
				returnHtml +='删除';
				returnHtml +='</a>';				
			}
		}
	}
	return returnHtml;
}

//删除订单
function deleteOrder(rowData){
		art.dialog.confirm('确定删除该行数据?',function(){
			$.post(base+'/ebsite/order/deleteOrder/'+rowData.id,{},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
					}
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
}


//拆单操作
/**
 * data--->订单
 */
function orderSplit(data){
	//显示拆单页面
	var dlg = art.dialog.open(getPath() + '/ebsite/order/orderSplit/'+data.id,
		{title:'订单拆分',
		 lock:true,
		 width:'800px',
		 height:'400px',
		 id:'orderSplit',
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
			 searchData();
		 }
		});
	
}


//分配拣货人
function fpjhr(data){
	
	var dlg = art.dialog.open(getPath() + '/ebsite/order/fpjhr/'+data.id,
			{title:'分配-拣货人',
			 lock:true,
			 width:'500px',
			 height:'400px',
			 id:'fpjhr',
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
				 searchData();
			 }
			});
}

function distribution(data){
	
	var dlg = art.dialog.open(getPath() + '/ebsite/order/distribution/'+data.id,
			{title:'分配',
			 lock:true,
			 width:'500px',
			 height:'400px',
			 id:'distribution',
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
				 searchData();
			 }
			});
}


//申请退单
function applayBackBill(data){
	var dlg = art.dialog.open(getPath() + '/ebsite/order/applayBackBill/'+data.id,
			{title:'申请退单',
			 lock:true,
			 width:'320px',
			 height:'150px',
			 id:'applayBackBill',
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
				 searchData();
			 }
			});
}

function confirmOper(data){
	
	art.dialog.confirm('确认收货?', function() {
		$.post(getPath() + '/ebsite/order/confirmOper', {
			id : data.id
		}, function(res) {
			var res=res[0];
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				searchData();
			}
		}, 'json');
		return true;
	}, function() {
		return true;
	});
}

function searchData() {
	
	//创建时间
	var createTime_begin = "";
	var createTime_end = "";
	if(MenuManager.menus["createdate"]){
		createTime_begin = MenuManager.menus["createdate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["createdate"].getValue().timeEndValue;
	}
	if(createTime_begin != ""){
		$list_dataParam['createTime_begin'] = createTime_begin;
	} else {
		delete $list_dataParam['createTime_begin'];
	}
	if(createTime_end != ""){
		$list_dataParam['createTime_end'] = createTime_end;
	} else {
		delete $list_dataParam['createTime_end'];
	}
	
	// 订单状态
	if ($("#tab").find("li.hover").attr("key") != "") {
		$list_dataParam['status'] = $("#tab").find("li.hover").attr("key");
	} else {
		delete $list_dataParam['status'];
	}
	// 关键字
	var keyWord = $("#keyWord").val().trim();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	// 收货地址
	var addressInfo = $("#addressInfo").val().trim();
	if (addressInfo && ($('#addressInfo').attr("defaultValue") != addressInfo)) {
		$list_dataParam['addressInfo'] = addressInfo;
	} else {
		delete $list_dataParam['addressInfo'];
	}
	var pickupWay = $("#pickupWay").val();
	if (pickupWay) {
		$list_dataParam['pickupWay'] = pickupWay;
	} else {
		delete $list_dataParam['pickupWay'];
	}
	var buyTypeEnum = $("#buyTypeEnum").val();
	if (buyTypeEnum) {
		$list_dataParam['buyTypeEnum'] = buyTypeEnum;
	} else {
		delete $list_dataParam['buyTypeEnum'];
	}
	//物流状态
	var logisticsStatus=$("#logisticsStatus").val();
	if (logisticsStatus) {
		$list_dataParam['logisticsStatus'] = logisticsStatus;
	} else {
		delete $list_dataParam['logisticsStatus'];
	}
	var dateStage = $("#dateStage").val();
	if (dateStage) {
		$list_dataParam['dateStage'] = dateStage;
	} else {
		delete $list_dataParam['dateStage'];
	}
	
	//退单时间
	var outOrderTime_begin = "";
	var outOrderTime_end = "";
	if(MenuManager.menus["outOrderDate"]){
		outOrderTime_begin = MenuManager.menus["outOrderDate"].getValue().timeStartValue;
		outOrderTime_end = MenuManager.menus["outOrderDate"].getValue().timeEndValue;
	}
	if(outOrderTime_begin != ""){
		$list_dataParam['outOrderTime_begin'] = outOrderTime_begin;
	} else {
		delete $list_dataParam['outOrderTime_begin'];
	}
	if(outOrderTime_end != ""){
		$list_dataParam['outOrderTime_end'] = outOrderTime_end;
	} else {
		delete $list_dataParam['outOrderTime_end'];
	}
	
	//确认收货时间
	var finishTime_begin = "";
	var finishTime_end = "";
	if(MenuManager.menus["finishTime"]){
		finishTime_begin = MenuManager.menus["finishTime"].getValue().timeStartValue;
		finishTime_end = MenuManager.menus["finishTime"].getValue().timeEndValue;
	}
	if(finishTime_begin != ""){
		$list_dataParam['finishTime_begin'] = finishTime_begin;
	} else {
		delete $list_dataParam['finishTime_begin'];
	}
	if(finishTime_end != ""){
		$list_dataParam['finishTime_end'] = finishTime_end;
	} else {
		delete $list_dataParam['finishTime_end'];
	}
	
	//支付时间
	var payDate_begin = "";
	var payDate_end = "";
	if(MenuManager.menus["payDate"]){
		payDate_begin = MenuManager.menus["payDate"].getValue().timeStartValue;
		payDate_end = MenuManager.menus["payDate"].getValue().timeEndValue;
	}
	if(payDate_begin != ""){
		$list_dataParam['payDate_begin'] = payDate_begin;
	} else {
		delete $list_dataParam['payDate_begin'];
	}
	if(payDate_end != ""){
		$list_dataParam['payDate_end'] = payDate_end;
	} else {
		delete $list_dataParam['payDate_end'];
	}
	
	
	//配送仓库
	var storageId = $('#sendStorageId').val();
	if (storageId) {
		$list_dataParam['storageId'] = storageId;
	} else {
		delete $list_dataParam['storageId'];
	}
	//订单总价最低值
	var totalMin = $('#totalMin').val();
	//订单总价最高值
	var totalMax = $('#totalMax').val();
	if (totalMin) {
		$list_dataParam['totalMin'] = totalMin;
	} else {
		delete $list_dataParam['totalMin'];
	}
	if (totalMax) {
		$list_dataParam['totalMax'] = totalMax;
	} else {
		delete $list_dataParam['totalMax'];
	}
	var storageKey=$("#storageKey").val();
	if(storageKey != $("#storageKey").attr("defaultValue") && storageKey.trim!=""){
		$list_dataParam['storageKey'] = storageKey;
	}else{
		delete $list_dataParam['storageKey'];
	}
	
	//捡货人
	var pickingPeopleId=$("#pickingPeopleId").val();
	if(pickingPeopleId != $("#pickingPeopleId").attr("defaultValue") && pickingPeopleId.trim!=""){
		$list_dataParam['pickingPeopleId'] = pickingPeopleId;
	}else{
		delete $list_dataParam['pickingPeopleId'];
	}
	//配送人
	var personId=$("#personId").val();
	if(personId != $("#personId").attr("defaultValue") && personId.trim!=""){
		$list_dataParam['personId'] = personId;
	}else{
		delete $list_dataParam['personId'];
	}
	// 是否删除，级联搜索------查询所有
	var isDelete = $('#isDelete').attr("checked");
	if (isDelete && isDelete == 'checked') {
		$list_dataParam['isDelete'] = 1;
		delete $list_dataParam['isdeleteext'];
	} else {
		$list_dataParam['isdeleteext'] = 'y';
		delete $list_dataParam['isDelete'];
	}
	if($('#personIsGet:checked').attr('checked') == true || $('#personIsGet:checked').attr('checked') == 'checked'){
		$list_dataParam['isGet'] = 1;
	}else{
		delete $list_dataParam['isGet'];
	}
	
	if($('#iserror:checked').attr('checked') == true || $('#iserror:checked').attr('checked') == 'checked'){
		$list_dataParam['iserror'] = 1;
	}else{
		delete $list_dataParam['iserror'];
	}

	
	//配送员是否为空
	if($('#pickingPeopleIsNull:checked').attr('checked') == true || $('#pickingPeopleIsNull:checked').attr('checked') == 'checked'){
		$list_dataParam['pickingPeopleIsNull'] = 1;
	}else{
		delete $list_dataParam['pickingPeopleIsNull'];
	}
	
	//拣货员是否为空
	if($('#distributionClerkIsNull:checked').attr('checked') == true || $('#distributionClerkIsNull:checked').attr('checked') == 'checked'){
		$list_dataParam['distributionClerkIsNull'] = 1;
	}else{
		delete $list_dataParam['distributionClerkIsNull'];
	}
	
	$list_dataParam['exceptionOrder'] = $("#exceptionOrder").val();
	
	resetList();
	initCount();
}

function enterSearch(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}
/**批量打印订单
 *  add by lhh
 */
function printOrderBatch(){
	/**
	 * 拼接选中订单数据ID
	 */
	var orderIds='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			orderIds+=obj.id+',';
		}
	}
	if (orderIds=='') {
		art.dialog.tips("请选择订单!");
		 return false;
	}
	var url = base + "/ebsite/order/printOrderBatch?orderIds="+orderIds;
	var flag = true;
	
	var dlg = art.dialog.open(url,{
		 title:'打印订单',
		 lock:true,
		 width:'760px',
		 height:'340px',
		 id:"printOrderBatch",
		 button:[{name:'打印',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
					dlg.iframe.contentWindow.printer(dlg);
				}
				return false;
			}},{name:'关闭'}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
	/*在后台批量订单打印
	 $.post(url,function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG,2);
			}
	    },'json'); */
}
