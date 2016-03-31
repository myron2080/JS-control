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
		          /*  {display: '总拨打数', name: '', align: 'center', width: 100,height:40},*/
		            {display: '成功通数', name: 'numberCount', align: 'center', width: 100,height:40},
		            /*{display: '失败通数', name: '', align: 'center', width: 80,height:40},*/
		           /* {display: '成功率', name: '', align: 'center', width: 80,height:40},*/
		            {display: '本地手机通数', name: 'phoneNumberCount', align: 'center', width: 80,height:40},
		            {display: '固话通数', name: 'fixNumberCount', align: 'center', width: 80,height:40},
		            {display: '长途通数', name: 'longPhoneCount', align: 'center', width: 80,height:40}
		        ],
	   delayLoad:true,
       url:getPath()+'/cmct/callAnalytical/queryByCallAnalytical'
   }));
	bindEvent();
	searchData();
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
	//	$('#orgName').val($('#fixOrgName').val());
	//	$('#orgId').val($('#fixOrgId').val());
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
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
	var sD = "";
	var eD = "";
	if(MenuManager.menus["effectdate"]){//天
		sD = MenuManager.menus["effectdate"].getValue().timeStartValue;
		eD = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	$("#startDay").val(sD);
	$("#endDay").val(eD);
	
	//[固话号码]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['infoNumber'] = keyConditions;
	}else{
		delete $list_dataParam['infoNumber'];
	}
	
	
	//var orgId=$("#orgId").val();
	$list_dataParam['dateType']=$("#dateType").val();
	$list_dataParam['showMonth']=$("#showMonth").val();
	$list_dataParam['showDay']=$("#showDay").val();
	$list_dataParam['startDay']=sD;
	$list_dataParam['endDay']=eD;
	//$list_dataParam['orgId']=$("#orgId").val();
	resetList();
}