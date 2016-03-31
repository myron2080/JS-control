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
		$.post(getPath()+'/bi/p2pCustomerTrend/getData',{startDay:startDay,endDay:endDay,startMonth:startMonth,
			endMonth:endMonth,dateType:$("#dateType").val(),type:$("#type").val(),orgId:orgId},function(data){
				$("#showBody").html("");
				if(null != data.showList){
					var slist=data.showList;
					var tr="";
					for(var i=0;i<slist.length;i++){
						var obj=slist[i];
						tr+="<tr>";
						tr+="<td>"+obj.TIME+"</td>";
						tr+="<td>"+obj.TOTALONE+"</td>";
						/**
						 * 遍历 二手房客 来源情况 表头(基础数据 非枚举)
						 */
						
	                    var tempVal=obj.tempVal;//二手房客  来源情况  暂存值
	                    var temp=tempVal.split(";");
						var head=$("#showHead tr")[1];//第二行
						$(head).find("td").each(function(){
							if($(this).attr("key") == 'sourse_td'){
								var key=$(this).attr("id");
								for(var i=0;i<temp.length;i++){
									var tem=temp[i];
									var addr=tem.split(",");
									if(key == addr[0]){
										tr+="<td>"+addr[1]+"</td>";
									}
								}
							}
						});
						tr+="<td>"+obj.TOTALTWO+"</td>";
						tr+="<td>"+obj.ONE+"</td>";
						tr+="<td>"+obj.TWO+"</td>";
						tr+="<td>"+obj.THREE+"</td>";
						tr+="<td>"+obj.FOUR+"</td>";
						tr+="<td>"+obj.FIVE+"</td>";
						tr+="<td>"+obj.SIX+"</td>";
						tr+="</tr>";
					}
					$("#showBody").append(tr);
				}
				if(null != data.chartData){
					/**
					   * 图表数据
					   */
					  var myChart = new FusionCharts(getPath()+"/default/js/control/fusionCharts/swf/MSLine.swf", "myChartId", "100%", "260");  
					  
					  myChart.setXMLData(data.chartData);  
					  myChart.render("chartdiv"); 
				}
				
			},'json');
	}else{
		art.dialog.tips("请选择组织!");
	}
}