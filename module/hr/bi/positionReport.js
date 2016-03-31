$(document).ready(function(){
	$("#searchBtn").bind("click",function(){
		initData();
	});
	initData();
	$("#headerDiv").css("width",$("#tableContainer").width()-17);
});


function initData(){
		$.post(base+'/hr/positionReport/getData',{searchType:"search"},function(data){
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
					"<td>"+astr+"&nbsp;"+obj.ORG_NAME+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_A+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_B+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_C+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_D+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_E+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_F+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_G+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_H+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_I+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_J+"</td>"+
					"<td ondblclick='changeChart(this);'>"+obj.THE_K+"</td>"+
					"</tr>";
				}
				$("#showBody").append(tr);
			}
			initChart();
			
		},'json');
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
	$.post(base+'/hr/positionReport/getData',{orgId:orgId,searchType:"lower"},function(data){
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
				"<td>"+nbsp+astr+"&nbsp;"+obj.ORG_NAME+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_A+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_B+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_C+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_D+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_E+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_F+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_G+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_H+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_I+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_J+"</td>"+
				"<td ondblclick='changeChart(this);'>"+obj.THE_K+"</td>"+
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



/**
 * 第一次加载 图表 默认第一行
 */
function initChart(){
	var trs=$("#showBody tr");
	changeChart(trs[0]);
}

function changeChart(obj){
	var a="";
	var b="";
	var c="";
	var d="";
	var e="";
	var f="";
	var g="";
	var h="";
	var i="";
	var j="";
	var k="";
	$(obj).parent().find("td").each(function(i,o){
		if(i==1){
			a=$(o).html();
		}
		if(i==2){
			b=$(o).html();
		}
		if(i==3){
			c=$(o).html();
		}
		if(i==4){
			d=$(o).html();
		}
		if(i==5){
			e=$(o).html();
		}
		if(i==6){
			f=$(o).html();
		}
		if(i==7){
			g=$(o).html();
		}
		if(i==8){
			h=$(o).html();
		}
		if(i==9){
			i=$(o).html();
		}
		if(i==10){
			j=$(o).html();
		}
		if(i==11){
			k=$(o).html();
		}
	});
	
	var left="<chart caption='在职信息' plotGradientColor='' forceDecimals='0'  decimals='2' formatNumberScale='0' formatNumber='0' thousandSeparator='0'   baseFontSize='12' >";
//	left+="<set name='在职人数' value='"+a+"' />";
	left+="<set name='试用期人数' value='"+b+"' />";
	left+="<set name='正式员工' value='"+c+"' />";
	left+="</chart>";
	
	var result="<chart caption='工龄分析' plotGradientColor='' formatNumberScale='0' formatNumber='0' thousandSeparator='0'   baseFontSize='12' >";
	result+="<set name='一年以内' value='"+d+"' />";
	result+="<set name='1-2年' value='"+e+"' />";
	result+="<set name='2-3年' value='"+f+"' />";
	result+="<set name='3年以上' value='"+g+"' />";
	result+="</chart>";
	
	var right="<chart caption='学历分析' plotGradientColor='' formatNumberScale='0' formatNumber='0' thousandSeparator='0'   baseFontSize='12' >";
	right+="<set name='高中及以下' value='"+h+"' />";
	right+="<set name='专科' value='"+i+"' />";
	right+="<set name='本科' value='"+j+"' />";
	right+="<set name='硕士及以上' value='"+k+"' />";
	right+="</chart>";
	
	
	var charts = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","leftChart", "100%", "260");
	charts.setDataXML(left);
	charts.render("leftChartdiv");
	
	var charts = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","middleChart", "100%", "260");
	charts.setDataXML(right);
	charts.render("middleChartdiv");
	
	var chartTwo = new FusionCharts(base+"/default/js/control/fusionCharts/swf/Pie3D.swf","rightChart", "100%", "260");
	chartTwo.setDataXML(result);
	chartTwo.render("rightChartdiv");
}
