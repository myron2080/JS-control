$(document).ready(function(){
	//名字输入完之后自动带出简写
	$('#name').bind('change',function(){
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
		});
		/*toPinyin($(this).val(),function(result){
			$('#fullPinyin').val(result.full);
		});*/
	});
});

function beforesave(dlg){
	if($("#syncweixinchk").attr("checked")=='checked'){
		$("#syncweixin").val("1");
	}else{
		$("#syncweixin").val("0");
	}
	
}

function syncfun(obj){
	if($(obj).attr("checked")=='checked'){
		$("#number").attr("readonly","readonly");
	}else{
		$("#number").removeAttr("readonly");
	}
}







