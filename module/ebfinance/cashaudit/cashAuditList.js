//$list_addUrl = getPath()+"/lunch/qcdatestage/add";//新增url
$list_editUrl = getPath()+"/ebfinance/cashaudit/getView";//编辑及查看url
//$list_deleteUrl = getPath()+"/lunch/qcdatestage/delete";//删除url
$list_approvalUrl = getPath()+"/ebfinance/cashaudit/approval";//审批
$list_agreePayUrl = getPath()+"/ebfinance/cashaudit/agreePay";//确认收付款

$list_editWidth = "730px";
$list_editHeight = "370px";
$list_dataType = "数据";//数据名称
var title = "";//收付款标题
$(document).ready(function() {
		//这个基本固定；
		$("#main").ligerLayout({});
		$(".system_tab li").click(function(){
			$(this).parent().find("li").removeClass("hover");
			$(this).addClass("hover");
		});
		//这里表示表格；
		$list_dataGrid = $("#tableContainer").ligerGrid(
				$.extend($list_defaultGridParam, {
					columns : [ {
						display : '业务操作',
						name : 'operate',
						align : 'center',
						width : 100,
						render : operateRender
					}, {
						display : '单据编码',
						name : 'billNumber',
						align : 'center',
						width : 140
					}, {
						display : '单据类型',
						name : 'billTypeEnum.name',
						align : 'center',
						width : 80
					}, {
						display : '收付类型',
						name : 'cashAuditTypeEnum.name',
						align : 'center',
						width : 80
					}, {
						display : '制单人',
						name : 'createName',
						align : 'center',
						align : 'center',
						width : 80
					}, {
						display : '创建时间',
						name : 'createTime',
						align : 'center',
						width : 180
					}, {
						display : '款项',
						name : 'money',
						align : 'center',
						width : 150
					},{
						display : '交易金额',
						name : 'tradeMoney',
						align : 'center',
						width : 100
					},{
						display : '结算信息',
						name : 'settleInfo',
						align : 'center',
						width : 280
					},{
						display : '审核状态',
						name : 'cashAuditStatusEnum.name',
						align : 'center',
						width : 100
					},{
						display : '审核描述',
						name : 'approvalRemark',
						align : 'center',
						width : 100
					},{
						display: '付款状态', 
						name: 'paymentStatusEnum.name', 
						align: 'center', 
						width:130
					}],
					url : getPath() + "/ebfinance/cashaudit/listData"
				}));

		var params ={};
		params.width = 260;
		params.inputTitle = "创建时间";	
		MenuManager.common.create("DateRangeMenu","effectdate",params);
		// 回车事件
		$('#keyword').on('keyup', function(event) {
			if (event.keyCode == "13") {
				searchlist();
			}
		});
});


//操作
function operateRender(data) {
	// return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a
	// href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	//审批状态
	var approvalStatus = data.cashAuditStatusEnum.value;
	//单据类型
	var cashAuditType = data.cashAuditTypeEnum.value;
	//付款状态
	var paymentStatus = data.paymentStatusEnum.value;
	var lianjie='';
	//付款单需要审核,收款单无需任何操作，退货收款要确认收款
	//采购付款单
	if(cashAuditType=="PAYMENT" ){
		if(approvalStatus == "APPROVED"){
			if(paymentStatus == "HASPAID"){
				lianjie = '已付款';
			}else{
				if(sfshqrfk_permission == 'Y'){
					lianjie = '<a href="javascript:agreePay({id:\''+data.id+'\',cashType:\''+data.cashAuditTypeEnum.value+'\'});">确认付款</a>';
				}
			}
		}
		else if(approvalStatus == "REJECTED"){
			lianjie="已驳回";
		}
		else{
			if(sfshsp_permission == 'Y'){
				lianjie = '<a href="javascript:approval({id:\''+data.id+'\'});">审批</a>';
			}
			
		}
	}
	//购物退款付款单
	if(cashAuditType=="REFUNDPAYMENT"){
		if(approvalStatus == "APPROVED"){
			if(paymentStatus == "REFUNDED"){
				lianjie = '已付款';
			}else{
				if(sfshqrfk_permission == 'Y'){
					lianjie = '<a href="javascript:agreePay({id:\''+data.id+'\',cashType:\''+data.cashAuditTypeEnum.value+'\'});">确认付款</a>';
				}
			}
			
		}
		else if(approvalStatus == "REJECTED"){
			lianjie = '已驳回';
		}else{
			if(sfshsp_permission == 'Y'){
				lianjie = '<a href="javascript:approval({id:\''+data.id+'\'});">审批</a>';
			}
		}
	}
	
	//如果是采购退货的收款单不需要审核
	if(cashAuditType=="RETURNRECEIPT"){
		if(paymentStatus == "REFUNDING"){//退款单 状态为 退款中
			if(sfshqrfk_permission == 'Y'){
				lianjie = '<a href="javascript:agreePay({id:\''+data.id+'\',cashType:\''+data.cashAuditTypeEnum.value+'\'});">确认收款</a>';
			}
		}
	}
	
	//如果是收款单无需任何操作
	if(cashAuditType=="RECEIVABLES"){
		
	}
	return lianjie;
}

