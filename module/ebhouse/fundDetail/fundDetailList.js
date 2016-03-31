var $confirmpayUrl = getPath()+"/ebhouse/fundDetail/confirmPay";//新增url
$list_editWidth = "798px";
$list_editHeight = "220px";

$(function(){
	params ={};
	params.inputTitle = "交易时间";	
	MenuManager.common.create("DateRangeMenu","tradeTime",params);
	
	bindEvent();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '操作', align: 'left', width: 60,render:opearender},
			{display: '状态', name:'statusName',  align: 'left', width: 50,render:statusRender},
			{display: '物业信息', name: 'propertyName', align: 'left', width: 190},
            {display: '交易时间', name: 'formatTradeTime', align: 'left', width: 100},
            {display: '交易金额', name: 'formatTradeMoney', align: 'right', width: 100,render:moneyRender},
            {display: '业务类型', align: 'left', width: 60,render:businessTypeRender},
            {display: '会员', name: 'user.name', align: 'left', width: 55},
            {display: '交易类型', name: 'tradeTypeName', align: 'left', width: 50},
            {display: '详情', align: 'left', width: 550,render:remarkRender},
            {display: '经办人', name: 'transactor', align: 'left', width: 50}     
        ],
        fixedCellHeight:false,
        delayLoad:true,
        url:getPath()+'/ebhouse/fundDetail/listData'
    }));
	
	searchData();
});


function moneyRender(rowData){
	if(rowData.formatTradeMoney.indexOf('-') >= 0 ){
		return rowData.formatTradeMoney.substring(1,rowData.formatTradeMoney.length);
	}
	return rowData.formatTradeMoney;
}

function remarkRender(rowData){
	var result= "";
	if(null != rowData.remark && "" != rowData.remark){
		result +="<strong style='font-weight:bold;color:#008000'>备注：</strong>"+rowData.remark+"<br/>";
	}
	if(null != rowData.settleAccountStr && "" != rowData.settleAccountStr){
		result +="<strong style='font-weight:bold;color:#FF0000'>结算信息：</strong><br/>";
		result += rowData.settleAccountStr;
	}
	return result;
}

function statusRender(rowData){
	if(rowData.businessType == 'BACKOFF'){
		if(rowData.status == "NOTCONFIRM" || "NOTPAY" == rowData.status){
			return "待退款";
		}
		if("HASREJECT" == rowData.status){
			return '<span style="color:red">' + rowData.statusName + '</span>';
		}
		return "已退款";
	}else{
		if(rowData.status == "HASCONFIRMED" || "HASPAYED" == rowData.status){
			return "已确认";
		}
		return rowData.statusName;
	}
}

function businessTypeRender(rowData){
	if(rowData.businessType == 'BACKOFF'){
		return rowData.businessTypeName;
	}
	
	return rowData.businessTypeName;
}

function opearender(rowData){
	
	if("RECHARGE" == rowData.businessType || "HASREJECT" == rowData.status || "BACKOFFORDER" == rowData.businessType){
		return "";
	}
	
	if((rowData.businessType == 'BACKOFF' || rowData.businessType == 'WITHDRAW' || rowData.businessType=='PAY') && ("NOTCONFIRM" == rowData.status || rowData.status == "NOTPAY")){
		return "<a href='javascript:void(0)' onclick='confirmPay({id:\""+rowData.id+"\",businessType:\""+rowData.businessType+"\"})'>确认</a>";
	}else{
//		if("BACKOFF" == rowData.businessType){
//			return "<a href='javascript:void(0)' style='color:red;' onclick='cancleConfirm(\""+rowData.id+"\",\"" + rowData.businessType + "\")'>驳回</a>";
//		}
		return "<a href='javascript:void(0)' style='color:red;' onclick='cancleConfirm(\""+rowData.id+"\",\"" + rowData.businessType + "\")'>取消确认</a>";
	}
	return "";
}

/**
 * 确认付款
 * @param id
 */
