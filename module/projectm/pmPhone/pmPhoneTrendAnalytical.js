$(document).ready(function(){
	bindEvent();
	
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
	openDataPicker('getCustomer');
//	searchData();
}
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
	
	/**
	 * 客户id
	 */
	/*if($('#customerId').val()==null || $('#customerId').val()==''){
		art.dialog.tips("请先选择客户在点击查询");
		return false;
	}*/
	var customerId=$('#customerId').val();
	
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
	
	Loading.init(null,'正在查询...');
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
	$("#startDay").val(startDay);
	$("#endDay").val(endDay);
	$("#startMonth").val(startMonth);
	$("#endMonth").val(endMonth);
	
		$.post(getPath()+'/projectm/pmTrendAnalytical/getData',{startDay:startDay,endDay:endDay,startMonth:startMonth,endMonth:endMonth,dateType:$("#dateType").val(),customerId:customerId,orgId:orgId,partners:partners},function(data){
			$("#showBody").html("");
			
			if(null!=data.showList){
				var slist=data.showList;
				var tr="";
				tr+="<thead>";
	            tr+="<th>"+data.titleName+"</th>";
	            tr+="<th>成功通数</th>";
	            tr+="<th>总时长</th>";                
	            tr+="</thead>";
	            tr+="<tbody>";
				for(var i=0;i<slist.length;i++){
					var obj=slist[i];
					tr+="<tr>";
					tr+="<td>"+obj.time+"</td>";
					tr+="<td>"+obj.numberCount+"</td>";
					tr+="<td>"+obj.totalDuration+"</td>";
					tr+="</tr>";              
				}
				tr+="</tbody>";
				$("#showBody").append(tr);
			}
			if(null != data.chartData){
				var myChart = new FusionCharts(getPath()+"/default/js/control/fusionCharts/swf/Line.swf", "myChartId", "100%", "260");  
				  
				myChart.setXMLData(data.chartData);  
				myChart.render("chartdiv");
			}
			Loading.close();
		},'json');
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