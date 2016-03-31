$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "放盘时间";
	MenuManager.common.create("DateRangeMenu","createTime",params);
	/**
	 * 设置默认值
	 */
	MenuManager.menus["createTime"].setValue(startDay,endDay);
	MenuManager.menus["createTime"].confirm();
	$("#searchBtn").bind("click",function(){
		initData();
	});
	initData();
});
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function initData(){
	var orgId=$("#orgId").val();
	if(null != orgId && orgId != ''){
		var type=$("#type").val();
		if(type == 'rent'){
			$("#atSale").html("在租");
			$("#mySale").html("我租");
			$("#heSale").html("他租");
		}else{
			$("#atSale").html("在售");
			$("#mySale").html("我售");
			$("#heSale").html("他售");
		}
		var startTime = "";
		var endTime = "";
		if(MenuManager.menus["createTime"]){//天
			startTime = MenuManager.menus["createTime"].getValue().timeStartValue;
			endTime = MenuManager.menus["createTime"].getValue().timeEndValue;
		}
		
		$.post(base+'/bi/p2pAcceptHouses/getData',{orgId:orgId,startTime:startTime,endTime:endTime,type:$("#type").val(),searchType:"search"},function(data){
			if(null != data.showList){
				$("#showBody tr").each(function(i,ob){
							$(ob).remove();
				});
				var slist=data.showList;
				var tr="";
				for(var i=0;i<slist.length;i++){
					var astr="";
					var obj=slist[i];
					if(obj.URL == 'yes'){
						astr="<a href=javascript:void(0); onclick=showLower('"+obj.ORG_ID+"','"+obj.ORG_NUMBER+"','"+obj.ORG_LONGNUMBER+"','"+obj.ORG_LEVEL+"');>"
						+"<img id='imgSrc' alt='展开' src='"+getPath()+"/default/style/images/performanceCenter/unfold.png'>"
						+"</a>";
					}
					tr+="<tr id='"+obj.ORG_NUMBER+"' keyType='close' key='"+obj.ORG_LONGNUMBER+"'>"+
					"<td ondblclick='changeChart(this);'>"+(i+1)+"</td>"+
					"<td>"+astr+"&nbsp;"+obj.ORG_NAME+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TOTAL+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.VISIT+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.INTERNET+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TEL+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.AVAIL+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.OWNERUSE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.RENTUSE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.OTHER_SALE+"</td>"+
					"</tr>";
				}
				$("#showBody").append(tr);
			}
			chartMethod(data);
		},'json');
		
	}else{
		art.dialog.tps("请选择组织!",1500);
	}
}

function chartMethod(data){
	if(null != data.leftChart){
		var charts = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","leftChart", "100%", "260");
		charts.setDataXML(data.leftChart);
		charts.render("leftChartdiv");
	}
	if(null != data.rightChart){
		var charts = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","rightChart", "100%", "260");
		charts.setDataXML(data.rightChart);
		charts.render("rightChartdiv");
	}
}

/**
 * 展开下级
 * @param orgId  展开的组织ID
 * @param number 展开的组织编码  用于该TR的ID
 * @param longNumber 展开的组织长编码 用于关闭展开的行
 * @param showMonth  显示数据 期间
 * @param obj  点击的对象 用于改变 展开 关闭 样式
 */
function showLower(orgId,number,longNumber,level){
	var startTime = "";
	var endTime = "";
	if(MenuManager.menus["createTime"]){//天
		startTime = MenuManager.menus["createTime"].getValue().timeStartValue;
		endTime = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	var nbsp="";
	if(null != level && level != ''){
		var theLen=parseInt(level,10);
		for(var i=1;i<=theLen;i++){
			nbsp+="&nbsp;";
		}
	}
	var type=$("#"+number).attr("keyType");//判断该行 是 展开 还是关闭
	if(type == 'close'){// 关闭状态  即要进行展开操作
		$("#"+number).attr("keyType","open");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/fold.png");
		$.post(base+'/bi/p2pAcceptHouses/getData',{orgId:orgId,startTime:startTime,endTime:endTime,type:$("#type").val(),searchType:"lower"},function(data){
			if(null != data.showList){
				var slist=data.showList;
				var tr="";
				for(var i=0;i<slist.length;i++){
					var astr="";
					var obj=slist[i];
					if(obj.URL == 'yes'){
						astr="<a href=javascript:void(0); onclick=showLower('"+obj.ORG_ID+"','"+obj.ORG_NUMBER+"','"+obj.ORG_LONGNUMBER+"','"+obj.ORG_LEVEL+"');>"
						+"<img id='imgSrc' alt='展开' src='"+getPath()+"/default/style/images/performanceCenter/unfold.png'>"
						+"</a>";
					}
					tr+="<tr id='"+obj.ORG_NUMBER+"' keyType='close' key='"+obj.ORG_LONGNUMBER+"'>"+
					"<td ondblclick='changeChart(this);'>"+nbsp+(i+1)+"</td>"+
					"<td>"+nbsp+astr+"&nbsp;"+obj.ORG_NAME+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TOTAL+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.VISIT+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.INTERNET+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TEL+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.AVAIL+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.OWNERUSE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.RENTUSE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.OTHER_SALE+"</td>"+
					"</tr>";
				}
				$("#"+number).after(tr);
			}
		},'json');
	}else{
		$("#"+number).attr("keyType","close");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/unfold.png");
		$("#showBody tr").each(function(i,ob){
				var key=$(ob).attr("key");
				if(key.indexOf(longNumber) != -1 && key != longNumber){
					$(ob).remove();
				}
		});
	}
}

function changeChart(obj){
	var one="";
	var two="";
	var three="";
	var four="";
	var five="";
	var six="";
	var seven="";
	$(obj).parent().find("td").each(function(i,o){
		if(i==3){
			one=$(o).html();
		}
		if(i==4){
			two=$(o).html();
		}
		if(i==5){
			three=$(o).html();
		}
		if(i==6){
			four=$(o).html();
		}
		if(i==7){
			five=$(o).html();
		}
		if(i==8){
			six=$(o).html();
		}
		if(i==9){
			seven=$(o).html();
		}
	});
    var str="售";
    if($("#type").val() == 'rent'){
    	str="租";
    }
	var result="<chart caption='来源情况' plotGradientColor='' formatNumberScale='0' formatNumber='0' thousandSeparator='0'   baseFontSize='12' >";
	result+="<set name='上门' value='"+one+"' />";
	result+="<set name='电话' value='"+two+"' />";
	result+="<set name='网络' value='"+three+"' />";
	result+="</chart>";
	
	var right="<chart caption='现状' plotGradientColor='' formatNumberScale='0' formatNumber='0' thousandSeparator='0'   baseFontSize='12' >";
	right+="<set name='在"+str+"' value='"+four+"' />";
	right+="<set name='暂停' value='"+five+"' />";
	right+="<set name='我"+str+"' value='"+six+"' />";
	right+="<set name='他"+str+"' value='"+seven+"' />";
	right+="</chart>";
	
	var charts = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","leftChart", "100%", "260");
	charts.setDataXML(result);
	charts.render("leftChartdiv");
	
	var chartTwo = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","leftChart", "100%", "260");
	chartTwo.setDataXML(right);
	chartTwo.render("rightChartdiv");
}