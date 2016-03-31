$(function() {
	console.info('lunchCityEdit js is be inject...');
});
function initForm() {
	// $.metadata.setType("attr", "validate");
	var v = $("form").validate({
		rules : {
			account : {
				required : true,
				isRightfulString : true,
				rangelength : [ 3, 22 ],
				remote : {
					type : 'POST',
					url : getPath() + '/lunch/team/encodeIsExist',
					data : {
						id : function() {
							return $("#id").val();
						},
						account : function() {
							return $("#account").val();
						}
					}
				}
			},
			password : {
				required : true,
				rangelength : [ 3, 20 ]
			},
			teamName : {
				required : true,
				rangelength : [ 1, 20 ]
			},
			contactPerson : {
				required : true,
				rangelength : [ 2, 20 ]
			},
			telephone : {
				required : true,
				rangelength : [ 3, 20 ]
			},
			address : {
				required : true
			},
			description :{
				required : false
			}
		},
		messages : {
			account : {
				required : "账户名不能为空",
				rangelength : "长度3-20之间",
				remote : "账户名已经存在"
			},
			password : {
				required : "密码不能为空",
				rangelength : "长度3-20之间"
			},
			teamName : {
				required : "团体名称不能为空",
				rangelength : "长度1-20之间"
			},
			contactPerson : {
				required : "联系人不能为空",
			    rangelength : "长度2-20之间"
			},
			telephone : {
				required : "联系电话不能为空",
				rangelength : "长度3-20之间"
			},
			address : {
				required : "地址不能为空"
			},
			description : {
				required : ""
			}
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