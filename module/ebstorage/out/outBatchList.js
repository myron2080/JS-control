$list_editWidth="1050px";
$list_editHeight="550px";
$list_dataType = "自动调拨批次" ;
var enumObj={NEWADD:'新生成',COVERED:'已被覆盖',CONFIRMED:'已确认调拨',CONFIRMED_GOT:'已确认收货',FINISHED:'已完成',
		OUT_STORAGE:'调拨批次',IN_STORAGE:'采购批次',CONFIRMED_INSTORAGE:'已确认入库',ZC_CONFIRMED_SEND:'已结束'};
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$(".graybtn").on("click",function(){//清空按钮
		searchData();
	});
	//初始化 调拨批次
	$(".initOutbatch").on("click",function(){
		judgeInit();
	});
	$("#searchBtn").click(function() {
		searchData();
	});
	//自动生成 入库单
	$(".autoInstorage").on("click",function(){
		autoInstorage();
	});
	//异常订单
	$(".exceptionOrder").on("click",function(){
		showExceptOrder();
	});
	//运算结果管理
	$(".computeResult").on("click",function(){
		showComputeResult();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '操作', name: '', align: 'center', width: 120, isSort:false},
         {display: '订单跟踪', name: '', align: 'center', width: 120, isSort:false, render:orderFollow},
         {display: '批次号', name: 'number', align: 'center', width: 120, isSort:false, render:numberRender},
         {display: '批次类型', name: 'type', align: 'center', width: 120, isSort:false, render:renderType},
         {display: '批次状态', name: 'status', align: 'center',  width: 120, isSort:false, render:renderStatus},
         {display: '当天第几次调拨', name: 'index', align: 'center',  width: 120, isSort:false},
         {display: '创建时间', name: 'createDateStr', align: 'center',  width: 180, isSort:false},
         {display: '创建人', name: 'operator.name', align: 'center', width: 120, isSort:false}
		],
        width:"99%",
        url:getPath() + '/ebstorage/outBatch/listData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showDetail(rowData.id, rowData.type, rowData.status);
        }
    }));
});

//订单跟踪
function orderFollow(data){
	return '<a href="javascript:void(0);" onclick="showOrderFollow(\''+data.id+'\')">订单跟踪</a>';
}

//打开订单 跟踪页面
function showOrderFollow(id){
	var dlg=art.dialog.open(getPath()+'/ebsite/outorderfollow/list?outBatchId='+id+'&height='+$list_editHeight+'&width='+$list_editWidth,
			{title:"订单跟踪",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outOrderFollow',
			button:[{name:'关闭'}]}
	);
}


function numberRender(rowData){
	if(rowData.status == 'COVERED'){
		return rowData.number;
	}else{
		return '<a href="javascript:void(0);" onclick="showDetail(\''+rowData.id+'\',\''+rowData.type+'\',\''+rowData.status+'\')">'+rowData.number+'</a>';
	}
	
}

//双击查看详情
function showDetail(id,type,status){
	if(status == 'COVERED'){
		return ;
	}
	var title="调拨批次详情";
	if(type == 'IN_STORAGE'){
		title="入库批次详情";
	}
	var url=getPath()+"/ebstorage/outBatch/showDetail/"+id+"/"+type+"?width="+$list_editWidth+"&height="+$list_editHeight;
	var dlg=art.dialog.open(url,
			{title:title,
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:"outBatchDetailDlg",
			button:[{name:'关闭'}]}
	);
}

/**
 * 确认调拨操作
 * @param rowData
 * @returns {String}
 */
function opreateRender(data){
	//调拨批次
//	if(rowData.type == 'OUT_STORAGE'){
//		if(rowData.status == 'NEWADD'){
//			if(permission_plspckd == 'Y'){
//				return '<a href="javascript:void(0);" onclick="confirmOpreate(\'' + rowData.id + '\',this,\'CONFIRMED\')">批量审批调拨单</a>';
//			}else{
//				return '';
//			}
//		}
//		if(rowData.status == 'CONFIRMED'){
//			if(permission_plqrsh == 'Y'){
//				return '<a href="javascript:void(0);" onclick="confirmOpreate(\'' + rowData.id + '\',this,\'CONFIRMED_GOT\')">批量确认收货</a>';
//			}
//			return '';
//		}
//	}else if(rowData.type == 'IN'){
//		return '';
//	}
	//打印调拨单
	if (permission_dydbd=='Y') {
		return '<a href="javascript:void(0);" onclick="printOutOrder(\''+data.id+'\')">打印调拨单</a>';
	}
	return '';
}
//打印调拨单
function printOutOrder(id){
	var dlg=art.dialog.open(getPath()+'/ebstorage/outBatch/printOutOrderList?outBatchId='+id,
			{title:"打印调拨单",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'pringOutOrder',
			button:[{name:'打印',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
					dlg.iframe.contentWindow.printer(dlg);
				}
				return false;
			}},{name:'关闭'}]}
	);
}

