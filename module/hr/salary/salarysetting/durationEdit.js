$(function(){
	//添加事件
});
function valiDate(){
var sDate = new Date($("input[name='startDate']").val().replace(/\-/g, "\/"));
var eDate = new Date($("input[name='endDate']").val().replace(/\-/g, "\/"));
if(sDate > eDate)
{
 $("input[name='endDate']").parent().addClass("l-text-invalid");
 $("input[name='endDate']").attr("title", "结束日期应大于起始日期！");
 $("input[name='endDate']").poshytip();
 return false;
}
return true;
}

function judgeDate(){
	var param ={};
	param.id=$("input[name='id']").val();
	param.startDate =$("input[name='startDate']").val();
	param.endDate =$("input[name='endDate']").val();
	$.post(getPath()+"/hr/duration/judgeDate",param,function(res){
		if(res.MSG){
			$("input[name='startDate']").parent().addClass("l-text-invalid");
			$("input[name='startDate']").attr("title", res.MSG);
			$("input[name='startDate']").poshytip();
			$("input[name='endDate']").parent().addClass("l-text-invalid");
			$("input[name='endDate']").attr("title", res.MSG);
			$("input[name='endDate']").poshytip();
        }else{
        }
	},"json");
}

function saveEdit(dlg){
	currentDialog = dlg;
	if(valiDate()){
	var param ={};
	param.id=$("input[name='id']").val();
	param.startDate =$("input[name='startDate']").val();
	param.endDate =$("input[name='endDate']").val();
	$.post(getPath()+"/hr/duration/judgeDate",param,function(res){
		if(res.MSG){
			$("input[name='startDate']").parent().addClass("l-text-invalid");
			$("input[name='startDate']").attr("title", res.MSG);
			$("input[name='startDate']").poshytip();
			$("input[name='endDate']").parent().addClass("l-text-invalid");
			$("input[name='endDate']").attr("title", res.MSG);
			$("input[name='endDate']").poshytip();
        }else{
        	 $("form").submit();
        	    return false;
        }
	},"json");}
}