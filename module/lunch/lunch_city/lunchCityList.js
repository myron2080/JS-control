$list_addUrl = getPath() + '/lunch/city/add';
$list_editUrl = getPath() + '/lunch/city/edit';
$list_editWidth = "500px";
$list_editHeight = "150px";
$(function() {
	// 数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '操作',
			name : 'operate',
			align : 'center',
			width : 130,
			render : operateRender
		}, {
			display : '编码',
			name : 'encode',
			align : 'center',
			width : 80
		}, {
			display : '地区代码',
			name : 'areaCode',
			align : 'center',
			width : 80
		}, {
			display : '简拼',
			name : 'simplePinyin',
			align : 'center',
			width : 80
		}, {
			display : '全拼',
			name : 'fullPinyin',
			align : 'center',
			width : 120
		}, {
			display : '名称',
			name : 'name',
			align : 'center',
			width : 120
		}, {
			display : '创建人',
			name : 'creator.name',
			align : 'center',
			width : 80
		}, {
			display : '创建时间',
			name : 'createTime',
			align : 'center',
			width : 150
		}, {
			display : '状态',
			name : 'isUse',
			align : 'center',
			width : 80,
			render : isUse
		} ],
		url : getPath() + "/lunch/city/listData"
	}));

	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

});
/**
 * 操作
 * 
 * @param data
 * @returns {String}
 */
function operateRender(data) {
	// 标记：启用；禁用可以编辑
	if (data.isUse == 1) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
	} else if (data.isUse == 0) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	} else {
		// 不显示操作
		var obj = {
			fileName : 'lunchCityList.js',
			lineNumber : '84',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}
/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/lunch/city/onOff', {
				id : data.id,
				isUse : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/lunch/city/onOff', {
				id : data.id,
				isUse : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else {
		art.dialog.tips('参数有误，请联系管理员');
		var obj = {
			fileName : 'lunchCityList.js',
			lineNumber : '131',
			msg : '程序开发参数传入异常，请联系ljw'
		};
		sysout(obj);
	}
}
/**
 * 状态显示方法
 * 
 * @param data
 * @returns {String}
 */
function isUse(data) {
	if (data.isUse == 1) {
		return '启用';
	} else if (data.isUse == 0) {
		return '<span style="color:red">禁用</span';
	} else {
		// 不显示状态
		var obj = {
			fileName : 'lunchCityList.js',
			lineNumber : '91',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}
// 查询
function searchData() {
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	var isUse = $("#isUse").val();
	if (isUse) {
		$list_dataParam['isUse'] = isUse;
	} else {
		delete $list_dataParam['isUse'];
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['isUse'];
	$("#isUse").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
}
/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}