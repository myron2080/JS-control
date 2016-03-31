function beforesave(){
	var remark=$("textarea[name='description']").val();
	if(remark.length>300){
		art.dialog.tips("字符数量不能超过300个!");
		return false ;
	}

	if($('#password').val()!=$('#passwordT').val()){
		art.dialog.tips("两次密码不一致...");
		return false ;
	}
	
//	if(!/^[0-9]+$/.test($('#userId').val())){
//		art.dialog.tips("用户id请输入数字!");
//		return false ;
//    }
	return true ;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}

