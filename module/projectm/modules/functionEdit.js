/*
 * 提交功能点页面
 */
function saveEdit(){
	var checkUrl = getPath()+"/projectm/modulesFunctionEdit/judgeFunctionName";
	$.post(checkUrl,{name:$("#name").val(),id:$("#id").val()},
		function(res){
			if(res && res.STATE == 'SUCCESS'){
					$("form").submit();
			}else{
				art.dialog.alert(res.MSG);
			}	
    	},'json');
}
