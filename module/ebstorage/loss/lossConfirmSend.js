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
	
	$("td").each(function(){
		if(typeof($(this).attr("key")) == 'undefined'){
			$(this).css({
				"background-color":"#f1f1f1"
			});
		}
	});
});

/**
 * 确认发货操作
 * @param dlg
 */
function saveEdit(dlg){
	currentDialog = dlg;
	dialogButtor(currentDialog,true);
	var jsonStr = "[";
	var flag = true;
	$(".scrollContent tr").each(function(index,doc){
		var itemId=$(doc).find("#itemId").val();
		var actSendNum=$(doc).find("#actSendNum").val();
		var replenishmentNum=$(doc).find("#replenishmentNum").val();
		if(!isNotNull(actSendNum)){
			art.dialog.tips("发货数量不能为空!");
			flag=false;
			return false;
		}
		
		if(parseInt(replenishmentNum)<parseInt(actSendNum)){
			art.dialog.tips("发货数量不能大于报损数量!");
			flag=false;
			return false;
		}
		
		jsonStr+="{";
		jsonStr+="\"id\":\""+itemId+"\",";
		jsonStr+="\"actSendNum\":\""+actSendNum+"\"";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	if(flag){
		$('#detailJson').val(jsonStr);
		$.post(base + "/ebstorage/reportedloss/confirmSend",$('form').serialize(),function(res){
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
		dialogButtor(currentDialog,false);
		return false;
	}
	return false;
}

/**
 * 按钮禁用
 * @param dlg dialog对象
 * @param flag 禁用or启用
 */
function dialogButtor(dlg,flag){
	if(dlg){
		dlg.button({name:"关闭",disabled:flag});
		dlg.button({name:"确定",disabled:flag});
	}
}