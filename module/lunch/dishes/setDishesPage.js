$(function() {
	// 数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '编号',
			name : 'encode',
			align : 'center',
			width : 120
		}, {
			display : '菜品名称',
			name : 'name',
			align : 'center',
			width : 150
		}, {
			display : '实际售价',
			name : 'realPrice',
			align : 'center',
			width : 80
		}, {
			display : '描述',
			name : 'description',
			align : 'center',
			width : 150
		} ],
		checkbox : true,
		url : getPath() + "/lunch/dishes/listData?dishesStatusEnum=ALREADYPUTAWAY",
		isChecked : f_isChecked
	}));

	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
});

// 选中事件
function f_isChecked(rowdata) {
	if (isSelected == 'Y') {
		if($("#selected").val().indexOf(rowdata.id)>-1){// 表示包含
			return true;
		}else{
			return false;
		}
	}
}

/**
 * 保存设置
 * 
 * @param dlg
 */
function saveSet(dlg) {
	// 获取柜点
	var cprows = [];
	$("input[name='counterPoints']").each(function(i, n) {
		cprows.push($(this).val());
	});
	if (cprows && cprows.length <= 0) {
		art.dialog.tips("没有对应的售柜。");
		return;
	}

	// 1、判断是否至少选择一行
	var rows = $list_dataGrid.getSelectedRows();
	if (rows && rows.length <= 0) {
		art.dialog.tips("请至少选择一个菜品！");
		return;
	}
	var rowIds = [];
	for ( var i = 0; i < rows.length; i++) {
		rowIds.push(rows[i].id);
	}
	// ajax提交
	$.post(getPath() + '/lunch/dishes/saveSet', {
		cpIds : cprows.join(','),
		dishesIds : rowIds.join(',')
	}, function(res) {
		art.dialog.tips(res.MSG);
		if (res.STATE == 'SUCCESS') {
			setTimeout(function() {
				art.dialog.close();
			}, 1000);
		}
	}, 'json');
	return false;
}