/**
 * 交易信息
 */
$list_editWidth = "870px";
$list_editHeight = "160px";
$list_dataType = "用户交易信息";//数据名称
var keyValue = "姓名/电话/公司";
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 220,render:operateRender},
			{display: '姓名', name: 'nickName', align: 'left', width:80,render:viewRender},
			{display: '级别', name: 'memberLevel.name', align: 'center', width:80},
			{display: '注册日期', name: 'registerDate', align: 'left', width:160, dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"},
			{display: '电话', name: 'phone', align: 'left', width:110},
			{display: '公司', name: 'company.name', align: 'left', width:150},
			{display: '累计充值金额', name: 'sumAmount', align: 'right', width:120},
			{display: '累计充值分钟', name: 'sumMinute', align: 'right', width:120},
			{display: '赠送分钟', name: 'sumSend', align: 'right', width:120},
			{display: '推荐获得分钟', name: 'sumRecommend', align: 'right', width:120},
			{display: '累计扣除', name: 'sumDeduct', align: 'right', width:120},
			{display: '累计消费分钟', name: 'sumConsumption', align: 'right', width:120},
			{display: '当前剩余分钟', name: 'amountBalance', align: 'right', width:120}
        ],
        url:getPath()+"/bage/user/userTradeList",
    }));
	//绑定事件
	$("#selectData").click(function(){
		selectList();
	});
	var params ={};
	params.width = 210;
	params.inputTitle = "注册日期";	
	MenuManager.common.create("DateRangeMenu","registerDate",params);

	$("#serchBtn").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){
		MenuManager.menus["registerDate"].resetAll();
		delete $list_dataParam['keyWord'];	
		$("#keyWord").attr("value", keyValue);
	});
	
	//回车操作
	inputEnterSearch("keyWord",selectList);
});

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//注册时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["registerDate"]){
		queryStartDate = MenuManager.menus["registerDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["registerDate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}



/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var str='';
	str+='<a href="javascript:recharge({id:\''+data.id+'\',tradeEnum:\'HTTOPUP\'});">充值| </a>';
	str+='<a href="javascript:recharge({id:\''+data.id+'\',tradeEnum:\'HTPRESENTATION\'});">赠送| </a>';
	str+='<a href="javascript:recharge({id:\''+data.id+'\',tradeEnum:\'HTDEDUCT\'});">扣除</a>';
	return str;	
}

function viewRender(data,filterData){
	var str='';
	str+='<a href="javascript:viewTradeDetail(\''+data.id+'\',\''+data.sumAmount+'\',\''+data.sumMinute+'\',\''+data.sumSend+'\',\''+data.sumRecommend+'\',\''+data.sumDeduct+'\',\''+data.sumConsumption+'\',\''+data.amountBalance+'\');">' + data.nickName + '</a>';
	return str;	
}


function viewTradeDetail(id,sumAmount,sumMinute,sumSend,sumRecommend,sumDeduct,sumConsumption,amountBalance){
	var url = getPath() + "/bage/usertrade/list?userId=" + id;
	url+= "&sumAmount="+sumAmount +"&sumMinute="+sumMinute +"&sumSend="+sumSend +"&sumRecommend="+sumRecommend +"&sumDeduct="+sumDeduct +"&sumConsumption="+sumConsumption +"&amountBalance="+amountBalance;
	var dlg = art.dialog.open(url,{
		 title:"交易操作",
		 lock:true,
		 width:'900px',
		 height:'400px',
		 id:"viewTradeDetail",
		 button:[{name:'关闭',callback:function(){
				return true;
			}}]
	});
}


function recharge(data,tradeEnum){
	var url = getPath()+"/bage/user/toRechare?userId=" + data.id + "&tradeEnum=" + data.tradeEnum;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:"交易操作",
		 lock:true,
		 width:'430px',
		 height:'150px',
		 id:tradeEnum,
		 button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
					dlg.iframe.contentWindow.save(dlg);
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

/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}

