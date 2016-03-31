function beforesave(){

	return true ;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}

$(document).ready(function(){
	$("input[name='costType']").bind('click',function(){
		$('[TAKECOST],[GIVING],[DEDUCT]').hide();
		$("["+$(this).val()+"]").show();
		$('#costTypeName').text($(this).attr("costTypeName"));
		
		if($(this).val()=='TAKECOST'){
			$('#tradMin').val('');
			$('#tradMin').attr("readonly",true);
			$('#tradMin').parent().addClass("l-text-disabled");
		}else{
			$('#tradMin').attr("readonly",false);
			$('#tradMin').parent().removeClass("l-text-disabled");
		}
	});
	$("input[name='costType']:checked").trigger('click');
	
	$('#tradAmount').bind('blur',function(){
		getAmountMin();
	});
	getRemainMin();
});

function getAmountMin(){
	if($('#userId').val()){
		$.post(getPath()+"/cmct/phoneMobile/getAmountMin",{userId:$('#userId').val(),tradAmount:$('#tradAmount').val()},function(res){
			if(res.STATE=='SUCCESS'){
				$('#tradMin').val(res.remainMin);
				$('#spanMin').text(res.remainMin);
			}
		},'json');
	}
}

function getRemainMin(){
	if($('#userId').val()){
		$.post(getPath()+"/cmct/phoneMobile/getRemainMin",{userId:$('#userId').val()},function(res){
			if(res.STATE=='SUCCESS'){
				$('#remainMin').text(res.remainMin);
			}
		},'json');
	}
}

