$list_editUrl = getPath() + "/lunch/order/edit";// 编辑及查看url
$list_addUrl = getPath() + "/lunch/order/add";// 新增url
$list_deleteUrl = getPath() + "/lunch/order/delete";// 删除url
$list_editWidth = "730px";
$list_editHeight = "330px";
$list_dataType = "订单列表";// 数据名称
var statusComboBox = null;

$(document).ready(
		function() {
			params={};
			params.width = 260;
			params.inputTitle = "日期";	
			MenuManager.common.create("DateRangeMenu","createTime",params);
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						checkbox:true,
						columns : [
                        {
	                     display: '操作', 
	                     name: 'operate', 
	                     align: 'center',
	                     width: 120,
	                     render:operateRender},           
						{
							display : '订单编号',
							name : 'orderNmber',
							align : 'center',
							width : 120,
							render:function(data){
								return '<a href="javascript:detailView(\''+ data.id + '\');">'+data.orderNmber+'</a>';
							}
						},{         
							display : '状态',
							name : 'orderStatusEnum.name',
							align : 'center',
							width : 60
						},{
							display : '售点',
							name : 'counterpoint.name',
							align : 'center',
							width : 150
						}, {
							display : '菜品份数',
							name : 'dishesCount',
							align : 'center',
							width : 100
						}, {
							display : '下单人',
							name : 'subscriber.name',
							align : 'center',
							width : 100,
							render:function(data){
								if(data.subscriber == null){
									return '' ;
								}
								if(data.subscriber.name == null || data.subscriber.name == ''){
									return data.subscriber.nickName ;
								}else{
									return data.subscriber.name ;
								}
								return '' ;
							}
						},{
							display : '下单人电话',
							name : 'subscriber.phoneNumber',
							align : 'center',
							width : 100
						},{
							display : '下单时间',
							name : 'createTime',
							align : 'center',
							width : 150
						},{
							display : '是否配送',
							name : 'isDispatch',
							align : 'center',
							width : 100,
							render:function(data){
								return (data.isDispatch==1?"配送上门":"站点自取");
							}
						},{
							display : '配送时间',
							name : 'sendTime',
							align : 'center',
							width : 100
						},{
							display : '配送地址',
							name : 'disAddress',
							align : 'center',
							width : 250
						},{
							display : '优惠券',
							name : 'disAddress',
							align : 'center',
							width : 100,
							render:function(data){
								if(data.hasUseCoupons==1){//使用优惠券
								return "【"+data.coupons.par+"元】"+data.coupons.name;
								}else{
									return "无";	
								}
							}
						},{
							display : '订单价格',
							name : 'totalPrice',
							align : 'center',
							width : 100
						},{
							display : '优惠价格',
							name : 'preferentialPrice',
							align : 'center',
							width : 100
						},{
							display : '支付价格',
							name : 'paymentPrice',
							align : 'center',
							width : 100
						},{
							display : '支付时间',
							name : 'paymentTime',
							align : 'center',
							width : 120
						},{
							display : '完成时间',
							name : 'finishTime',
							align : 'center',
							width : 120
						},{
							display : '退单时间',
							name : 'chargeBackTime',
							align : 'center',
							width : 120
						},{
							display : '退单操作人',
							name : 'chargeBackPerson.name',
							align : 'center',
							width : 100
						}
						/*,{
							display : '评价指数',
							name : 'evaluationNumber',
							align : 'center',
							width : 100
						},{
							display : '评价描述',
							name : 'evaluationDesc',
							align : 'center',
							width : 100
						}*/
						],
						delayLoad : true,
						url : getPath() + '/lunch/order/listData'
					}));
			initDate();
			searchData();
			//params = {};
			//params.inputTitle = "下单时间";
			//MenuManager.common.create("DateRangeMenu", "finishTime", params);			

			$("#searchBtn").click(function() {
				searchData();
			});
			
			$("#tab").find("li").click(function(){
				$(this).addClass("hover");
				$(this).siblings("li").removeClass("hover");
				searchData();
			});
			
			
			initClearBtn();

		});
