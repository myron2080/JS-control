$list_editUrl = getPath()+"/ebstorage/out/editNumber";//编辑及查看url
$list_editWidth="1050px";
$list_editHeight="550px";
var statusEnum={ALREADYORDER:'已下单',ALREADRECEIPT:'已收货',ALREADYPAY:'已付款',SENDING:'配送中',ALREADDISTRIBUTION:'已配送',CHARGEBACKAPPLY:'退单申请',ALREADCHARGEBACK:'已退单'
	,ALREADCANCEL:"已取消",ZC_READY_PICK:'总仓待拣货',ZC_PICKING:'总仓拣货中',ZC_PICKED:'总仓已拣货',ZC_SENDING:'总仓配送中',FC_GOT:'分仓已收货'
		,FC_PICKING:'分仓拣货中',FC_PICKED:'分仓已拣货',FC_SENDING:'分仓配送中',HC_GOT:'合仓已收货',FC_HANG_UP:'分仓已挂起',GT_CANCEL:'未运算订单取消',HAND_CANCEL:'手工取消'};
$(document).ready(function(){
	AutoComp.init();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '操作', name: '', align: 'center',  width: 220, isSort:false,render:operateRender},
         {display: '订单跟踪', name: '', align: 'center',  width: 120, isSort:false,render : renderFollowing},
         {display: '订单编号', name: '', align: 'center',  width: 120, isSort:false,render : renderOrder},
         {display: '订单状态', name: 'status.name', align: 'center',  width: 120, isSort:false,render:renderOrderStatus},
         {display: '所属配送单号', name: '', align: 'center',  width: 260, isSort:false,render:nubmerLink},
        /* {display: '配送状态', name: '', align: 'center',  width: 180, isSort:false,render:renderOutOrderStatus},*/
         {display: '收货地址', name: 'addressInfo', align: 'left',  width: 260, isSort:false},
         {display: '下单人', name: '', align: 'center',  width: 100, isSort:false,render:renderName},
         {display: '下单人手机号', name: 'member.mobilePhone', align: 'center',  width: 100, isSort:false},
         {display: '支付时间', name: 'payTime', align: 'center',  width: 140, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebsite/outorderfollowManage/orderFollowList',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        }
    }));
	var params ={};
	params.width = 260;
	params.inputTitle = "支付时间";	
	MenuManager.common.create("DateRangeMenu","payTime",params);
	// 回车 事件
	$('#number,#address,#outOrderNo').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
});
function  renderFollowing(data){
	returnStr='';
	returnStr+='<a href="javascript:void()" onclick="showOrderDetail({id:\'' + data.id + '\',orderNo:\''+data.orderNo+'\'})">订单跟踪</a>'; 
	return returnStr;
}

function showOrderDetail(data){
	var dlg = art.dialog.open(getPath() + '/ebsite/orderline/list?orderId='+data.id+'&orderNo='+data.orderNo,
			{title:'订单跟踪-查看 ',
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:'orderFollowDetail',
			 button:[{name:'关闭'}]
			});
}

function renderName(data){
	 if(data.member){
		 if(data.member.nickName == ''){
			 return data.member.mobilePhone;
		 }else{
		 		return data.member.nickName;
		 	} 
		 }else{
			 return '';
			 }
	 }

function nubmerLink(data){
	var returnHtml='';
    var i;
	var outOrderNo= new Array(); 
	if (data.outOrderNos!=null && data.outOrderNos!='') {
		outOrderNo=data.outOrderNos.split(","); 
		for (i=0;i<outOrderNo.length ;i++ )   
	       {   
	    	returnHtml+='<a href="javascript:void()" onclick="showdataDetail(\''+outOrderNo[i]+'\')">'+outOrderNo[i]+'</a>'; 
	    	if (i!=outOrderNo.length-1) {
	    		returnHtml+=' | ';
			}
	    } 
	}
	return returnHtml;
}

