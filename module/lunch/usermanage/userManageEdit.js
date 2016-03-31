$(function() {
	// alert('saleOfarkEdit.js...');
});
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
