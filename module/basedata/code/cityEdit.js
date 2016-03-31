$(document).ready(function(){
	$("#name").bind("change",function(){
		var name =$(this).val();
		$('#name').val(name);
		toPinyin($(this).val(),function(result){
			$('#simpleName').val(result.simple);
			$('#fullName').val(result.full);
		});
	}); 
});

function saveCity(){
	if($('#isModelFlag').attr("checked")){
		$('#isModel').val("Y");
	}else{
		$('#isModel').val("N");
	}
	$("form").submit();
}


