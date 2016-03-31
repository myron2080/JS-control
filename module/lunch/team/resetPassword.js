$(function() {
	console.info('lunchCityEdit js is be inject...');
});
function initForm() {
	var v = $("form").validate({
		rules : {		
			password : {
				required : true,
				rangelength : [ 3, 20 ]
			},
			morePassword : {
				equalTo:"#password"
			},
		},
		messages : {
			password : {
				required : "密码不能为空",
				rangelength : "长度3-20之间"
			},
			morePassword : {
				equalTo:"两次密码输入不一致"
			},
		},
		// 调试状态，不会提交数据的
		debug : true,
		onkeyup : false,
		errorPlacement : function(lable, element) {
			if (element.is("textarea")) {
				element.addClass("l-textarea-invalid");
			} else if (element.is("input")) {
				element.parent().addClass("l-text-invalid");
			}
			$(element).attr("title", lable.html());
			$(element).poshytip();

		},
		success : function(lable) {
			var element = $("#" + lable.attr("for"));
			if (element.hasClass("l-textarea")) {
				element.removeClass("l-textarea-invalid");
			} else if (element.hasClass("l-text-field")) {
				element.parent().removeClass("l-text-invalid");
			}
			// $(element).removeAttr("title").ligerHideTip();
			$(element).poshytip("destroy");
			$(element).removeAttr("title");
		},
		submitHandler : function() {
			submitForm();
		}	
		
	});
	$("form:not(.noLiger)").ligerForm();
}