function confirmPay(rowData){
	var showStr = "确认收款";
	if(rowData.businessType == 'BACKOFF'){
		showStr = "确认退款";
	}
	
	if(rowData.businessType == 'WITHDRAW'){
		showStr = "确认该单据提现？";
	}
	
	if(rowData.businessType == 'RECHARGE'){
		showStr = "确认充值金额已到帐？";
	}
	if(rowData.businessType == 'WITHDRAW' || rowData.businessType == 'RECHARGE'){
		art.dialog({
		    content: showStr,
		    ok: function () {
		    	var _this=this;
		    	$.post(base+"/ebhouse/fundDetail/confirm",{id:rowData.id,businessType:rowData.businessType},function(data){
		    		 var state=data.STATE;
		    		 var tipStr='';
		    		 if(state=='SUCCESS'){
		    			 tipStr='确认成功';
		    			 searchData();
		    		 }else{
		    			 tipStr='确认失败';
		    		 }
		    		 _this.title(tipStr).time(1);
		    	},'json');
		    },
		    cancelVal: '关闭',
		    cancel: true
		});
		
	}else{
		if(rowData.businessType == 'BACKOFF'){
			var dlg = art.dialog.open($confirmpayUrl+"?id="+rowData.id,{
				title:showStr,
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:"CONFIRM-PAY",
				button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'驳回',callback:function(){
					$.post(base+'/ebhouse/fundDetail/cancleConfirm',{id:rowData.id,businessType:rowData.businessType},function(data){
			    		 var state=data.STATE;
			    		 if(state=='SUCCESS'){
			    			 searchData();
			    		 }
			    		 _this.title(dta.MSG).time(1);
			    	},'json');
				}}],
				close:function(){
					resetList();
				}
			});
		}else{
			var dlg = art.dialog.open($confirmpayUrl+"?id="+rowData.id,{
				title:showStr,
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:"CONFIRM-PAY",
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
	}
}

function cancleConfirm(id,businessType){
	art.dialog({
	    content: '确认取消该单据吗？',
	    ok: function () {
	    	var _this=this;
	    	$.post(base+'/ebhouse/fundDetail/cancleConfirm',{id:id,businessType:businessType},function(data){
	    		 var state=data.STATE;
	    		 if(state=='SUCCESS'){
	    			 searchData();
	    		 }
	    		 _this.title(dta.MSG).time(1);
	    	},'json');
	    },
	    cancelVal: '关闭',
	    cancel: true
	});
}

function searchData(){
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["tradeTime"]){
		queryStartDate = MenuManager.menus["tradeTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["tradeTime"].getValue().timeEndValue;
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
	
	
	//业务类型
	var businessType = $("#businessType").val();
	if(null == businessType || "" == businessType ){
		delete $list_dataParam['businessType'];
	} else {
		$list_dataParam['businessType'] = businessType;
	}
	
	
	if(null != $("li.hover").attr("key")){
		$list_dataParam['businessType'] = $("li.hover").attr("key");
	}
	
	//交易类型
	var tradeType = $("#tradeType").val();
	if(null == tradeType || "" == tradeType ){
		delete $list_dataParam['tradeType'];
	} else {
		$list_dataParam['tradeType'] = tradeType;
	}
	
	//确认状态
	var status = $("#status").val();
	if(null == status || "" == status ){
		delete $list_dataParam['status'];
	} else {
		$list_dataParam['status'] = status;
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
			if($(this).attr("key") == "RECHARGE" || "WITHDRAW" == $(this).attr("key")){
				$list_dataGrid.setOptions({
					columns:[ 
					         {display: '操作', align: 'left', width: 60,render:opearender},
					         {display: '状态', name:'statusName',  align: 'left', width: 50,render:statusRender},
					         {display: '交易时间', name: 'formatTradeTime', align: 'left', width: 100},
					         {display: '交易金额', name: 'formatTradeMoney', align: 'right', width: 100,render:moneyRender},
					         {display: '业务类型', align: 'left', width: 60,render:businessTypeRender},
					         {display: '会员', name: 'user.name', align: 'left', width: 55},
					         {display: '交易类型', name: 'tradeTypeName', align: 'left', width: 50},
					         {display: '详情', align: 'left', width: 550,render:remarkRender},
					         {display: '经办人', name: 'transactor', align: 'left', width: 50}
					         ]
				});
			}else{
				$list_dataGrid.setOptions({
					columns:[ 
					         {display: '操作', align: 'left', width: 60,render:opearender},
					         {display: '状态', name:'statusName',  align: 'left', width: 50,render:statusRender},
					         {display: '物业信息', name: 'propertyName', align: 'left', width: 190},
					         {display: '交易时间', name: 'formatTradeTime', align: 'left', width: 100},
					         {display: '交易金额', name: 'formatTradeMoney', align: 'right', width: 100,render:moneyRender},
					         {display: '业务类型', align: 'left', width: 60,render:businessTypeRender},
					         {display: '会员', name: 'user.name', align: 'left', width: 55},
					         {display: '交易类型', name: 'tradeTypeName', align: 'left', width: 50},
					         {display: '详情', align: 'left', width: 550,render:remarkRender},
					         {display: '经办人', name: 'transactor', align: 'left', width: 50}
					         ]
				});
			}
			
			
			if(null == $(this).attr("key")){
				$("li[key='businessType']").show();
			} else {
				$("li[key='businessType']").hide();
			}
			searchData();
		});
	});
	
	$("#addBtn").bind("click",function(){
		addRow();
	});
	
	$("#searchBtns").bind("click",function(){
		searchData();
	});
	
	//回车查询
	inputEnterSearch("searchKeyWord",searchData);
}

$("#exportBtn").click(function(){	
	 exportFundDetailByCond();
});
/**
* 导出Excel
*/ 
var param = "";
function exportFundDetailByCond(){
	param = "";	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["tradeTime"]){
		queryStartDate = MenuManager.menus["tradeTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["tradeTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		setParam('queryStartDate',queryStartDate);
	} 
	//查询结束时间
	if(queryEndDate != ""){
		setParam('queryEndDate',queryEndDate);
	} 
	
	//交易类型
	var tradeType = $("#tradeType").val();
	if(null != tradeType && "" != tradeType ){
		setParam('tradeType',tradeType);
	}
	//确认状态
	var status = $("#status").val();
	if(null != status && "" != status ){
		setParam('status',status);
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
		setParam('businessType',$("li.hover").attr("key"));
	}
var url = getPath()+"/ebhouse/fundDetail/exportOrderByCond"+param;
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






