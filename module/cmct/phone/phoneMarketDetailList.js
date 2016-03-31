var statusMap={1:'未接听',2:'已接听',3:'已转接'};
$(document).ready(function(){
	params ={};
	params.inputTitle = "日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	g =  manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: 'workId', name: 'workID', align: 'left', width: 200,height:40},
		            {display: '主叫号码', name: 'transferNumber', align: 'left', width: 100,height:40},
		            {display: '被叫号码', name: 'calleeNbr', align: 'left', width: 100,height:40},
		            {display: '开始时间', name: 'startTimeT', align: 'center', width: 140,height:40},
		            {display: '结束时间', name: 'endTime', align: 'left', width: 140,height:40},
		            {display: '时长(秒)', name: 'callDuration', align: 'center', width: 100},
		            {display: '呼叫状态', name: 'status', align: 'center', width: 100,render:getStatus}
		        ],
        delayLoad:false,
        parms:{workID:workID},
//        height:"55%",
        url:getPath()+'/cmct/phoneMarketDetail/listData'
    }));
	bindEvent();
});

function getStatus(data){
	return statusMap[data.status];
}

function bindEvent(){
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
	$("#clear").click(function(){
		MenuManager.menus["operatedate"].resetAll();
		$('#status').val('');
		$("#key").val($("#key").attr("dValue"));
	});
}
 
function searchData(){
	
	//录入时间
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["operatedate"]){
		startDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
		endDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(startDate != ""){
		$list_dataParam['startDate'] = startDate;
	} else {
		delete $list_dataParam['startDate'];
	}
	//查询结束时间
	if(endDate != ""){
		$list_dataParam['endDate'] = endDate;
	} else {
		delete $list_dataParam['endDate'];
	}
	
	var key = $('#key').val();
	if(key && ($('#key').attr("dValue") != key)){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
	var status=$('#status').val();
	if(status){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	resetList();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