function detailView(id){
	var flag = false;
	var url= base+"/lunch/order/detailView"
	var param= "?dataId="+id;
	var dlg = art.dialog.open(url+param,
			{title:"订单详情",
			 lock:true,
			 width:'680px',
			 height:'580px',
			 id:"DEAL",
			 button:[{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}

function batchPrint(){
	var flag = false;
	var url= base+"/lunch/order/getAllOrderByDate"
	
	var dlg = art.dialog.open(url,
		{title:"打印订单",
			 lock:true,
			 width:'825px',
			 height:'350px',
			 id:"DEAL",
			 button:[{name:"打印",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printme){
						dlg.iframe.contentWindow.printme();
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
		});
}
//批量完成
function batchFinish(){
	var ids = '';
	var recordes = $list_dataGrid.getSelectedRows();	
	for(var i in recordes){
		if(recordes[i].orderStatusEnum){
			if(recordes[i].orderStatusEnum.value == "ALREADYPAYMENT"){
				if(!ids){
					ids = "'"+recordes[i].id+"'";
				}else{
					ids += ",'"+ recordes[i].id +"'";
				}
			}
		}
		
	};

	if(!ids){
		art.dialog.tips("请勾选已经支付的订单！",2);
		return ;
	}
	$.post(getPath()+'/lunch/order/batchUpdateStatus',{ids:ids},function(res){
		if(res[0].STATE == 'SUCCESS'){
			art.dialog.tips('操作成功！');
		}else{
			art.dialog.tips('操作失败！');
		}
		searchData();
	},'json');
}
function batchrefundApply(ids){
	art.dialog.confirm('确定退单并将退款?',function(){
			$.post(getPath()+'/lunch/order/batchrefundApply',{ids:ids},function(res){
				if(res[0].STATE == 'SUCCESS'){
					art.dialog.tips('退款申请已经提交,请稍后刷新该页面……',2.5);
					setTimeout(function(){
						searchData();
					}, 2500 );
				}else{
					art.dialog.tips(res[0].MSG);
					searchData();
				}
		},'json');
		return true;
	},function(){
		return true;
	});
	
}
function updateStatus(id,status){
	var flag = false;
	var url= base+"/lunch/order/dealView"
	var param= "?dataId="+id+"&status="+status;
	var dlg = art.dialog.open(url+param,
			{title:status=="ALREADYPAYMENT"?"完成":"退单",
			 lock:true,
			 width:'430px',
			 height:'100px',
			 id:"DEAL",
			 button:[{name:status=="ALREADYPAYMENT"?"完成":"退单",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit();
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}
/**
 * 清空按钮
 */
function initClearBtn(){
	$("#resetBtn").bind("click",function(){
		//MenuManager.common.resetAll();
		$("#qcDateStage").val("");
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#arkName").val($("#arkName").attr("defaultValue"));
		$("#arkId").val("");
		$("#floorName").val($("#floorName").attr("defaultValue"));
		$("#floorId").val("");
		
		
	});
}


function innitCount(){
	$("#tab em").html('(0)');
	$.post(base+'/lunch/order/getCountByStatus',$list_dataParam,function(res){
	var obj =  res[0];
	var total = 0;
	for(var i in obj){
		$("#"+i).html("("+obj[i]+")");
		total+=parseInt(obj[i]);
	}
	$("#ALL").html("("+total+")");
	},'json');
}

function operateRender(data, filterData) {
		var str ="";
		if(data.orderStatusEnum.value=='ALREADYPAYMENT'){//已付款
			str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'ALREADYFINISH\');">完成</a>';
			str +='|<a href="javascript:singelrefundApply(\''+ data.id +'\');">退款</a>';;
		}else if(data.orderStatusEnum.value=='APPLYCHARGEBACK'){//申请退单
			//str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'ALREADYCHARGEBACK\');">退单</a>';
			str +='<a href="javascript:singelrefundApply(\''+ data.id +'\');">退款</a>';;
		}else if(data.orderStatusEnum.value=='PRESENTATION'){//赠送状态
			str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
		}
		
    return str;
}

// 查看
function viewRow(rowData) {
	
}
function singelrefundApply(id){
	batchrefundApply("'"+id +"'");
}

function searchData() {
	//订单状态
	if($("#tab").find("li.hover").attr("key") !=""){
		$list_dataParam['orderStatusEnum']= $("#tab").find("li.hover").attr("key");
	}else{
		delete $list_dataParam['orderStatusEnum'];
	}	
	// 下单日期
	var queryStartDate = "";
	var queryEndDate = "";
	if (MenuManager.menus["createTime"]) {
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	delete $list_dataParam['createTime_begin'];
	delete $list_dataParam['createTime_end'];
	
	
	delete $list_dataParam['sendTime_begin'];
	delete $list_dataParam['sendTime_end'];
	
	
    var queryTimeType = $("#queryTimeType").val();
   
    if(queryTimeType=="createTime"){
    	//如果是下单时间
    	if (queryStartDate) {
    		$list_dataParam[queryTimeType+'_begin'] = queryStartDate;
    	} 
    	if (queryEndDate) {
    		$list_dataParam[queryTimeType+'_end'] = queryEndDate;
    	} 
    }else{
    //如果是配送时间
	if (queryStartDate) {
		$list_dataParam[queryTimeType+'_begin'] = queryStartDate.replace(/\//g,"-");
	} 
	if (queryEndDate) {
		$list_dataParam[queryTimeType+'_end'] = queryEndDate.replace(/\//g,"-");
	}
    }
	
	// 售点
	var arkId = $("#arkId").val();
	if (arkId != "") {
		$list_dataParam['arkId'] = arkId;
	} else {
		delete $list_dataParam['arkId'];
	}
	
	// 楼栋
	var floorId = $("#floorId").val();
	if (floorId != "") {
		$list_dataParam['floorId'] = floorId;
	} else {
		delete $list_dataParam['floorId'];
	}
	
	
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
	$list_dataParam['keyWord'] = keyWord;
	} else {
	delete $list_dataParam['keyWord'];
	}
	resetList();
	innitCount();
}

function enterSearch(e) {

	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}

function endOrder(){
	
}

function sendOrderMsg(){
	var ids = '';
	var recordes = $list_dataGrid.getSelectedRows();	
	for(var i in recordes){
		if(recordes[i].orderStatusEnum){
			if(1==1){
			//if(recordes[i].orderStatusEnum.value == "ALREADYPAYMENT"){
				if(!ids){
					ids = "'"+recordes[i].id+"'";
				}else{
					ids += ",'"+ recordes[i].id +"'";
				}
			}
		}
		
	};
	if(!ids){
		art.dialog.tips("请勾选已经支付的订单！",2);
		return ;
	}
	
	var dialog = art.dialog({
	    content: '<p style="margin-bottom:10px;">取餐通知发送内容:</p>'
	    	+ '<textarea rows="5" id="sms_msg" style="width:15em; padding:6px"  cols="20">您好，您的外卖到了，请到您下单时所选择的配送站点取餐（如果您已取餐请忽略此条短信）</textarea>',
	    fixed: true,
	    id: 'Fm7',
	    icon: 'question',
	    okVal: '发送通知',
	    width:'230px',
		height:'150px',
	    ok: function () {
	    	var msg = document.getElementById('sms_msg').value;
	    	if(!msg||msg==""){art.dialog.tips("请填写发送内容"); return false;}
	    	$.post(getPath()+'/lunch/order/sendOrderMsg',{ids:ids,msg:msg},function(res){
			if(res[0].STATE == 'SUCCESS'){
				art.dialog.tips('短信发送成功！');
			}else{
				art.dialog.tips('短信发送失败！');
			}
		},'json');
	    },
	    cancel: true
	});
	
}

function initDate(){
	var curdate = new Date();
	$("#createTime").html("日期:"+formatDate(curdate,"yyyy/MM/dd")+"-"+formatDate(curdate,"yyyy/MM/dd"));
	 MenuManager.menus["createTime"].setValue(formatDate(curdate,"yyyy/MM/dd"),formatDate(curdate,"yyyy/MM/dd"));
}

/**
 * 打印小票
 */
function printBill(){
	/**
	 * 拼接选中商品数据ID
	 */
	var orderIds='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			orderIds+=obj.id+',';
		}
	}
	if (orderIds=='') {
		art.dialog.tips("请选择要打印的订单!");
		 return false;
	}
	var url = base + "/lunch/order/printBill?orderIds="+orderIds;
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:"打印订单",
				  lock:true,
				  width:'825px',
				  height:'350px',
				  id:"DEAL",
				  button:[{name:"打印",callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printme){
							dlg.iframe.contentWindow.printme();
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				  close:function(){
					 if(flag){
						 if(typeof(afterEditRow)=='function'){
							 afterEditRow();
					  }
					  refresh();
				  }
			 }
	 });

}