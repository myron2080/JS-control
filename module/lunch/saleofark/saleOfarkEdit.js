$(function() {
	// alert('saleOfarkEdit.js...');
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
					url : getPath() + '/lunch/saleofark/encodeIsExist',
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
			gridCount : {
				required : true,
				range : [ 1, 100 ]
			},
			counterPointName : {
				required : true
			}

		// validate="{required:true,number:true}"
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
			gridCount : {
				required : "柜格数量不能为空",
				range : "柜格数量只能为1-100正整数"
			},
			counterPointName : {
				required : "柜点不能为空"
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
/**
 * 重写f7打开窗口事件
 * 
 * @param id
 * @param options
 */
function openDataPicker(id, options) {

	// 判断id是否是柜格。如果是。则需要先选择城市
	if (id && id == 'counterPointQuery') {
		// 获取城市的id
		var cityName = $('#lunchCityName').val();
		var cityId = $('#lunchCityId').val();
		if (cityName && cityName != '' && cityId && cityId != '') {
			// go on...
			var url = $('#' + id).attr('dataPickerUrl');
			if (url.indexOf('lunchCityId') > 0) {// 存在，则需要截取替换
				url = url.substring(0, url.indexOf('lunchCityId'))
				url = url + 'lunchCityId=' + cityId;
			} else {
				url = url + '&lunchCityId=' + cityId;
			}
			console.info(url);
			$('#' + id).attr('dataPickerUrl', url);
		} else {
			art.dialog.tips('请先选择城市！');
			return;
		}

	}
	var dataPicker = getDataPickerInstance(id, options);

	// f7选择的时候,条件不满足不弹出F7
	var flag = true;
	if (dataPicker.beforeOpenF7) {
		flag = window[dataPicker.beforeOpenF7].call();
	}
	if (dataPicker && !dataPicker.disabled && flag) {
		dataPicker.show();
	}
}

// 选择城市的onchang事件
function resetCity(oldValue, newValue, doc) {
	if (oldValue) {
		if (newValue.id == oldValue.id) {
			// no something
		} else {
			$("#counterPointId").val('');
			$("#counterPointName").val('');
		}
	}
}
