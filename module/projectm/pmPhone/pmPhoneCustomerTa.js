$(document).ready(function(){
	bindEvent();
	searchData();
});

$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
});

function bindEvent(){
	changeType();
	params ={};
	params.width = 260;
	params.inputTitle = "拨打日期";
	MenuManager.common.create("DateRangeMenu","createTime",params);
	/**
	 * 设置默认值
	 */
	MenuManager.menus["createTime"].setValue(startDay,endDay);
	MenuManager.menus["createTime"].confirm();
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});

}

function changeType(){
	var type=$("#dateType").val();
	if(type == 'month'){
		$("#effectdate_single").hide();
		$("#day_single").hide();
		$("#month_single").show();
	}else if(type == 'day'){
		$("#month_single").hide();
		$("#effectdate_single").hide();
		$("#day_single").show();
	}else if(type == 'period'){
		$("#day_single").hide();
		$("#month_single").hide();
		$("#effectdate_single").show();
	}
		
}

function searchData(){
	
	var partners = $("#partners").val();	
	var showMonth = $("#showMonth").val();//月份
	var showDay=$("#showDay").val();//天
	var startDay = "";
	var endDay = "";
	if(MenuManager.menus["createTime"]){//期间
		startDay = MenuManager.menus["createTime"].getValue().timeStartValue;
		endDay = MenuManager.menus["createTime"].getValue().timeEndValue;
	}

	var flag=true;
	var dateType=$("#dateType").val();
	if(dateType=='month'){
		if(!showMonth){
			flag=false;
			art.dialog.tips('时间格式不能为空');
		}
	}else if(dateType=='period'){
		if(!startDay || !endDay){
			flag=false;
			art.dialog.tips('时间格式不能为空');
		}
	}else{
		if(!showDay){
			flag=false;
			art.dialog.tips('时间格式不能为空');
		}
	}

	if(flag){
		$('#loadingDiv').show();
		$.post(getPath()+'/projectm/pmTrendAnalytical/getCustomerData',{startDay:startDay,endDay:endDay,showMonth:showMonth,showDay:showDay,dateType:$("#dateType").val(),partners:partners},function(data){
			$("#showBody").html("");
			$('#loadingDiv').hide();
			var categories = [];
			var seriesData =[];
			if(null!=data.showList){
				var slist=data.showList;
				var tr="";
				tr+="<thead>";
				tr+="<th>客户名称</th>";
				tr+="<th>核算渠道</th>";
				tr+="<th>期间</th>";
				tr+="<th>电话总数</th>";   
				tr+="<th>呼叫量</th>";
				tr+="<th>平均数</th>";   
				tr+="</thead>";
				tr+="<tbody>";
				for(var i=0;i<slist.length;i++){
					var obj=slist[i];					
					categories.push(obj.THE_CUSTOMERNAME);
					seriesData.push(obj.THE_AVGCOUNT);
					tr+="<tr>";
					tr+="<td>"+obj.THE_CUSTOMERNAME+"</td>";
					tr+="<td>"+obj.THE_CONFIGNAME+"</td>";
					tr+="<td>"+obj.THE_DATE+"</td>";
					tr+="<td>"+obj.THE_MEMBERCOUNT+"</td>";
					tr+="<td>"+obj.THE_COUNT+"</td>";
					tr+="<td>"+obj.THE_AVGCOUNT+"</td>";
					tr+="</tr>";              
				}
				tr+="</tbody>";
				$("#showBody").append(tr);
				initCharts(categories,seriesData);
			}
			/*if(null != data.chartData){
				var myChart = new FusionCharts(getPath()+"/default/js/control/fusionCharts/swf/Column3D.swf", "myChartId", "100%", "260");  				
				myChart.setXMLData(data.chartData);  
				myChart.render("chartdiv");
			}*/
		},'json');
	}
}
function initCharts(categories,seriesData){
	$('#chartdiv').highcharts({
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: '系统呼叫统计分析'
	    },
	    xAxis: {
	        categories: categories
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: '平均呼叫量(个)'
	        }
	    },
	    plotOptions: {
	        column: {
	            pointPadding: 0.2,
	            borderWidth: 0
	        }
	    },
	    colors:[
	            '#f7a35b'
	    ],
	    series: [{
	        name: '平均呼叫量(个)',
	        data: seriesData

	    }]
	});
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