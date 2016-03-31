function syncData(){
	var page=$('#page').val();
	if(!page || page==0){
		art.dialog.tips('页数不能为空或则为0');
		return false;
	}
	
	var pageSize=$('#pageSize').val();
	if(!pageSize || pageSize==0){
		art.dialog.tips('数量不能为空或则为0');
		return false;
	}
	
	$.post(getPath()+"/projectm/pmPhoneCode/syncData",{page:page,pageSize:pageSize},function(res){
		if(res.STATE=="SUCCESS"){
			art.dialog.tips(res.MSG);
			art.dialog.close();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
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

function beforesave(){
	$('#syncFlag').val(artDialog.open.origin.$list_dataParam['syncFlag']);
}