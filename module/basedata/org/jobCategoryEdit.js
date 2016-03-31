$(function(){
	//添加事件
	$('span[name="isSystem"]').bind("click",function(){
		var checkboxComp = $(this).prev("input");
		var key = checkboxComp.attr("key");
		checkboxComp.attr("checked",!checkboxComp.is(":checked"));
		changeIsSystem(key);
	});
	
	$(":checkbox").bind("click",function(){
	       	$("#"+$(this).attr("key")).val($(this).is(":checked"));
	       	changeIsSystem($(this).attr("key"));
	});
	
	$("#number").bind("blur",function(){
		var param ={};
		param.id=$("input[name='id']").val();
		param.number =$("input[name='number']").val();
		judgeNumber(param);
	});
});

function changeIsSystem(key){
	 if($(":checkbox").attr("checked"))
   {
    $("#"+key).attr("value","YES");
    }else{
   	 $("#"+key).attr("value","NO");}
}

function judgeNumber(param){
	$.post(getPath()+"/basedata/jobcategory/judgeNumber",param,function(res){
		if(res.MSG){
			$("input[name='number']").parent().addClass("l-text-invalid");
			$("input[name='number']").attr("title", res.MSG);
			$("input[name='number']").poshytip();
        }
	},"json");
}

function judgeRemark(){

	if($("#remark").val()!=null&&$("#remark").val()!=""){
		if($("#remark").val().length>150){
			 art.dialog.tips("字数不能超过150！");
			return false;
		}else{
				return true;
			}
	}else {
		return true;
	}

}


function saveEdit(dlg){
	currentDialog = dlg;
	$.post(getPath()+"/basedata/jobcategory/judgeNumber",{id:$("input[name='id']").val(),number:$("input[name='number']").val()},function(res){
		if(res.MSG){
			$("input[name='number']").parent().addClass("l-text-invalid");
			$("input[name='number']").attr("title", res.MSG);
			$("input[name='number']").poshytip();
        }else if(judgeRemark()){
        	$("form").submit();
        }
	},"json");
	return false;
}