/**
 * 确认调拨批次操作
 * @param id
 * @param obj
 */
function confirmOpreate(id,obj,status){
	var _confirm="确定批量审批调拨单?";
	if(status == 'CONFIRMED_GOT'){
		_confirm="确定批量确认收货?";
	}
	art.dialog.confirm(_confirm,function(){
		$(obj).removeAttr("onclick").text("确认中...");
		$.post(getPath()+'/ebstorage/outBatch/confirmOpreate',{id:id,status:status},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips(res.MSG,1.7);
				searchData();
			}else{
				art.dialog.tips(res.MSG,1.7);
			}
		},'json');
	});
}

function renderStatus(rowData){
	return enumObj[rowData.status];
}

function renderType(rowData){
	return enumObj[rowData.type];
}
/**
 * 查询
 */
function searchData(){
	var type=$("#type").val();
	var status=$("#status").val();
	$list_dataParam['type']=type;
	$list_dataParam['status']=status;
	var number=$.trim($("#number").val());
	if (number!='' && number !=$("#number").attr('defaultValue')) {
		 $list_dataParam['number']=number;
	}else{
		delete $list_dataParam['number'];
	}
	resetList();
}
/**
 * 清空参数
 */
function onEmpty(){
	$("#number").val($("#number").attr("defaultValue"));
	$("#type").val("");
	$("#status").val("");
	searchData();
}
//自动生成 入库单
function autoInstorage(){
	$(".autoInstorage").removeClass("orangebtn").addClass("graybtn").off().find("a").text("生成中...");//按钮变灰
	$.post(getPath()+'/ebstorage/outBatch/autoCreateInStorage',{},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			searchData();
		}else{
			art.dialog.tips(res.MSG);
		}
		$(".autoInstorage").removeClass("graybtn").addClass("orangebtn").click(function(){
			autoInstorage();
		}).find("a").text("自动生成入库单");
	},'json');
}

/**
 * 初始化  自动调拨批次
 */
function initOutBatch(){
	
	$(".initOutbatch").removeClass("orangebtn").addClass("graybtn").off().find("a").text("生成中...");//按钮变灰
	$.post(getPath()+'/ebsite/outorderfollow/initFollow',{},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			searchData();
		}else{
			art.dialog.confirm(res.MSG,function(){
				
			});
		}
		$(".initOutbatch").removeClass("graybtn").addClass("orangebtn").click(function(){
			initOutBatch();
		}).find("a").text("生成调拨指令");
	},'json');
}

/**
 * 调拨单运算方案
 */
function batchOrderfilter(){
	var flag = true;
	var dlg=art.dialog.open(getPath()+'/ebsite/outorderfollow/batchOrderfilter?width='+$list_editWidth+'&height='+$list_editHeight,
			{title:"调拨单运算方案",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'batchOrderfilter',
			button:[{name:'开始运算',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.calcFilter){
					dlg.iframe.contentWindow.calcFilter(dlg);
				}
				return false;
			    }
			},{name:'关闭',callback:function(){
				flag = false;
				return true;
			   }
			}],
			 close:function(){
				 if(flag){
					 refresh();
				 }
			 }
			});
}

function judgeInit(){
	$.post(getPath()+'/ebsite/outorderfollow/judgeInit',{},function(res){
		if(res.STATE == 'SUCCESS'){
			queryExceptionOrder();
		}else{
			art.dialog.confirm(res.MSG,function(){
				
			});
		}
	},'json');
}

/**
 * 查询是否包含异常单
 */
function queryExceptionOrder(){
	$.post(getPath()+'/ebsite/outorderfollow/queryExceptionOrder',{},function(res){
		if(res.STATE == 'SUCCESS'){
			batchOrderfilter();
		}else{
			art.dialog.confirm(res.MSG,function(){
				batchOrderfilter();
			},function(){//弹出未支付订单 页面
				showExceptOrder();
			});
		}
	},'json');
}

/**
 * 弹出 异常订单 信息
 */
function showExceptOrder(){
	var dlg=art.dialog.open(getPath()+'/ebsite/outorderfollow/showExceptOrder',
			{title:"异常订单",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outOrderFollow',
			button:[{name:'关闭'}]}
	);
}

/**
 * 运算结果管理信息
 */
function showComputeResult(){
	var dlg=art.dialog.open(getPath()+'/ebsite/specialOperateOrder/showComputeResult',
			{title:"运算结果管理信息",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outOrderFollow',
			button:[{name:'关闭'}]}
	);
}


//回车查询事件
document.onkeydown=function(e){
	var keyCode= ($.browser.msie) ? e.keyCode : e.which ;  
	if(keyCode == 13){ 
		searchData();
    }
}

