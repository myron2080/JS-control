$(function() {
	console.info('lunchCityEdit js is be inject...');
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
					url : getPath() + '/lunch/dishes/encodeIsExist',
					data : {
						id : function() {
							return $("#dataId").val();
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
			description : {
				rangelength : [ 3, 20 ]
			},
			cuisineEnum : {
				required : true
			},
			dishesTypeEnum : {
				required : true
			},
			realPrice : {
				required : true,
				rangelength : [ 0, 20 ],
				isNumber:true
			},
			suggestPrice:{
				rangelength : [ 0, 20 ],
				isNumber:true
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
			description : {
				rangelength : "长度3-100之间"
			},
			cuisineEnum : {
				required : "菜系不能为空"
			},
			dishesTypeEnum : {
				required : "类型不能为空"
			},
			realPrice : {
				required : "实际售价不能为空",
				rangelength : "长度0-10之间"
			},
			suggestPrice:{
				rangelength : "长度0-10之间"
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

