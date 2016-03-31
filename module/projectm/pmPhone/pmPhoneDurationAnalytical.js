$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "拨打日期";
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	/**
	 * 设置默认值
	 */
	MenuManager.menus["effectdate"].setValue(startDay,endDay);
	MenuManager.menus["effectdate"].confirm();
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '固话号码', name: 'infoNumber', align: 'center', width: 100,height:40,render:renderInfoNumber},
		            {display: '使用模式', name: 'useType', align: 'center', width: 100,height:40},
		            /*{display: '总拨打数', name: '', align: 'left', width: 100,height:40},*/
		            {display: '总时长', name: 'totalDuration', align: 'center', width: 100,height:40,render:renderDuration},
		          /*  {display: '平均通话时长', name: 'avgDuration', align: 'center', width: 80,height:40,render:renderDuration1},*/
		            {display: '0-20秒通数', name: 'zeroTotwenty', align: 'center', width: 180,height:40},
		            {display: '20秒-1分钟通数', name: 'twentyToOneMinute', align: 'center', width: 180,height:40},
		            {display: '1分钟-3分钟通数', name: 'oneMinuteToThreeMinute', align: 'center', width: 180,height:40},
		            {display: '3分钟以上通数', name: 'threeMinuteAbove', align: 'center', width: 180,height:40}
		        ],
       delayLoad:true,
       url:getPath()+'/projectm/pmDurationAnalytical/queryByDurationAnalytical'
   }));
	bindEvent();
	openDataPicker('getCustomer');
	//searchData();
});

$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function renderInfoNumber(data){
	var infoNumber = data.infoNumber ;
	if(infoNumber == "HIDE"){
		return "隐藏呼出" ;
	}
	return infoNumber ;
}


function renderDuration(data){
	var costTime = data.totalDuration ;
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
	}else{
		var h = Math.floor(costTime/(60*60)) ;
		var m = Math.floor((costTime - h*(60*60))/60);
		var s = (costTime - h*(60*60))%60;
		rtnVal = h+"小时"+m+ "分"+ s + "秒";
	}
	return rtnVal ;
}
function renderDuration1(data){
	var costTime = data.avgDuration ;
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
	}else{
		var h = Math.floor(costTime/(60*60)) ;
		var m = Math.floor((costTime - h*(60*60))/60);
		var s = (costTime - h*(60*60))%60;
		rtnVal = h+"小时"+m+ "分"+ s + "秒";
	}
	return rtnVal ;
}

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
		if((year+"-"+month)>formatDate(new Date(),'yyyy-MM').trim()){
			art.dialog.tips("只能查询当前月以前同步的信息");
			return ;
		}
		$("#showMonth").val(year+"-"+month);
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
			}
		},'json');
	}else{
		art.dialog.tips("请选择日期!");
	}
}

function bindEvent(){
	//查询
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	//清空
	$("#clear").click(function(){
		MenuManager.menus["effectdate"].resetAll();
		//$('#orgName').val($('#fixOrgName').val());
		//$('#orgId').val($('#fixOrgId').val());
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
		$('#customerId').val('');
		$('#customerName').val('所属客户');
	});
	
	eventFun($("#keyConditions"));
	
	/**
	   * 图表数据
	   *//*
	var myChart = new FusionCharts(getPath()+"/default/js/control/fusionCharts/swf/Line.swf", "myChartId", "100%", "260");  
	  
	myChart.setXMLData(chartData);  
	myChart.render("chartdiv");  */
}

function searchData(){
	
	/**
	 * 客户id
	 */
	/*if($('#customerId').val()==null || $('#customerId').val()==''){
		art.dialog.tips("请先选择客户在点击查询");
		delete $list_dataParam['customerId'];
		return false;
	}else{
		$list_dataParam['customerId'] = $('#customerId').val();
	}*/
	
	var orgId = $("#orgInterfaceId :selected").val();
	if(orgId==null || orgId==''){
		art.dialog.tips("请先选择核算渠道");
		delete $list_dataParam['orgId'];
		return false;
	}else{
		$list_dataParam['orgId'] = orgId;
	}
	
	var partners = $("#orgInterfaceId :selected").attr('partners');
	$list_dataParam['partners'] = partners;
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['startDay'] = queryStartDate;
	} else {
		delete $list_dataParam['startDay'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['endDay'] = queryEndDate;
	} else {
		delete $list_dataParam['endDay'];
	}
	
	//[固话号码]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['infoNumber'] = keyConditions;
	}else{
		delete $list_dataParam['infoNumber'];
	}
	if(!$("#showMonth").val()){
		art.dialog.tips("请选择月份...");
		return false;
	}
	
	//var orgId=$("#orgId").val();
	$list_dataParam['dateType']=$("#dateType").val();
	$list_dataParam['showMonth']=$("#showMonth").val();
	$list_dataParam['showDay']=$("#showDay").val();
	//$list_dataParam['orgId']=$("#orgId").val();
	resetList();
}

function getSyncOrgId(oldValue,newValue,doc){
	var customerId=newValue.id;
	$("select[id='orgInterfaceId']").remove();
	if(!customerId){			
		return false;
	}
	/**
	 * 根据所选客户获取渠道商id
	 */
	$.post(getPath()+"/projectm/pmSyncManage/getSyncOrgId",{customerId:customerId},function(res){
		res=eval("("+res+")");
		if(res.STATE=='SUCCESS'){
			var pcsList=res.MSG;
			var select="<li><select id='orgInterfaceId' index='moreOrgId' class='k03' style='width: 120px' onchange=searchData()>";
			for(var i=0;i<pcsList.length;i++){
				select+="<option partners="+pcsList[i].partners+" value="+pcsList[i].orgId+">"+pcsList[i].configName+"</option>";
			}
			select+="</select></li>";
			$('ul li :eq(0)').after(select);			
		searchData();
		}else{
			art.dialog.tips(res.MSG);
		}
	});
}