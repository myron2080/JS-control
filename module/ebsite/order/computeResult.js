$list_editWidth = "1010px";
$list_editHeight = "500px";
$list_dataType = "订单列表";// 数据名称
var approveEnum={ALREADYORDER:'已下单',ALREADYPAY:'已付款',ALREADDISTRIBUTION:'已配送',ALREADRECEIPT:'已收货',CHARGEBACKAPPLY:'退单申请',
		ALREADCHARGEBACK:"已退单",ALREADCANCEL:"已取消",ZC_READY_PICK:'总仓待拣货',ZC_PICKING:'总仓拣货中',ZC_PICKED:'总仓已拣货',ZC_SENDING:'总仓配送中',ZC_CLOSE:'总仓关闭',FC_GOT:'分仓已收货',
		FC_READY_PICK:'分仓待拣货',FC_PICKING:'分仓拣货中',FC_HANG_UP:'分仓已挂起',FC_PICKED:'分仓已拣货',FC_SENDING:'分仓配送中',
		HC_GOT:'合仓已收货',HAND_CANCEL:'手工取消',GT_CANCEL:'未运算订单取消'};
$(document).ready(
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [{
							display : '操作',
							name : 'operate',
							align : 'center',
							width : 65,
							render:changeButton
						}, {
							display : '订单编号',
							name : 'orderNo',
							align : 'center',
							width : 180
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
						},{
							display : '收货地址',
							name : 'addressInfo',
							align : 'center',
							width : 130
						}, {
							display : '支付时间',
							name : 'payTimeStr',
							align : 'center',
							width : 130
						},{
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
						},{
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
						}],
						delayLoad : true,
						onDblClickRow:function(rowData,rowIndex,rowDomElement){
							showDetail(rowData);
					    },
					    checkbox:true,
						url : getPath() + '/ebsite/specialOperateOrder/computeResult'
					}));
			
			var params ={};
			params.width = 310;
			params.dateFmt = 'yyyy/MM/dd HH:mm:ss';
			params.fmtEndDate = true;		
			params.inputTitle = "创建时间";
			MenuManager.common.create("DateRangeMenu","payDate",params);
			//初始化时间
			var curentDate=new Date();
			MenuManager.menus["payDate"].setValue(curentDate.toLocaleDateString()+" 00:00:00",curentDate.toLocaleDateString()+" 23:59:59");
			MenuManager.menus["payDate"].confirm();
			searchData();
			//批量打印订单
			$("#printOrderBatch").bind("click",function(){
				printOrderBatch();
			});
			$("#tab li").click(function(){
				changeTab(this);
			});
		});

function changeButton(data)
{
	var returnHtml="";
		if(data.logisticsStatus!=null){
			if(zfyshdd=="Y"&&data.logisticsStatus.value=="HC_GOT")
				returnHtml+='<a href="javascript:cancelOrder({id:\'' + data.id+ '\',type:\''+0+'\'});">重发</a>';
		}else if(data.logisticsStatus==null || data.logisticsStatus==""){
			if(qxwysdd=="Y"){
				returnHtml+='<a href="javascript:cancelOrder({id:\'' + data.id+ '\',type:\''+1+'\'});">取消</a>';
			}			
		}
	return returnHtml;
	
}



function cancelOrder(rowData){
		art.dialog.confirm('确定操作该行数据?',function(){
			$.post(base+'/ebsite/specialOperateOrder/cancelAndAgainOrder',{orderId:rowData.id,type:rowData.type},function(res){
				art.dialog.tips(res.MSG);
				refresh();
			},'json');
			return true;
		},function(){
			return true;
		});
}




function searchData() {
	//创建时间
	var createTime_begin = "";
	var createTime_end = "";
	if(MenuManager.menus["payDate"]){
		createTime_begin = MenuManager.menus["payDate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["payDate"].getValue().timeEndValue;
	}
	if(createTime_begin != ""){
		$list_dataParam['createTime_follow_begin'] = createTime_begin;
	} else {
		delete $list_dataParam['createTime_follow_begin'];
	}
	if(createTime_end != ""){
		$list_dataParam['createTime_follow_end'] = createTime_end;
	} else {
		delete $list_dataParam['createTime_follow_end'];
	}
	// 调拨单状态
	var logisticsStatus=$("#logisticsStatus").val();	
//	if(logisticsStatus=="HC_GOT"){
//		$("#resend").show();
//		$("#cancel").hide();
//	}else if(logisticsStatus!="" &&logisticsStatus!="HC_GOT" ){
//		$("#resend").hide();
//		$("#cancel").hide();
//	}
	if (logisticsStatus) {
		$list_dataParam['logisticsStatus'] = logisticsStatus;
	}else {
		delete $list_dataParam['logisticsStatus'];
	}
	//键字
	var keyWord = $("#storageKey").val().trim();
	if (keyWord && ($('#storageKey').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}

	resetList();
}

function enterSearch(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}
////批量重发和取消
//function cancelOrders(flag){
//	var mesg;
//	var rows = $list_dataGrid.getSelectedRows();
//	if(rows.length>0){
//		if(flag=="1"){
//			mesg="确定取消这些订单吗?";
//		}else if(flag=="0"){
//			mesg="确定重发这些订单吗?";
//		}
//		art.dialog.confirm(mesg,function(){
//			var ids = '';
//			var orderNo='';
//			for(var i = 0; i < rows.length; i++){
//				ids += rows[i].id;
//				if(i < rows.length - 1){
//					ids += ';';
//				}
//			}
//			$.post(getPath()+'/ebsite/order/cancelAndAgainOrder',{orderId:ids,type:flag},function(res){
//				art.dialog.tips(res.MSG);
//				refresh();
//			},'json');
//		});
//	}else{
//		art.dialog.tips('请先选择需要操作的内容');
//	}
//}


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
	$list_dataParam['logStatus']=$("#type").val();	
	searchData();
}

