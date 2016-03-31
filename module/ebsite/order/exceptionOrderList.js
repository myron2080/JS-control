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
			
			
			searchData();
			//批量打印订单
			$("#printOrderBatch").bind("click",function(){
				printOrderBatch();
			});
		});

/**
 * 打印数据
 *  add by lhh
 */
function printOrder(data){
	var returnHtml="";
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

//显示订单详情
function orderNoRender(data){
	var returnHtml='';
	returnHtml+='<a href="javascript:showDetail({id:\'' + data.id + '\',orderNo:\''+data.orderNo+'\'});">'+data.orderNo+'</a>';
	if(data.isDelete == 1){//表示已删除
		returnHtml += ' <span style="font-size:10px;color:red;">已删</span>';
	}
	return returnHtml;
}

function showDetail(obj){
	var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+obj.id,
			{title:'订单细节',
			 lock:true,
			 width:(window.screen.width  * 53 /100)+"px",
			 height:(window.screen.height  * 41 /100)+"px",
			 id:'showDetail',
			 button:[{name:'关闭'}]
			});
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
//							if(cw_zxfpjhr == "Y"){
								returnHtml += '<a href="javascript:fpjhr({id:\'' + data.id + '\'});">';
								if(data.iserror==1){
									returnHtml+='<font color=\"red\">';
								}
								returnHtml += '重新分配拣货人';
								if(data.iserror==1){
									returnHtml+='</font>';
								}
								returnHtml += '</a>';
//							  }
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
//							if(cw_zxfpjhr == "Y"){
								returnHtml += '<a href="javascript:fpjhr({id:\'' + data.id + '\'});">';
								if(data.iserror==1){
									returnHtml+='<font color=\"red\">';
								}
								returnHtml += '重新分配拣货人';
								if(data.iserror==1){
									returnHtml+='</font>';
								}
//							}
//							if(cw_zxfppsy == "Y"){
								returnHtml +='</a> | <a href="javascript:distribution({id:\'' + data.id + '\'});">';
								if(data.iserror==1){
									returnHtml+='<font color=\"red\">';
								}
								returnHtml +='重新分配送货人';
								if(data.iserror==1){
									returnHtml+='</font>';
								}
								returnHtml +='</a>';
//							}
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
	$list_dataParam['exceptionOrder'] = $("#exceptionOrder").val();
	resetList();
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
