$(function() {
	console.info('freightEdit js is be inject...');
});
function initForm() {
	// $.metadata.setType("attr", "validate");
	var v = $("form").validate({
		rules : {
			promoteTitle : {
				required : true
			},
			minMoney : {
				required : true
			},
			maxMoney : {
				required : true
			},
			freightMoney : {
				required : true
			},
			freightState : {
				required : true
			}
		},
		messages : {
			promoteTitle : {
				required : "推广标题不能为空"
			},
			minMoney : {
				required : "最小金额不能为空"
			},
			maxMoney : {
				required : "最大金额不能为空"
			},
			freightMoney : {
				required : "免除邮费不能为空"
			},
			freightState : {
				required : "状态不能为空"
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