//删除节点
function delnode(){
//	$(node).closest("span").remove();
	var msg=document.getElementById("nodetr");  
	msg.removeChild(msg.lastChild);
}

//审批
function approval(data){
	paramStr = '?id='+data.id;
	var flag = false;
	var dlg = art.dialog.open($list_approvalUrl+paramStr,
			{
				id : "approval",
				title : '审批',
				background : '#333',
				width : 730,
				height : 400,
				lock : true,
				button:[{name:'同意',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.agree){
							dlg.iframe.contentWindow.agree(dlg);
						}
						flag = true;
						return false;
					}},{name:'不同意',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.disagree){
							dlg.iframe.contentWindow.disagree(dlg);
						}
						flag = true;
						return false;
					}}],
				close:function(){
					if(flag){
						resetList();
					}
				}
			});	
}

//确认收付款
function agreePay(data){
	paramStr = '?id='+data.id;
	var flag = false;
	var dlg = art.dialog.open($list_agreePayUrl+paramStr,
	{
		id : "agreePay",
		title : title,
		background : '#333',
		width : 780,
		height : 450,
		lock : true,
		button:[{name:'确定',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
				dlg.iframe.contentWindow.saveEdit(dlg);
			}
			flag = true;
			return false;
		}},{name:'取消',callback:function(){
			flag = false;
			return true;
		}}],
		close:function(){
			if(flag){
				resetList();
			}
		}
	});	
}

//模糊查询
function searchlist(){	
	//按关键字查询
	var keyword = $("#keyword").val().trim();
	if (keyword && ($('#keyword').attr("defaultValue") != keyword)) {
		$list_dataParam['keyword'] = keyword;
	} else {
		delete $list_dataParam['keyword'];
	}
	
	//按开始时间和结束时间查询
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["effectdate"]){
		startDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	//查询开始时间
	if(startDate != ""){
		$list_dataParam['startTime'] = startDate;
	} else {
		delete $list_dataParam['startTime'];
	}
	//查询结束时间
	if(endDate != ""){
		$list_dataParam['endTime'] = endDate;
	} else {
		delete $list_dataParam['endTime'];
	}
	
	//根据审批状态查询
	var cashAuditStatusEnum = $("#cashAuditStatusEnum").val();
	if(cashAuditStatusEnum != ""){
		$list_dataParam['cashAuditStatusEnum'] = cashAuditStatusEnum;
	} else {
		delete $list_dataParam['cashAuditStatusEnum'];
	}
	
	//根据单据类型查询
	var billTypeEnum = $("#billTypeEnum").val();
	if(billTypeEnum != ""){
		$list_dataParam['billTypeEnum'] = billTypeEnum;
	} else {
		delete $list_dataParam['billTypeEnum'];
	}
	
	//根据支付状态查询
	var paymentStatusEnum = $("#paymentStatusEnum").val();
	if(paymentStatusEnum != ""){
		$list_dataParam['paymentStatusEnum'] = paymentStatusEnum;
	} else {
		delete $list_dataParam['paymentStatusEnum'];
	}
	resetList();
}

//查询全部，付款单，收款单
function searchCashAuditType(id){
	if(id == 1){
		delete $list_dataParam['cashAuditTypeEnum'];
	}
	if(id == 2){
		$list_dataParam['cashAuditTypeEnum'] = "RECEIVABLES";
	}
	if(id == 3){
		$list_dataParam['cashAuditTypeEnum'] = "PAYMENT";
	}
	resetList();
}

//清空
function onEmpty(){
	delete $list_dataParam['keyword'];
	
	delete $list_dataParam['startTime'];
	delete $list_dataParam['endTime'];
	
	delete $list_dataParam['cashAuditStatusEnum'];
	delete $list_dataParam['paymentStatusEnum'];
	delete $list_dataParam['cashAuditTypeEnums'];
	delete $list_dataParam['billTypeEnum'];
	resetList();
	
	MenuManager.menus["effectdate"].resetAll();
	
	$("#cashAuditStatusEnum").val("");
	$("#paymentStatusEnum").val("");
	$("#cashAuditTypeEnum").val("");
	$("#billTypeEnum").val("");
	$("#keyword").attr("value", $("#keyword").attr("defaultValue"));	
}

