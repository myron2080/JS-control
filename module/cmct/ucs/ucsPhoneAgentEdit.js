$(document).ready(function(){
	var id=$('#dataId').val();
	if(id){
		//F7
		$('div[class="f7"]').each(function(){
			$(this).attr('disabled','disabled');
			$(this).find('span').each(function(){
				$(this).removeAttr('onclick');
			});
			$(this).find('strong').each(function(){
				$(this).removeAttr('onclick');
			});
		});
	}
});
function beforesave(){
	/*var creator=$('#creator').val();
	var agentName=$('#agentName').val();
	$('#key').val(hex_md5((UcsCall.enckey+creator+agentName).replace(/[ ]/g,"")));*/
	
	var ps1=$('#passwd').val();
	var ps2=$('#passwd1').val();
	if(ps1!=ps2){
		art.dialog.tips("两次密码不一致!");
		return false;
	}
	var phone=$("#telNo").val();
	var reg=/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
	if(!reg.test(phone)){
		art.dialog.tips("填写正确的手机号码!");
		return false;
	}
	return true;
};

function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}