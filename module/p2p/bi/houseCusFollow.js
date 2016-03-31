$(document).ready(function(){
	changeType();
	params ={};
	params.width = 260;
	params.inputTitle = "期间";
	MenuManager.common.create("DateRangeMenu","createTime",params);
	/**
	 * 设置默认值
	 */
	MenuManager.menus["createTime"].setValue(startDay,endDay);
	MenuManager.menus["createTime"].confirm();
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	searchData();
});


function changeType(){
	var type=$("#dateType").val();
	if(type == 'month'){
		$("#day_period").hide();
		$("#day_single").hide();
		$("#month_single").show();
	}else if(type == 'day'){
		$("#month_single").hide();
		$("#day_period").hide();
		$("#day_single").show();
	}else if(type == 'period'){
		$("#day_single").hide();
		$("#month_single").hide();
		$("#day_period").show();
	}
		
}

function selectType(obj,type){
	$("#dataType").val(type);
	$(obj).parents("ul:first").find("li a").removeClass("selected");
	$(obj).addClass("selected");
	searchData();
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
		$("#showMonth").val(year+"-"+month);
		searchData();
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
				searchData();
			}
		},'json');
	}else{
		art.dialog.tips("请选择日期!");
	}
}



function searchData(){
	var sD = "";
	var eD = "";
	if(MenuManager.menus["createTime"]){//天
		sD = MenuManager.menus["createTime"].getValue().timeStartValue;
		eD = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	$("#startDay").val(sD);
	$("#endDay").val(eD);
	var orgId=$("#orgId").val();
	if(null == orgId || orgId == ''){
		art.dialog.tips("请选择组织!");
		return;
	}
	var orgId=$("#orgId").val();
		$.post(base+'/bi/p2pHouseCusFollow/getData',{orgId:orgId,startDay:$("#startDay").val(),endDay:$("#endDay").val(),type:$("#dateType").val()
           ,showMonth:$("#showMonth").val(),showDay:$("#showDay").val()},function(data){
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
//					"<td>"+obj.ONE_ONE+"</td>"+
					"<td>"+obj.ONE_TWO+"</td>"+
					"<td>"+obj.ONE_THREE+"</td>"+
					"<td>"+obj.ONE_FOUR+"</td>"+
					"<td>"+obj.ONE_FIVE+"</td>"+
					"<td>"+obj.ONE_SIX+"</td>"+
					"<td>"+obj.ONE_SEVEN+"</td>"+
					"<td>"+obj.ONE_EIGHT+"</td>"+
					"<td>"+obj.ONE_NINE+"</td>"+
					"<td>"+obj.ONE_TEN+"</td>"+
					"<td>"+obj.ONE_ELEVEN+"</td>"+
//					"<td>"+obj.TWO_ONE+"</td>"+
//					"<td>"+obj.TWO_TWO+"</td>"+
//					"<td>"+obj.TWO_THREE+"</td>"+
//					"<td>"+obj.TWO_FOUR+"</td>"+
					"<td>"+obj.TWO_FIVE+"</td>"+
					"<td>"+obj.TWO_SIX+"</td>"+
					"<td>"+obj.TWO_SEVEN+"</td>"+
					"</tr>";
				}
				$("#showBody").append(tr);
			}
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
	var sD = "";
	var eD = "";
	if(MenuManager.menus["createTime"]){//天
		sD = MenuManager.menus["createTime"].getValue().timeStartValue;
		eD = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	$("#startDay").val(sD);
	$("#endDay").val(eD);
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
		$.post(base+'/bi/p2pHouseCusFollow/getData',{orgId:orgId,startDay:$("#startDay").val(),endDay:$("#endDay").val(),type:$("#dateType").val()
	           ,showMonth:$("#showMonth").val(),showDay:$("#showDay").val()},function(data){
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
//					"<td>"+obj.ONE_ONE+"</td>"+
					"<td>"+obj.ONE_TWO+"</td>"+
					"<td>"+obj.ONE_THREE+"</td>"+
					"<td>"+obj.ONE_FOUR+"</td>"+
					"<td>"+obj.ONE_FIVE+"</td>"+
					"<td>"+obj.ONE_SIX+"</td>"+
					"<td>"+obj.ONE_SEVEN+"</td>"+
					"<td>"+obj.ONE_EIGHT+"</td>"+
					"<td>"+obj.ONE_NINE+"</td>"+
					"<td>"+obj.ONE_TEN+"</td>"+
					"<td>"+obj.ONE_ELEVEN+"</td>"+
//					"<td>"+obj.TWO_ONE+"</td>"+
//					"<td>"+obj.TWO_TWO+"</td>"+
//					"<td>"+obj.TWO_THREE+"</td>"+
//					"<td>"+obj.TWO_FOUR+"</td>"+
					"<td>"+obj.TWO_FIVE+"</td>"+
					"<td>"+obj.TWO_SIX+"</td>"+
					"<td>"+obj.TWO_SEVEN+"</td>"+
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