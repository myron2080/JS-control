$(document).ready(function(){
	$('#button').bind("click",function(){
		
		var marketNumber=$('#marketNumber').val();
		var marketPassWord=$('#marketPassWord').val();
		var mobileEq = /^1[3|5|8]\d{9}$/ , phoneEq = /^0\d{2,3}-?\d{7,8}$/;
		if(!(mobileEq.test(marketNumber) || phoneEq.test(marketNumber))){
			art.dialog.tips("请填写正确的电话号码");
			return false;
		}
		
		if(!marketPassWord){
			art.dialog.tips("请填写密码...");
			return false;
		}
		
		$.post(getPath()+"/cmct/phoneMb/validationNumber?marketNumber="+marketNumber+"&marketPassWord="+marketPassWord,{},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips('关联成功...');
				setTimeout(function(){
					art.dialog.open.origin.autoWashCustomer();
					parent.artDialog.list['marketDetailDlg'].close();
				},1500);
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json');
	});
});
