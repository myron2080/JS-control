$(document).ready(function(){
	$(".tabDate").delegate("td","click",function(){
		if($(this).find("input[name='dataType']").val() == 'normal'){
			$(this).toggleClass("colorSelected");
		}
	});
	
	$(".holidayList-ul li").hover(function(){
		if($(this).attr("key") != 'NONE'){
			$(this).css({
				background:"#41BD82",
				color:"#fff"
			});
		}
	    },function(){
			$(this).css({
				background:"",
				color:""
			});
	    });
	
	$(".btnSetting a:eq(0)").click(function(){
		//按年初始节假日
		initDataByYear();
	});
	$(".btnSetting a:eq(1)").click(function(){
		//设置工作日
		setWorkDay();
	});
	$(".btnSetting a:eq(2)").click(function(){
		//设置假日
		$(".holidayList-ul").slideToggle();
	});
	
	$(".holidayList-ul").delegate("li","click",function(){
		if($(this).attr("key") != 'NONE'){
			selectHolidayLi(this);
		}
	});
});

function selectHolidayLi(obj){
	$(".holidayList-ul li").each(function(){
		$(this).removeClass("select");
	});
	$(obj).addClass("select");
}

//设置假日
function makeSureSetHoliday(){
	if($(".holidayList-ul").find(".select").length == 0){
		art.dialog.tips("请先选中节假日",1.5);
		return;
	}
	var holidayType=$(".holidayList-ul").find(".select").attr("key");
	if($(".tabDate").find(".colorSelected").length == 0){
		art.dialog.tips("请先选中数据",1.5);
		return;
	}
	var ids=getSelectTds();
	$.post(base+'/lunch/holiday/setHoliday',{type:holidayType,ids:ids},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips("操作成功",1.5);
			setTimeout(function(){
				refreshForm();
			},1500);
		}else{
			art.dialog.tips(res.MSG,1.5);
		}
	},'json');
}
/**
 * 刷新页面
 */ 
function refreshForm(){
	 $("form").submit();
 }

//设置工作日
function setWorkDay(){
	if($(".tabDate").find(".colorSelected").length == 0){
		art.dialog.tips("请先选中数据",1.5);
		return;
	}
	var ids=getSelectTds();
	$.post(base+'/lunch/holiday/setWorkDay',{ids:ids},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips("设置工作日成功",1.5);
			setTimeout(function(){
				refreshForm();
			},1500);
		}else{
			art.dialog.tips(res.MSG,1.5);
		}
	},'json');
}

//获取选中数据ID
function getSelectTds(){
	var ids="";
	$(".tabDate").find(".colorSelected").each(function(){
		ids+=$(this).find("input[name='dataId']").val()+",";
	});
	return ids;
}

//按年初始节假日
function initDataByYear(){
	$.post(base+'/lunch/holiday/initDataByYear',{year:$("#year").val()},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips("初始化节假日成功",1.5);
		}else{
			art.dialog.tips(res.MSG,1.5);
		}
	},'json');
}