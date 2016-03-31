$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "接客时间";
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


function initData(){
	var orgId=$("#orgId").val();
	if(null != orgId && orgId != ''){
		var type=$("#type").val();
		var startTime = "";
		var endTime = "";
		if(MenuManager.menus["createTime"]){//天
			startTime = MenuManager.menus["createTime"].getValue().timeStartValue;
			endTime = MenuManager.menus["createTime"].getValue().timeEndValue;
		}
		
		$.post(base+'/bi/p2pAccpetCustomer/getData',{orgId:orgId,startTime:startTime,endTime:endTime,type:$("#type").val(),searchType:"search"},function(data){
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
					"<td  ondblclick='changeChart(this);'>"+(i+1)+"</td>"+
					"<td>"+astr+"&nbsp;"+obj.ORG_NAME+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TOTAL+"</td>";
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
									tr+="<td ondblclick='changeChart(this);'>"+addr[1]+"</td>";
								}
							}
						}
					});
					tr+="<td ondblclick='changeChart(this);'>"+obj.ONE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TWO+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THREE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.FOUR+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.FIVE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.SIX+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.SEVEN+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.EIGHT+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.NINE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TEN+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.ELVEN+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.TWELVE+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THIRTEEN+"</td>"+
					"</tr>";
				}
				$("#showBody").append(tr);
			}
			chartMethod(data);
		},'json');
		
	}else{
		art.dialog.tips("请选择组织!",1.5);
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
	$.post(base+'/bi/p2pAccpetCustomer/getData',{orgId:orgId,startTime:startTime,endTime:endTime,type:$("#type").val(),searchType:"lower"},function(data){
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
				"<td ondblclick='changeChart(this);'>"+obj.TOTAL+"</td>";
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
								tr+="<td ondblclick='changeChart(this);'>"+addr[1]+"</td>";
							}
						}
					}
				});
				tr+="<td ondblclick='changeChart(this);'>"+obj.ONE+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.TWO+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THREE+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.FOUR+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.FIVE+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.SIX+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.SEVEN+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.EIGHT+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.NINE+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.TEN+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.ELVEN+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.TWELVE+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THIRTEEN+"</td>"+
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
	var eight="";
	var nine="";
	var ten="";
	var shiyi="";
	var shier="";
	
	var result="<chart caption='来源情况' plotGradientColor='' formatNumberScale='0' formatNumber='0' thousandSeparator='0'   baseFontSize='12' >";
	
	var len=0;//标示  二手房客 来源情况 表头个数
	var head=$("#showHead tr")[1];//第二行
	$(head).find("td").each(function(i,td){
		if($(this).attr("key") == 'sourse_td'){
			len++;
			$(obj).parent().find("td").each(function(j,o){
				if(j == i+3){
					result+="<set name='"+$(td).html()+"' value='"+$(o).html()+"'/>"
				}
			});
		}
	});
	$(obj).parent().find("td").each(function(i,o){
		if(i==len+7){
			one=$(o).html();
		}
		if(i==len+8){
			two=$(o).html();
		}
		if(i==len+9){
			three=$(o).html();
		}
		if(i==len+10){
			four=$(o).html();
		}
		if(i==len+11){
			five=$(o).html();
		}
		if(i==len+12){
			six=$(o).html();
		}
		if(i == len+3){
			seven=$(o).html();
		}
		if(i == len+4){
			eight=$(o).html();
		}
		if(i == len+5){
			nine=$(o).html();
		}
		if(i == len+13){
			ten=$(o).html();
		}
		if(i == len+14){
			shiyi=$(o).html();
		}
		if(i == len+15){
			shier=$(o).html();
		}
	});
	
	result+="<set name='资源客' value='"+one+"' />";
	result+="<set name='街霸客' value='"+two+"' />";
	result+="<set name='短信客' value='"+three+"' />";
	result+="<set name='网路客' value='"+four+"' />";
	result+="<set name='微信客' value='"+five+"' />";
	result+="<set name='邮件客' value='"+six+"' />";
	result+="</chart>";
	
	var right="<chart caption='现状' plotGradientColor='' formatNumberScale='0' formatNumber='0' thousandSeparator='0'   baseFontSize='12' >";
	right+="<set name='二手房意向' value='"+seven+"' />";
	right+="<set name='二手房公客' value='"+eight+"' />";
	right+="<set name='二手房成交' value='"+nine+"' />";
	right+="<set name='新房意向' value='"+ten+"' />";
	right+="<set name='新房公客' value='"+shiyi+"' />";
	right+="<set name='新房成交' value='"+shier+"' />";
	right+="</chart>";
	
	
	var charts = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","leftChart", "100%", "260");
	charts.setDataXML(result);
	charts.render("leftChartdiv");
	
	var chartTwo = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","leftChart", "100%", "260");
	chartTwo.setDataXML(right);
	chartTwo.render("rightChartdiv");
}
