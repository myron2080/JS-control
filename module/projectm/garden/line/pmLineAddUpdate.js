jQuery(document).ready(function(){
	art.dialog.data("saveLine",saveLine);
});

function saveLine(){
	if(checkValidate()){
		$.post(getPath()+"/projectm/pmLine/addUpdateLine",$("#saveLine").serialize(),function(res){
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
				art.dialog.alert(res.MSG);
			}
		});
		
	}else{
		return;
		
	}
	return "1";
}


function checkValidate(){
	if($("#areaId").val()==''){
		art.dialog.tips("所属城市不能为空！");
		return false;
	}
	if($("#name").val()==''){
		art.dialog.tips("名称不能为空！");
		return false;
	}
	
	if($("#type").val()==''){
		art.dialog.tips("类型不能为空！");
		return false;
	}
	return true;
	
}