$(function() {

});
/**
 * 响应input的onblur事件
 * @param obj
 */
function checkName(obj) {
	// 判断
	var newName = $.trim($('input[name=tomcatName]').val());
	if (newName == '') {// 如果为空，不向后台发送请求
		return;
	} else {
		// 发送请求验证
		var id = $("input[name=id]").val();
		$.post(base + '/basedata/monitor/isReName', {
			id : id,
			newName : newName
		}, function(data) {
			if (data.STATE == 'FAIl') {// 不成功
				$(obj).parent().addClass("l-text-invalid");
				$(obj).attr("title", data.MSG);
				$(obj).poshytip();
			}else{
				$(obj).parent().removeClass("l-text-invalid");
				$(obj).removeAttr("title");
				$(obj).poshytip("destroy");
			}
		}, 'json');
	}
}
//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(typeof(beforesave) == "function"){
		beforesave(dlg);
	}
	currentDialog = dlg;
	$('form').submit();
	return false;
}