$(document).ready(function(){
	//鼠标点击 可编辑状态
	$(".scrollContent").delegate("td[key='edit_td']","click",function(){
		$(this).find("span").hide();
		$(this).find("input[key='edit_input']").show().focus();
	}); 
	$("td[key='edit_td']").each(function(){
		$(this).attr("title","点击编辑");
	});
	$(".scrollContent").delegate("td[key='edit_td']","focusout",function(){
		var input=$(this).find("input[key='edit_input']");
		$(this).find("span").text(input.val()).show();
		input.hide();
	}); 
	
	//鼠标点击 可编辑状态
	$(".scrollContent").delegate("td[key='edit_auto']","click",function(){
		
		$(this).find("span").hide();
		$(this).find("input[key='auto_input']").show().focus();
	}); 
	$("td[key='edit_auto']").each(function(){
		$(this).attr("title","点击编辑");
	});
	
	
	$("td").each(function(){
		if(typeof($(this).attr("key")) == 'undefined'){
			$(this).css({
				"background-color":"#f1f1f1"
			});
		}
	});
});


//保存操作
function saveEdit(dlg){
	currentDialog = dlg;
	dialogButton(currentDialog,true);
	var jsonStr = "[";
	var flag = true;
	if(!isNotNull($("#personId").val())){
		art.dialog.tips('请选择收货人！',1.5);
		flag = false;
		dialogButton(currentDialog,false);
		return false;
	}
	
	$(".scrollContent tr").each(function(){
		var itemId=$(this).find("#itemId").val();
		var getCount=$(this).find("#getCount").val();
//		var faultRate=$(this).find("#faultRate").val();
		
		if(!isNotNull(getCount)){
			art.dialog.tips('请填写实收数量！',1.5);
			flag = false;
			return false;
		}
		
		jsonStr+="{";
		jsonStr+="\"id\":\""+itemId+"\",";
		jsonStr+="\"getCount\":\""+getCount+"\"";
//		jsonStr+="\"faultRate\":\""+faultRate+"\"";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	if(flag){
		$('#goodsDetailStr').val(jsonStr);
		$.post(base + "/ebsite/outorderfollow/confirmGotGoods",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	}else{
		dialogButton(currentDialog,false);
		return false;
	}
	return false;
}

/**
 * 按钮禁用
 * @param dlg dialog对象
 * @param flag 禁用or启用
 */
function dialogButton(dlg,flag){
	if(dlg){
		dlg.button({name:"取消",disabled:flag});
		dlg.button({name:"确认",disabled:flag});
	}
}

//计算损坏率 
function caclRate(obj){
	var parent=$(obj).parents("tr");
	var outCount=parseInt(parent.find("input[name='outCount']").val());//调拨数量
	var getCount = parseInt(parent.find("input[name='getCount']").val());//实收数量

	if(outCount && getCount){
		if(getCount>outCount){//实际数量大于调拨数量
			getCount=outCount;
			parent.find("input[name='getCount']").val(outCount);
			parent.find("input[name='getCount']").parents("td").find("span").text(outCount);
			parent.find("#faultRate").parents("td").find("span").text("0%");
			parent.find("#faultRate").val("0%");
		}else{//计算损坏率
			var _res=(((outCount-getCount)/outCount)*100).toFixed(2)+"%";
			parent.find("#faultRate").val(_res);
			parent.find("#faultRate").parents("td").find("span").text(_res);
		}
	}
	
	if(outCount == 0){
		parent.find("#faultRate").val("0%");
		parent.find("#faultRate").parents("td").find("span").text("0%");
	}
	
	if(outCount != 0 && getCount ==0){
		parent.find("#faultRate").val("100%");
		parent.find("#faultRate").parents("td").find("span").text("100%");
	}
}