function showdataDetail(id){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+id;
		}
		var dlg=art.dialog.open($list_editUrl+paramStr,
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
//显示订单详情
function renderOrder(data){
	
		if(data.status.value=="ALREADDISTRIBUTION"||data.status.value=="ALREADYPAY"||data.status.value=="ALREADRECEIPT")
		{
		    return '<a href="javascript:showDetail(\''+data.id+'\');">'+data.orderNo+'</a>';
		}
		else
		{
		    return '<a href="javascript:showDetail1(\''+data.id+'\');">'+data.orderNo+'</a>';
		}	
	
}

function showDetail(id){	
/*	var flag = true;
	if(sfxssqshan=='Y')//判断是否有此权限
	{
		flag = false;
	}*/	
	if(sfxssqshan=='Y')
	{
	   var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+id,
				{title:'订单细节',
				 lock:true,
				 width:(window.screen.width  * 53 /100)+"px",
				 height:(window.screen.height  * 41 /100)+"px",
				 id:'showDetail',
				 //button:[{name:'关闭'}]
				 button:[{name:'申请售后',disabled:false,callback:function(){
					    applicationAferSale(id);
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

function showDetail1(id){
/*	var flag = false;
	if(sfxssqshan=='Y')//判断是否有此权限
	{
		flag = true;
	}*/
	if(sfxssqshan=="Y")
    {
		var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+id,
				{title:'订单细节',
				 lock:true,
				 width:(window.screen.width  * 53 /100)+"px",
				 height:(window.screen.height  * 41 /100)+"px",
				 id:'showDetail',
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
		var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+id,
				{title:'订单细节',
				 lock:true,
				 width:(window.screen.width  * 53 /100)+"px",
				 height:(window.screen.height  * 41 /100)+"px",
				 id:'showDetail',
				 button:[{name:'关闭'}]
				});
	}
}


//显示申请售后页面
function applicationAferSale(id){
	var dlg = art.dialog.open(getPath() + '/ebsite/order/applicationAferSale?id='+id,
			{title:'申请售后',
			 lock:true,
			 width:(window.screen.width  * 18 /100)+"px",
			 height:(window.screen.height  * 20 /100)+"px",
			 id:'applicationAferSale'
			});
}


function operateRender(data) {
		var returnHtml='';
		//重新分配拣货人或者是配送人的前提是没有产生配送单的或者合仓已经收货的时候,就可以
		if (data.logisticsStatus==null || data.logisticsStatus.value=='HC_GOT') {
			if(againjhr == "Y"){
				if(data.pickingPeople != null ){
					returnHtml +='<a href="javascript:fpjhr({id:\'' + data.id+ '\'});">';
					returnHtml +=' 重新分配拣货人';
					returnHtml +='</a>';
				}
			}
			if (data.pickingPeople != null && data.person != null) {
				returnHtml +=' &nbsp; ';
			}
			if(agingpsr == "Y"){
				if(data.person != null){
					returnHtml += '<a href="javascript:distribution({id:\'' + data.id + '\'});">';
					returnHtml += '重新分配送货人';
					returnHtml +='</a>';
				}
			}
				
		}
	return returnHtml;
}

function renderOrderStatus(data){//订单状态和物流状态合并成一个状态
	if (data.logisticsStatus!=null && data.logisticsStatus!='') {
		if (data.status.value=='CHARGEBACKAPPLY') {
			return statusEnum[data.status.value];//退单申请
		}else if (data.status.value=='ALREADCHARGEBACK') {
			return statusEnum[data.status.value];//已退单
		}else if (data.status.value=='ALREADRECEIPT') {
			return statusEnum[data.status.value];//已收货
		}else if (data.status.value=='ALREADDISTRIBUTION') {
			return statusEnum[data.status.value];//已配送
		}
		return statusEnum[data.logisticsStatus.value];//返回订单的 配送状态 
	}else {
		return statusEnum[data.status.value];
	}
}

/*function renderOutOrderStatus(data){//配送状态
	if (data.status!='' && data.status!=null) {
		return statusEnum[data.status.value];
	}else {
		return '';
	}
		
}*/

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

//重新分配配送人

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

/**
 * 查询
 */
function searchData(){
	//
	var type=$("#isSend").val();
	if (type!='' && type!='undefine') {
		$list_dataParam['type'] = type;
	}else{
		delete $list_dataParam['type'];
	}
	//商品id
	var goodsId=$("#goodsId").val();
	if (goodsId!='') {
		$list_dataParam['goodsId'] = goodsId;
	}else {
		delete $list_dataParam['goodsId'];
	}
	//订单编号/下单人/下单人手机
	var number=$("#number").val().trim();
	if(number != '' && number != '订单编号/下单人/下单人手机号'){
		$list_dataParam['number'] = number;
	}else{
		delete $list_dataParam['number'];
	}
	//收货地址
	var address=$("#address").val().trim();
	if(address != '' && address != '收货地址'){
		$list_dataParam['address'] = address;
	}else{
		delete $list_dataParam['address'];
	}
	//配送单状态
	var status=$("#outOrderFollowStatus").val();
	if(status != ''){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	
	//订单状态
	var orderStatus=$("#orderStatus").val();
	if(orderStatus != ''){
		$list_dataParam['orderStatus'] = orderStatus;
	}else{
		delete $list_dataParam['orderStatus'];
	}
	//支付时间
	var outTime_begin = "";
	var outTime_end = "";
	if(MenuManager.menus["payTime"]){
		outTime_begin = MenuManager.menus["payTime"].getValue().timeStartValue;
		outTime_end = MenuManager.menus["payTime"].getValue().timeEndValue;
	}
	
	if(outTime_begin != ""){
		$list_dataParam['outTime_begin'] = outTime_begin;
	} else {
		delete $list_dataParam['outTime_begin'];
	}
	if(outTime_end != ""){
		$list_dataParam['outTime_end'] = outTime_end;
	} else {
		delete $list_dataParam['outTime_end'];
	}
	
	//所属配送单号
	var outOrderNo=$("#outOrderNo").val().trim();
	if(outOrderNo != '' && outOrderNo != '所属配送单号'){
		$list_dataParam['outOrderNo'] = outOrderNo;
	}else{
		delete $list_dataParam['outOrderNo'];
	}
	resetList();
}
function onEmpty(){
	//添加清空事件
		delete $list_dataParam['number'];
		delete $list_dataParam['type'];
		delete $list_dataParam['address'];
		delete $list_dataParam['outOrderFollowStatus'];
		delete $list_dataParam['outOrderNo'];
		delete $list_dataParam['goodsId'];
		$("#number").val("订单编号/下单人/下单人手机号");
		$("#address").val("收货地址");
		$("#outOrderNo").val("所属配送单号");
		$("#outOrderFollowStatus").val("");
		$("#isSend").val("");
		$("#goodsId").val("");
		$("#orderStatus").val("");
		$("#goodsNumber").val("");
		MenuManager.menus["payTime"].resetAll();
		searchData();

}

//导出的方法
function importList(){
	var param = "";

	//订单编号/下单人/下单人手机
	var number=$.trim($("#number").val());
	
	var status=$("#outOrderFollowStatus").val();
	
	//商品查询
	var goodsId=$("#goodsId").val();
	//支付时间
	var outTime_begin = "";
	var outTime_end = "";
	if(MenuManager.menus["payTime"]){
		outTime_begin = MenuManager.menus["payTime"].getValue().timeStartValue;
		outTime_end = MenuManager.menus["payTime"].getValue().timeEndValue;
	}
	//所属配送单号
	var outOrderNo=$.trim($("#outOrderNo").val());
	//收货地址
	var address=$.trim($("#address").val());
	
	var type=$("#isSend").val();
	param+="number=";
	if(number != '' && number != '订单编号/下单人/下单人手机号'){
		param+=number;
	}
	param+="&status=";
	if(status != '' ){
		param+=status;
	}
	param+="&outTime_begin=";
	if (outTime_begin!="") {
		param+=outTime_begin;
	}
	param+="&outTime_end=";
	if (outTime_end!="") {
		param+=outTime_end;
	}
	param+="&outOrderNo=";
	if(outOrderNo != '' && outOrderNo != '所属配送单号'){
		param+=outOrderNo;
	}
	param+="&address=";
	if(address != '' && address != '收货地址'){
		param+=address;
	}
	param+="&type=";
	if (type!='') {
		param+=type;
	}
	param+="&goodsId="
	if (goodsId!='') {
		param+=goodsId;
	}
	window.location.href=base+"/ebsite/outorderfollowManage/exportExcel?"+param;
}
function autoGoods(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	searchData();
}
