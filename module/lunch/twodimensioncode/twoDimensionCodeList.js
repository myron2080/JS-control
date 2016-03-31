$list_addUrl = getPath() + '/lunch/twodimensioncode/add';
$list_editUrl = getPath() + '/lunch/twodimensioncode/edit';
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
			display : '订单号',
			name : 'order.orderNmber',
			align : 'center',
			width : 80
		}, {
			display : '售柜',
			name : 'saleOfark.name',
			align : 'center',
			width : 80
		}, {
			display : '二维码路径',
			name : 'path',
			align : 'center',
			width : 80
		}, {
			display : '归属人',
			name : 'affiliationUser.name',
			align : 'center',
			width : 120
		}, {
			display : '状态',
			name : 'twoDimensionCodeStatusEnum.name',
			align : 'center',
			width : 120
		}, {
			display : '开柜编号',
			name : 'openCabinetGridEncode',
			align : 'center',
			width : 80
		} ],
		url : getPath() + "/lunch/twodimensioncode/listData"
	}));

	// 回车事件
	$('#orderNmber').on('keyup', function(event) {
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
	return '<a href="javascript:operatorFun({id:\'' + data.id + '\'});">操作</a>';
}

function operatorFun(data) {
	art.dialog.tips('正在玩命的开发，敬请期待...');
}

// 查询
function searchData() {
	var orderNmber = $("#orderNmber").val();
	if (orderNmber && ($('#orderNmber').attr("defaultValue") != orderNmber)) {
		$list_dataParam['orderNmber'] = orderNmber;
	} else {
		delete $list_dataParam['orderNmber'];
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['orderNmber'];
	$("#orderNmber").attr("value", $("#orderNmber").attr("defaultValue"));
}
/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}