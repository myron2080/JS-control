$(function() {
	// alert('....edit....');
});

function initForm() {
	// $.metadata.setType("attr", "validate");
	var v = $("form").validate({
		rules : {
			encode : {
				required : true,
				isRightfulString : true,
				rangelength : [ 3, 20 ],
				remote : {
					type : 'POST',
					url : getPath() + '/lunch/counterpoint/encodeIsExist',
					data : {
						id : function() {
							return $("#id").val();
						},
						encode : function() {
							return $("#encode").val();
						}
					}
				}
			},
			name : {
				required : true,
				rangelength : [ 3, 20 ]
			},
			simplePinyin : {
				required : true,
				rangelength : [ 3, 20 ]
			},
			lunchCityName : {
				required : true
			},
			description : {
				rangelength : [ 0, 100 ]
			}
		},
		messages : {
			encode : {
				required : "编码不能为空",
				rangelength : "长度3-20之间",
				remote : "编码已经存在"
			},
			name : {
				required : "名称不能为空",
				rangelength : "长度3-20之间"
			},
			simplePinyin : {
				required : "简称不能为空",
				rangelength : "长度3-20之间"
			},
			lunchCityName : {
				required : "城市不能为空"
			},
			description : {
				rangelength : "描述长度请设置在0-100之间"
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