
function createEditData(){
	 submitForm();
}
/**
 * 限制输入数字
 * @param obj
 */
function checkNaN(obj){
	var val=$(obj).val();
	if(isNaN(val)){
		$(obj).val('');
	}
}

function submitForm(){
	$.ajax({
		url:$('form').attr('action'),
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