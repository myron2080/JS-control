$(function() {
	console.info('goodsCategoryEdit js is be inject...');
});
function initForm() {
	// $.metadata.setType("attr", "validate");
	var v = $("form").validate({
		rules : {
			number : {
				required : true,
				isRightfulString : true,
				rangelength : [ 3, 20 ],
				remote : {
					type : 'POST',
					url : getPath() + '/ebbase/goodsCategory/encodeIsExist',
					data : {
						id : function() {
							return $("#id").val();
						},
						number : function() {
							return $("#number").val();
						}
					}
				}
			},
			name : {
				required : true,
				rangelength : [ 1, 20 ]
			},
			isEnable : {
				required : true
			},
			categoryUrl : {
				rangelength : [ 0, 50 ]
			}
		},
		messages : {
			number : {
				required : "编码不能为空",
				rangelength : "长度3-20之间",
				remote : "编码已经存在"
			},
			name : {
				required : "名称不能为空",
				rangelength : "长度1-20之间"
			},
			isEnable : {
				required : "状态不能为空"
			},
			categoryUrl : {
				rangelength : "长度0-50之间"
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