$(document).ready(function() {
	
		//这个基本固定；
		$("#main").ligerLayout({});
		$(".system_tab li").click(function(){
			$(this).parent().find("li").removeClass("hover");
			$(this).addClass("hover");
		});
		//这里表示表格；
		$list_dataGrid = $("#tableContainer").ligerGrid(
				$.extend($list_defaultGridParam, {
					columns : [ {
						display : '售点',
						name : 'countpointName',
						align : 'center',
						width : 150
					}, {
						display : '商品',
						name : 'dishesName',
						align : 'center',
						width : 120
					}, {
						display : '份数',
						name : 'amount',
						align : 'center',
						width : 120,
						totalSummary:{
							align:'left',
							type:'sum',
							render:function(e){
								return "份数："+e.sum;
							}
						}
					}, {
						display : '总价',
						name : 'totalprice',
						align : 'center',
						width : 120,
						totalSummary:{
							align:'left',
							type:'sum',
							render:function(e){
								return "合计："+e.sum.toFixed(2);
							}
						}
					},{
						display : '10:00之前',
						name : 'one',
						align : 'center',
						width : 100
					},{
						display : '10:00-10:30',
						name : 'two',
						align : 'center',
						width : 100
					},{
						display : '10:30-11:00',
						name : 'three',
						align : 'center',
						width : 100
					},{
						display : '11:00之后',
						name : 'four',
						align : 'center',
						width : 100
					}],
					url : getPath() + "/lunch/salesreport/listData",
					pageSize:100,
					delayLoad : true
				}));
		var params ={};
		params.width = 260;
		params.inputTitle = "日期";	
		MenuManager.common.create("DateRangeMenu","effectdate",params);
		
		/*var sendParams ={};
		sendParams.width = 260;
		sendParams.inputTitle = "配送日期";	
		MenuManager.common.create("DateRangeMenu","senddate",sendParams);*/
		inits();
		searchlist();
		
});

//模糊查询
function searchlist(){	
	var keyword = $("#counterPointName").val();
	if (keyword && keyword != "售点") {
		$list_dataParam['counterPointName'] = keyword;
	} else {
		delete $list_dataParam['counterPointName'];
	}
	//按开始时间和结束时间查询
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["effectdate"]){
		startDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	delete $list_dataParam['startDate'];
	delete $list_dataParam['endDate'];
	
	
	delete $list_dataParam['startSendTime'];
	delete $list_dataParam['endSendTime'];
	var queryTimeType =$("#queryTimeType").val();
	
	//查询开始时间
	if(queryTimeType =="createTime"){
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
	}else{	
	//配送日期
	var startSendDate = "";
	var endSendDate = "";
	if(MenuManager.menus["effectdate"]){
		startSendDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endSendDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	//查询开始时间
	if(startSendDate != ""){
		$list_dataParam['startSendTime'] = startSendDate.replace(/\//g,"-");;
	} else {
		delete $list_dataParam['startSendTime'];
	}
	//查询结束时间
	if(endSendDate != ""){
		$list_dataParam['endSendTime'] = endSendDate.replace(/\//g,"-");;
	} else {
		delete $list_dataParam['endSendTime'];
	}
	}
	//根据菜品查询
	var dishesName = $("#dishesName").val();
	if (dishesName && dishesName != "菜品") {
		$list_dataParam['dishesName'] = dishesName;
	} else {
		delete $list_dataParam['dishesName'];
	}
	resetList();
}

//清空
function onEmpty(){
	 $("#counterPointName").val("售点");
	 $("#dishesName").val("菜品");
	 MenuManager.menus["effectdate"].resetAll();
	 MenuManager.menus["senddate"].resetAll();
	 delete $list_dataParam['startDate'];
	 delete $list_dataParam['endDate'];
	 delete $list_dataParam['startSendDate'];
	 delete $list_dataParam['endSendDate'];
	 delete $list_dataParam['counterPointName'];
	 delete $list_dataParam['dishesName'];
	 
	 resetList();
}

function inits(){
	var curdate = new Date();

	
	$("#effectdate").html("日期:"+formatDate(curdate,"yyyy/MM/dd")+"-"+formatDate(curdate,"yyyy/MM/dd"));
	MenuManager.menus["effectdate"].setValue(formatDate(curdate,"yyyy/MM/dd"),formatDate(curdate,"yyyy/MM/dd"));
	/*$("#senddate").html("配送日期:"+formatDate(curdate,"yyyy/MM/dd")+"-"+formatDate(curdate,"yyyy/MM/dd"));
	 MenuManager.menus["senddate"].setValue(formatDate(curdate,"yyyy/MM/dd"),formatDate(curdate,"yyyy/MM/dd"));*/
	 //MenuManager.menus["senddate"].getValue().timeStartValue
}

