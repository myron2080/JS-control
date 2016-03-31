$list_dataType = "副号" ;
$(document).ready(function(){
	
	$("#key").focus(function(){
		if($(this).val()=="使用人/主叫号码/被叫号码"){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val("使用人/主叫号码/被叫号码");
		}
	});
	
	//注册控件key的回车查询事件
	inputEnterSearch('key',searchData);
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});

	//清空
	$("#clear").click(function(){
		MenuManager.menus["operatedate"].resetAll();
		$("#key").val("使用人/主叫号码/被叫号码");
		$('#status').val('');
	});
	
	params ={};
	params.inputTitle = "创建日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);	
	var columnsParam=[ 
	                    {display: '使用者', name: 'usePerson.name', align: 'center',   width: 120},
	                    {display: '客户号码', name: 'callerNbr', align: 'center', width:120},
	                    {display: '被叫号码', name: 'calledNbr', align: 'center', width:120},
	                    {display: '呼叫时间', name: 'startTime', align: 'center', width: 150},
	                    {display: '通话时长', name: 'callDuration', align: 'center', width: 80},
		                {display: '呼叫状态', name:'', align: 'center',  width: 120,render:getStatus}
		            ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		columns: columnsParam,
        url:getPath() + '/cmct/phoneCallIn/listData'
    }));
});

function getStatus(data){
	if(data.status && data.status=='1'){
		return "转接成功";
	}else{
		return "转接失败";
	}
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
	
	var key=$("#key").val();
	if(key == '使用人/主叫号码/被叫号码'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['status'] = $('#status').val();
	resetList();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
