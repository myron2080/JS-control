$(function() {
	$(".Submit").click(function(){
		var phone = $.trim($("#phone").val());
		var checkCode = $.trim($("#checkCode").val());
		var newPass = $.trim($("#newPass").val());
		if (checkValidate()) {// 验证通过返回到移动端
			$.post(base + '/app_web/user/updatePass/' + phone + '/' + checkCode
					+ '/' + newPass, {}, function(res) {
				if (res.STATE&&res.STATE=='SUCCESS') {
					// 成功；跳转
					showwarndiv(res.MSG, 1000);
					setInterval(function(){
						if (browser.versions.ios || browser.versions.iPhone
								|| browser.versions.iPad) {
//				 			window.location = "wapdown.action?type=ios";
							window.location.href = 'iOS://dismiss';
						} else {
//				 			window.location = "wapdown.action?type=android";
							window.mid.clickOnAndroid();
						}
					},1000);//延时
				} else {
					// 失败
					showwarndiv(res.MSG, 1000);
				}
			}, 'json');
		}
	});
});

function checkValidate() {

	if (!isNotNull($.trim($("#phone").val()))) {
		showwarndiv("手机号不能为空！", 1000);
		$("#phone").select();
		return false;
	}
	if (!isNotNull($.trim($("#checkCode").val()))) {
		showwarndiv("验证码不能空！", 1000);
		$("#checkCode").select();
		return false;
	}
	if (!isNotNull($.trim($("#newPass").val()))) {
		art.dialog.tips("密码不能为空!");
		$("#newPass").select();
		return false;
	}
	return true;

}
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
// 获取验证码
function getCheckCode(){
	curCount = count;
	var phone = $.trim($("#phone").val());
	// 判断是否输入合法的手机号
	if(!isMobil(phone)||!isNotNull(phone)){
		showwarndiv("请输入合法手机号", 1000);
		$("#phone").select();
	}else{
		// 进入方法，禁用点击事件
		$("#freeanBtn").addClass("now");
		// 禁用button按钮
		$("#freeanBtn").removeAttr('onclick');// 禁用
		InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
		$.post(base + '/app_web/user/getCheckCode/' + phone,{},function(res){
			if(res.STATE=='FAIL'){
				showwarndiv("获取验证码失败，请联系管理员！", 1000);
			}
		},'json');
	}
}
// timer处理函数
function SetRemainTime() {
	if (curCount == 0) {                
		window.clearInterval(InterValObj);// 停止计时器
		$("#freeanBtn").attr("onclick","getCheckCode();");// 启用按钮
		$("#freeanBtn").html("重新获取");
		$("#freeanBtn").removeClass("now");
	}else {
	    curCount--;
	    $("#freeanBtn").html("剩余" + curCount + "秒");
	}
}

// 手机验证
function isMobil(phone) {
	var reg=/^((13[0-9])|(15[^4,\D])|(18[0-9]))\d{8}$/;
	if (!reg.exec(phone)) {
		return false;
	}
	return true;
}