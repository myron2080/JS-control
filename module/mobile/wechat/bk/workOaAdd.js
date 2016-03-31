$(document).on("mobileinit", function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/weixinapi/mobile/workOa/list"+param_system;
	  });
});
function loading(){
	$.mobile.loading( 'show', {
		  text: "保存中...",
		  textVisible: true,
		  theme: "b",
		  textonly: false
		  });
}

/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	//$.mobile.changePage( "#systemMsg", { role: "dialog" } );
	$( "#popupSystemMsg" ).popup( "open" );
	setTimeout("$( '#popupSystemMsg' ).popup( 'close') ", 1000 );
}

/**
 * 客户保存
 */
function saveWorkOa(){
	if(checkSave()){
		loading();
		//给值
		var byTimeType = $("span.icon-svg25.Greenico").parent().attr('key');
		$("#byTimeType").val(byTimeType);
		
		submitForm();
	}
}

function checkSave(){
	var title=$("#showT").val();
	if(title == ''){
		msgDialog("请输入标题!");
		return false;
	}else if(title.length>30){
		msgDialog("标题不能超过30字!");
		return false;
	}
	var content=$("#content").val();
	if(content == ''){
		msgDialog("请输入内容!");
		return false;
	}else if(content.length>250){
		msgDialog("内容不能超过250字!");
		return false;
	}else{
		if(content){
			if(content.length>100){
				$('#preview').val(content.substring(0,100));
			}else{
				$('#preview').val(content);
			}
		
		}
	}
	return true;
}

function submitForm(){
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					setTimeout(function(){
						window.close();
						window.location.href = base+"/weixinapi/mobile/workOa/list"+param_system;
					},2000);
				}else{
					//关闭
					setTimeout(function(){
						window.close();
						window.location.href = base+"/weixinapi/mobile/workOa/list"+param_system;
					},2000);
				}
			}else{
				//错误信息
				msgDialog(res.MSG);
			}
	    },'json');
}

function tdClick(obj){
	var now = $("span.icon-svg25.Greenico");
	var o = $(obj);
	if($(obj).find('span').hasClass('icon-svg25')){
		return;
	}else{
		now.removeClass('icon-svg25').removeClass('Greenico').addClass('Ashico');
		$(obj).find('span').addClass('icon-svg25').addClass('Greenico').removeClass('Ashico');
		
		var start= $("#showT").attr('key');
		var end= o.text();
		
		$("#showT").val(start+"的"+ (end=='其他'? '其他总结' : end) );
		
		
	}
}	
