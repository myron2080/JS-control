var base = "${base}";
	$(document).ready(function(){
		
	});
	
	
	function saveEdit(dlg){
		currentDialog=dlg;
		var url=getPath()+"/projectm/initialData/updateModules";
		if(check()){
			$.ajax({
				url:url,
				dataType: "json",
				type:"POST",
				data: $('form').serialize(),
				success: function(res) {
					if(res.STATE == "SUCCESS"){
						art.dialog.data("flag",true);
						if(res.MSG){
							art.dialog({
								icon: 'succeed',
							    time: 1,
							    content: res.MSG
							});
							setTimeout(function(){art.dialog.close();},1000);				
						}else{
							art.dialog.close();
						}
					}else{
						art.dialog.alert(res.MSG);
					}
				}
			});
		}
	return false;
	}
	
function saveAdd(dlg){
		currentDialog=dlg;
		var addurl=getPath()+"/projectm/initialData/addModules";
		if(check()){
			$.ajax({
				url:addurl,
				dataType: "json",
				type:"POST",
				data: $('form').serialize(),
				success: function(res) {
					if(res.STATE == "SUCCESS"){
						art.dialog.data("flag",true);
						if(res.MSG){
							art.dialog({
								icon: 'succeed',
							    time: 1,
							    content: res.MSG
							});
							setTimeout(function(){art.dialog.close();},1000);				
						}else{
							art.dialog.close();
						}
					}else{
						art.dialog.alert(res.MSG);
					}
				}
			});
		}
	return false;
	}

	function check() {
		if($("#number").val()==''){
			art.dialog.alert('代号不能为空！');
			return false;
		}
		if($("#code").val()==''){
			art.dialog.alert('编码不能为空！');
			return false;
		}
		if($("#simCode").val()==''){
			art.dialog.alert('数据库简码不能为空！');
			return false;
		}
		if($("#name").val()==''){
			art.dialog.alert('模块名称不能为空！');
			return false;
		}
		
	    return true;
	}