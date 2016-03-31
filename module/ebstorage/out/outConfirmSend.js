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
	$.post(base + "/ebsite/outorderfollow/confirmSend",$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			art.dialog({
				content: res.MSG,
				time:1,
				close:function(){
					art.dialog.close();
				},
				width:200
			});
		}else{
			art.dialog.tips(res.MSG);
			dialogButton(currentDialog,false);
		}
    },'json');
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

