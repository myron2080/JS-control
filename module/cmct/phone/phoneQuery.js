$list_addUrl = "";//查看url
$list_editWidth = 450;
$list_editHeight = 140;

$list_dataType = "呼叫记录查看";//数据名称
 
$(document).ready(function(){
	 
//	params ={};
//	params.inputTitle = "呼叫时间";	
//	MenuManager.common.create("DateRangeMenu","effectdate",params);
//	//默认值，当月
//	MenuManager.menus["effectdate"].setValue(startDay,endDay);
//	MenuManager.menus["effectdate"].confirm();
	$list_defaultGridParam.pageSize=100;
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '姓名', name: 'callName', align: 'left', width: 100},
            {display: '呼叫时间', name: 'callTime', align: 'left', width: 120},
            {display: '主叫号码', name: 'fromPhone', align: 'left', width: 100,render:renderFromPhone},
            {display: '被叫人姓名', name: 'toName', align: 'left', width: 100},
            {display: '被叫人号码', name: 'toPhone', align: 'left', width: 100},
            {display: '去电显示号码', name: 'currShowPhone', align: 'center', width: 120,render:renderShowPhone},
            {display: '通话结果', name: 'callResult', align: 'center', width: 80,render:renderCallResult},
            {display: '通话时长', name: 'costTime', align: 'left', width: 80,render:renderCostTime},
            {display: '描述', name: 'remark', align: 'left', width: 200}
        ],
        url:getPath()+'/cmct/phoneQuery/listData',
        delayLoad:true,
        usePager:true,
        enabledSort:false
    }));
	
	bindEvent(); 
	searchData();
});

function changeType(){
	var type=$("#dateType").val();
	if(type == 'month'){
		$("#effectdate").hide();
		$("#day_single").hide();
		$("#month_single").show();
	}else if(type == 'day'){
		$("#month_single").hide();
		$("#effectdate").hide();
		$("#day_single").show();
	}else if(type == 'period'){
		$("#day_single").hide();
		$("#month_single").hide();
		$("#effectdate").show();
	}
		
}

function changeMonth(type){
	var showMonth=$("#showMonth").val();
	if(null != showMonth && showMonth != ''){
		var y=parseInt(showMonth.split("-")[0],10);//年
		var m=parseInt(showMonth.split("-")[1],10);//月
		var year;
		var month;
		if(type == 'up'){//上一月
			if(m == 1){
				year=(y-1)+"";
				month="12";
			}else{
				year=y+"";
				if(m <11){//月份 需加0
					month="0"+(m-1);
				}else{
					month=(m-1)+"";
				}
			}
		}else{//下一月
			if(m == 12){
				year=(y+1)+"";
				month="01";
			}else{
				year=y+"";
				if(m <9){//月份 需加0
					month="0"+(m+1);
				}else{
					month=(m+1)+"";
				}
			}
		}
		$("#showMonth").val(year+"-"+month);
		searchData();
	}else{
		art.dialog.tips("请选择日期!");
	}
}

function changeDay(type){
	var showDay=$("#showDay").val();
	if(null != showDay && showDay != ''){
		$.post(getPath()+'/fastsale/achieveDetail/getDate',{showDay:showDay,type:type},function(json){
			if(null != json.result){
				$("#showDay").val(json.result);
				searchData();
			}
		},'json');
	}else{
		art.dialog.tips("请选择日期!");
	}
}

function renderFromPhone(data){
	if(!data.fromPhone){
		return data.currShowPhone;
	}
	return data.fromPhone;
}

function bindEvent(){
	
 
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	
	//清空
	$("#resetBtn").click(function(){
//		MenuManager.menus["effectdate"].resetAll();
		clearDataPicker('keyPerson');
		$("#callPersonName").val($("#callPersonName").attr("defaultValue"));
		$("#searchStr").val($("#searchStr").attr("defaultValue"));
	});
	
	eventFun($("#callPersonName"));
	eventFun($("#searchStr"));
	
	inputEnterSearch('searchStr',searchData);
}

function renderCostTime(data){
	var costTime = data.costTime ;
	var rtnVal = '' ;
	if(costTime == 0){
		
	}else if(costTime < 60 ){
		rtnVal = costTime + "秒" ;
	}else if(costTime >= 60 && costTime < 60*60){
		rtnVal = Math.floor(costTime/60) + "分" + costTime%60 + "秒";
	}else if(costTime >= 60*60 && costTime < 24*60*60){
		var h = Math.floor(costTime/(60*60)) ;
		var m = Math.floor((costTime - h*(60*60))/60);
		var s = (costTime - h*(60*60))%60;
		rtnVal = h+"小时"+m+ "分"+ s + "秒";
	}
	return rtnVal ;
}

function renderShowPhone(data){
	var showPhone = data.currShowPhone ;
	if(showPhone == 'HIDE'){
		return "隐藏" ;
	}
	return showPhone == null ? "" : showPhone ;
}

function renderCallResult(data){
	var callResult = data.callResult ;
	var rtnVal = '' ;
	switch(callResult){
		case 'C_128':
			rtnVal = '成功' ;
			break ;
		case 'C_127':
			rtnVal = '失败' ;
			break ;
		case 'C_125':
			rtnVal = '失败' ;
			break ;
		case 'C_122':
			rtnVal = '拨号中...' ;
			break ;
		default:
			rtnVal = '' ;
			break ;
	}
	return rtnVal ;
}
  
function searchData(){
	
	$list_dataParam['orderByClause'] = " ic.fcalltime desc";
	
	var callPersonId = $('#callPersonId').val();
	if(callPersonId){
		$list_dataParam['callPersonId'] = callPersonId;
	}else{
		delete $list_dataParam['callPersonId'];
	}
	
	var callResult = $('#callResult').val();
	if(callResult){
		$list_dataParam['callResult'] = callResult;
	}else{
		delete $list_dataParam['callResult'];
	}
	
	var searchStr = $('#searchStr').val();
	if(searchStr && $("#searchStr").attr("defaultValue") != searchStr){
		$list_dataParam['searchStr'] = searchStr;
	}else{
		delete $list_dataParam['searchStr'];
	}
	
	
	var dateType=$("#dateType").val();
	var showDay=$("#showDay").val();
	var showMonth=$("#showMonth").val();
	
	if(!showDay && !showMonth){
		art.dialog.tips('请选择时间');
		return false;
	}
	$list_dataParam['dateType'] = dateType;
	$list_dataParam['showDay'] = showDay;
	$list_dataParam['showMonth'] = showMonth;
		
//	//录入时间
//	var queryStartDate = "";
//	var queryEndDate = "";
//	if(MenuManager.menus["effectdate"]){
//		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
//		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
//	}
//	
//	//查询开始时间
//	if(queryStartDate != ""){
//		$list_dataParam['queryStartDate'] = queryStartDate;
//	} else {
//		delete $list_dataParam['queryStartDate'];
//	}
//	//查询结束时间
//	if(queryEndDate != ""){
//		$list_dataParam['queryEndDate'] = queryEndDate;
//	} else {
//		delete $list_dataParam['queryEndDate'];
//	}
	
	resetList();
}