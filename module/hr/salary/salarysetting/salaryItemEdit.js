$(function(){
	//添加事件
	$("#number").bind("blur",function(){
		if($("input[name='number']").val()!=null&&$("input[name='number']").val()!=""){
			var param ={};
			param.id=$("input[name='id']").val();
			param.number =$("input[name='number']").val();
		judgeNumber(param);}
	});
});
function judgeNumber(param){
	$.post(getPath()+"/hr/salaryItem/judgeNumber",param,function(res){
		if(res.MSG){
			$("input[name='number']").parent().addClass("l-text-invalid");
			$("input[name='number']").attr("title", res.MSG);
			$("input[name='number']").poshytip();
        }
	},"json");
}
function saveEdit(dlg){
	currentDialog = dlg;
	$.post(getPath()+"/hr/salaryItem/judgeNumber",{id:$("input[name='id']").val(),number:$("input[name='number']").val()},function(res){
		if(res.MSG){
			$("input[name='number']").parent().addClass("l-text-invalid");
			$("input[name='number']").attr("title", res.MSG);
			$("input[name='number']").poshytip();
        }else{
        	
        	$("form").submit();
        }
	},"json");
	
	return false;
}