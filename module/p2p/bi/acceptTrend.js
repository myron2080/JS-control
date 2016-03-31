$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "期间";
	MenuManager.common.create("DateRangeMenu","createTime",params);
	MenuManager.common.create("DateRangeMonthMenu","createTime2",params);
	/**
	 * 设置默认值
	 */
	MenuManager.menus["createTime"].setValue(startDay,endDay);
	MenuManager.menus["createTime"].confirm();
	
	MenuManager.menus["createTime2"].setValue(startMonth,endMonth);
	MenuManager.menus["createTime2"].confirm();
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	searchData();
});

function changeType(){
	var type=$("#dateType").val();
	if(type == 'day'){
		$("#month_period").hide();
		$("#day_period").show();
	}else{
		$("#day_period").hide();
		$("#month_period").show();
	}
}

function searchData(){
	var startMonth = "";
	var endMonth = "";
	
	var startDay = "";
	var endDay = "";
	if(MenuManager.menus["createTime"]){//天
		startDay = MenuManager.menus["createTime"].getValue().timeStartValue;
		endDay = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	if(MenuManager.menus["createTime2"]){//月
		startMonth = MenuManager.menus["createTime2"].getValue().timeStartValue;
		endMonth = MenuManager.menus["createTime2"].getValue().timeEndValue;
	}
	var orgId=$("#orgId").val();
	if(null != orgId && orgId != ''){
		$.post(getPath()+'/bi/p2pAccpetTrend/getData',{startDay:startDay,endDay:endDay,startMonth:startMonth,
			endMonth:endMonth,dateType:$("#dateType").val(),type:$("#type").val(),orgId:orgId},function(data){
				$("#showBody").html("");
				if(null != data.showList){
					var slist=data.showList;
					var tr="";
					for(var i=0;i<slist.length;i++){
						var obj=slist[i];
						tr+="<tr>"+
						"<td>"+obj.TIME+"</td>"+
						"<td>"+obj.TOTAL+"</td>"+
						"<td>"+obj.VISIT+"</td>"+
						"<td>"+obj.INTERNET+"</td>"+
						"<td>"+obj.TEL+"</td>"+
						"</tr>";
					}
					$("#showBody").append(tr);
				}
				if(null != data.chartData){
					/**
					   * 图表数据
					   */
					  var myChart = new FusionCharts(getPath()+"/default/js/control/fusionCharts/swf/Line.swf", "myChartId", "100%", "260");  
					  
					  myChart.setXMLData(data.chartData);  
					  myChart.render("chartdiv"); 
				}
				
			},'json');
	}else{
		art.dialog.tips("请选择组织!");
	}
}