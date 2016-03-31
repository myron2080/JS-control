$(function(){
})

function saveEdit(){
	var x = $("#dataForm").serialize();
	$.post(base+'/basedata/weChatConfig/ajaxSave',x,function(res){
		art.dialog({time:1,
			lock:true,
			content: res.MSG=='SUCCESS'? '保存成功': '保存失败'
		})
		setTimeout(function(){
			res.MSG == 'SUCCESS' && art.dialog.close();
		},2000);
	},'json')
}