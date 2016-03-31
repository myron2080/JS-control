$(function(){
	console.info('helloworld');
});

//保存编辑数据
function saveEdit(dlg){
	currentDialog = dlg;
	var backType=$('#backType').val();
	if(backType==''){
		art.dialog.tips('请选择退单类型');
		return ;
	}
	var desc=$('#desc').val();
	if(desc==''){
		art.dialog.tips('请填写备注');
		return ;
	}
	$.post(base+'/ebsite/order/comfirmApplayBB/'+$('#dataId').val(),{
		backType:backType,
		desc:desc
	},function(res){
		if(res.STATE == "SUCCESS"){
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
	},'json');
	return false;
}
