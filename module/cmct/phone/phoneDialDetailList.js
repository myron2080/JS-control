$(document).ready(function(){
	params ={};
	params.inputTitle = "日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	
	var infoNumber=$('#infoNumber').val();
	if(infoNumber!=null && infoNumber!=''){
		$("#keyConditions").val(infoNumber);
		$("li[syncCtrl='Y']").hide();
	}
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(startDate!=''){
		MenuManager.menus["operatedate"].setValue(startDate,endDate);
		MenuManager.menus["operatedate"].confirm();
	}
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '固话号码', name: 'infoNumber', align: 'left', width: 100,render:renderInfoNumber},
            {display: '业务类型', name: 'busType', align: 'left', width: 160,render:renderBusType},
            {display: '对方号码', name: 'outherNumber', align: 'left', width: 120},
            {display: '起始时间', name: 'startTime', align: 'left', width: 150},
            {display: '结束时间', name: 'endTime', align: 'center', width: 150},
            {display: '通话时长', name: 'callDuration', align: 'left', width: 80,render:renderCostTime},
            {display: '费率', name: 'rate', align: 'left', width: 80,render:checkRate},
            {display: '话费', name: 'callCost', align: 'left', width: 80,render:checkCallCost}
        ],
        width:"98%",
        height:"98%",
        url:getPath()+'/cmct/phoneDialDetail/listData',
        delayLoad:true,
        usePager:true,
        enabledSort:false
        
    }));
	
	bindEvent(); 
	searchData();
	
	//获取同步时间
	getLastSyncTime();
});

function renderInfoNumber(data){
	var infoNumber = $("#keyConditions").val();
	if(infoNumber == "隐藏呼出"){
		return "隐藏号码" ;
	}
	return data.infoNumber ;
}

function checkRate(data){
	if(data.rate==null||data.rate==''){
		return "0";
	}
	return data.rate;
}
function checkCallCost(data){
	if(data.callCost==null||data.callCost==''){
		return "0";
	}
	return data.callCost;
}
function bindEvent(){
	
	var otherNumber=$('#otherNumber').val();
	if(otherNumber!='Y'){
		$list_dataGrid.toggleCol("outherNumber",false);
	}
	
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
	$("#clear").click(function(){
		MenuManager.menus["operatedate"].resetAll();
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	});
	
	eventFun($("#keyConditions"));
}

function renderCostTime(data){
	var costTime = data.callDuration ;
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

function searchData(){
	//[固话号码]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		if(keyConditions == "隐藏呼出"){
			keyConditions = "HIDE" ;
		}
		$list_dataParam['infoNumber'] = keyConditions;
	}else{
		delete $list_dataParam['infoNumber'];
	}
	
	var partners=$('#partners').val();
	
	if(partners=='TTEN'){
		$("select[id='busType'] option :eq(1)").attr('selected','selected');
	}else if(partners=='HW'){
		$("select[id='busType'] option :eq(6)").attr('selected','selected');
	}else{
		
	}
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["operatedate"]){
		queryStartDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
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
	var busType = $('#busType').val();
	if(busType!=null && busType!=''){
		$list_dataParam['busType'] = busType;
	}else{
		delete $list_dataParam['busType'];
	}
	resetList();
	$('#partners').val('');
}
/**清除查询，日期框*/
function clearSearch(){
	MenuManager.menus["operatedate"].resetAll();
	$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
}
//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

/**
 * 同步话单
 */
function syncCallList(){
	if($("#btnSyncCall").hasClass("graybtn")){
		art.dialog.tips("同步正在处理中，请稍等片刻...");
		return false ;
	}
	$("#btnSyncCall a").text("同步中，请稍等片刻...");
	$("#btnSyncCall").removeClass("orangebtn");
	$("#btnSyncCall").addClass("graybtn");
	$.post(getPath()+"/cmct/phoneDialDetail/syncCallList",{},function(data){
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips("成功同步 "+data.syncCount+" 条话单记录！");
			$("#btnSyncCall a").text("同步话单");
			$("#btnSyncCall").removeClass("graybtn");
			$("#btnSyncCall").addClass("orangebtn");
			getLastSyncTime();
			searchData();
		}else{
			art.dialog.tips("同步失败："+data.MSG);
			$("#btnSyncCall a").text("同步话单");
			$("#btnSyncCall").removeClass("graybtn");
			$("#btnSyncCall").addClass("orangebtn");
		}
	},'json');
}

/**
 * 获取最后同步时间
 */
function getLastSyncTime(){
	$.post(getPath()+"/cmct/phoneDialDetail/syncLastTime",{},function(data){
		if(data.TIME!=null && data.TIME!=''){
			$("#li_lastSyncTime").text("上次同步到："+data.TIME);
		}else{
			$("#li_lastSyncTime").text("");
		}
	},'json');
}

/**
 * 按天同步话单
 */
function syncCallListDay(){
	var syncTime = $("#syncTime").val();
	if(syncTime == null || syncTime == ''){
		art.dialog.tips("请选择同步日期！");
		return false ;
	}
	if($("#btnSyncCallDay").hasClass("graybtn")){
		art.dialog.tips("同步正在处理中，请稍等片刻...");
		return false ;
	}
	$("#btnSyncCallDay a").text("同步中，请稍等片刻...");
	$("#btnSyncCallDay").removeClass("orangebtn");
	$("#btnSyncCallDay").addClass("graybtn");
	$.post(getPath()+"/cmct/phoneDialDetail/syncCallListDay",{syncTime:syncTime},function(data){
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips("成功同步 "+data.syncCount+" 条话单记录！");
			$("#btnSyncCallDay a").text("按天同步话单");
			$("#btnSyncCallDay").removeClass("graybtn");
			$("#btnSyncCallDay").addClass("orangebtn");
			getLastSyncTime();
			searchData();
		}else{
			art.dialog.tips("同步失败："+data.MSG);
			$("#btnSyncCallDay a").text("按天同步话单");
			$("#btnSyncCallDay").removeClass("graybtn");
			$("#btnSyncCallDay").addClass("orangebtn");
		}
	},'json');
}

function renderBusType(data){
	if(data.busType=='101'){
		return '点击拨号';
	}
	return data.busType;
}