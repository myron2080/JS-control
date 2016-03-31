$list_dataType = "线路";//数据名称
$(document).ready(function(){
	
	params ={};
	params.inputTitle = "通话时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	//默认值，当月
	MenuManager.menus["effectdate"].setValue(startDay,endDay);
	MenuManager.menus["effectdate"].confirm();
	
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '流水号', name: 'costId', align: 'center', width: 100},
		            {display: '用户ID', name: 'callId', align: 'left', width: 100,height:40},
		            {display: '呼叫号码', name: 'infoNumber', align: 'left', width: 100,height:40},
		            {display: '被叫号码', name: 'outherNumber', align: 'left', width: 100,height:40},
		            {display: '通话开始时间', name: 'startTime', align: 'center', width: 140,height:40},
		            {display: '通话结束时间', name: 'endTime', align: 'left', width: 140,height:40},
		            {display: '本次通话时间', name: 'callDuration', align: 'left', width: 100,height:40},
		            {display: '通话扣除金额', name: 'callCost', align: 'left', width: 100,height:40}
//		            {display: '通话成本', name: 'rate', align: 'center', width: 100,height:40}
		        ],
        delayLoad:true,
        url:getPath()+'/cmct/phoneMobileBill/listData'
    }));
	searchData();
	$('#searchBtn').bind('click',function(){
		searchData();
	});
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

function searchData(){
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
	var dateType=$("#dateType").val();
	var showDay=$("#showDay").val();
	var showMonth=$("#showMonth").val();
	

	$list_dataParam['orgId'] = $('#orgId').val();
	$list_dataParam['dateType'] = dateType;
	$list_dataParam['showDay'] = showDay;
	$list_dataParam['showMonth'] = showMonth;
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['startTime'] = queryStartDate;
	} else {
		delete $list_dataParam['startTime'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['endTime'] = queryEndDate;
	} else {
		delete $list_dataParam['endTime'];
	}
	$list_dataParam['userId'] = userId;
	resetList();
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
