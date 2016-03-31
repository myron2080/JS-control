$(document).ready(function(){
	params ={};
	params.inputTitle = "呼叫日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	g =  manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: 'workId', name: 'modeID', align: 'left', width: 200,height:40,render:clickDetail},
		            {display: '任务名称', name: 'name', align: 'left', width: 100,height:40},
		            {display: '日期', name: 'createTime', align: 'left', width: 100,height:40},
		            {display: '总呼叫量', name: 'bjTotalCall', align: 'center', width: 100,height:40},
		            {display: '接听成功量', name: 'jtTotalCall', align: 'left', width: 100,height:40},
		            {display: '接听成功率', name: 'jtRate', align: 'center', width: 100,render:getValue1},
		            {display: '转接成功量', name: 'zjTotalCall', align: 'left', width: 100,height:40},
		            {display: '转接成功率', name: 'zjRate', align: 'center', width: 100,render:getValue2},
		            {display: '平均时长', name: 'zjAvgdr', align: 'center', width: 100}
		        ],
        delayLoad:false,
//        height:"55%",
        url:getPath()+'/cmct/phoneMarketDetail/getAnalysisData'
    }));
	bindEvent();
});

function clickDetail(data){
	return '<a href="javascript:viewDetail({modeID:\''+data.modeID+'\'});">'+data.modeID+'</a>';
}

function viewDetail(data){
	parent.workID=data.modeID;
	parent.document.getElementById("two2").click();
}

function getValue1(data){
	return FloatMul(data.jtRate,100)+"%";
}

function getValue2(data){
	return FloatMul(data.zjRate,100)+"%";
}
function bindEvent(){
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
	$("#clear").click(function(){
		MenuManager.menus["operatedate"].resetAll();
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
	resetList();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
