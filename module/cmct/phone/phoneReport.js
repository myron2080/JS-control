$(document).ready(function(){
	params ={};
	params ={};
	params.width = 260;
	params.inputTitle = "发送日期";
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	/**
	 * 设置默认值
	 */
	MenuManager.menus["effectdate"].setValue(startDay,endDay);
	MenuManager.menus["effectdate"].confirm();
	$("#searchBtn").bind("click",function(){
		initData();
	});
	initData();
	$("#headerDiv").css("width",$("#tableContainer").width()-17);
});
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

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

function initData(){
	    $("#loadingDiv").show();
	    var dateType=$("#dateType").val();
		var showDay=$("#showDay").val();
		var showMonth=$("#showMonth").val();
		var startTime = "";
		var endTime = "";
		if(MenuManager.menus["effectdate"]){//天
			startTime = MenuManager.menus["effectdate"].getValue().timeStartValue;
			endTime = MenuManager.menus["effectdate"].getValue().timeEndValue;
		}
		
		$.post(base+'/cmct/phoneReport/getData',{startTime:startTime,endTime:endTime,
			dateType:dateType,showDay:showDay,showMonth:showMonth},function(data){
			if(null != data.showList){
				$("#callBody tr").each(function(i,ob){
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
					"<td>"+obj.PERSON_ONE+"</td>"+
					"<td>"+obj.PERSON_TWO+"</td>"+
					"<td>"+obj.PERSON_THREE+"</td>"+
					"<td>"+obj.PERSON_FOUR+"</td>"+
					"<td>"+obj.PERSON_FIVE+"</td>"+
					"<td>"+obj.PERSON_SIX+"</td>"+
					"<td>"+obj.PERSON_SEVEN+"</td>"+
					"<td>"+obj.PERSON_EIGHT+"</td>"+
					"</tr>";
				}
				$("#callBody").append(tr);
				$("#loadingDiv").hide();
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
	var dateType=$("#dateType").val();
	var showDay=$("#showDay").val();
	var showMonth=$("#showMonth").val();
	var startTime = "";
	var endTime = "";
	if(MenuManager.menus["effectdate"]){//天
		startTime = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endTime = MenuManager.menus["effectdate"].getValue().timeEndValue;
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
		$("#loadingDiv").show();
		$("#"+number).attr("keyType","open");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/fold.png");
		$.post(base+'/cmct/phoneReport/getData',{orgId:orgId,startTime:startTime,endTime:endTime,
			dateType:dateType,showDay:showDay,showMonth:showMonth},function(data){
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
					"<td>"+obj.PERSON_ONE+"</td>"+
					"<td>"+obj.PERSON_TWO+"</td>"+
					"<td>"+obj.PERSON_THREE+"</td>"+
					"<td>"+obj.PERSON_FOUR+"</td>"+
					"<td>"+obj.PERSON_FIVE+"</td>"+
					"<td>"+obj.PERSON_SIX+"</td>"+
					"<td>"+obj.PERSON_SEVEN+"</td>"+
					"<td>"+obj.PERSON_EIGHT+"</td>"+
					"</tr>";
				}
				$("#"+number).after(tr);
				$("#loadingDiv").hide();
			}
		},'json');
	}else{
		$("#"+number).attr("keyType","close");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/unfold.png");
		$("#callBody tr").each(function(i,ob){
				var key=$(ob).attr("key");
				if(key.indexOf(longNumber) != -1 && key != longNumber){
					$(ob).remove();
				}
		});
	}
}

/**
 * 导出Excel
 */ 
function exportPersonByCond(){
	var param = "";
    var dateType=$("#dateType").val();
	var showDay=$("#showDay").val();
	var showMonth=$("#showMonth").val();
	var startTime = "";
	var endTime = "";
	if(MenuManager.menus["effectdate"]){//天
		startTime = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endTime = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	param+="dateType="+dateType;
	param += "&showDay="+showDay;
	param += "&showMonth="+showMonth;
	param += "&startTime="+startTime;
	param += "&endTime="+endTime;
	
	var url = getPath()+"/cmct/phoneReport/exportPhoneReport?"+param;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}