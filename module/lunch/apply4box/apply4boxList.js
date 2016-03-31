$list_editUrl = getPath() + '/lunch/apply4box/edit';
$list_deleteUrl = getPath() + '/lunch/apply4box/delete';
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
			display : '用户',
			name : 'applyUser.name',
			align : 'center',
			width : 120
		}, {
			display : '申请时间',
			name : 'applyDate',
			align : 'center',
			width : 150
		}, {
			display : '售柜',
			name : 'saleofark.name',
			align : 'center',
			width : 80
		}, {
			display : '状态',
			name : 'state',
			align : 'center',
			width : 150,
			render : showName
		}, {
			display : '描述',
			name : 'remark',
			align : 'center',
			width : 80
		} ],
		url : getPath() + "/lunch/apply4box/listData"
	}));

	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

});

/**
 * 显示状态
 * 
 * @param data
 */
function showName(data) {
	// state
	if (data.state == 'applyEorr') {
		return '<span style="color:red">申请失败</span>';
	} else if (data.state == '') {
		return '申请成功';
	} else {
		// no show .is error数据
	}
}

// 操作
function operateRender(data) {

	if (data.state == 'applyEorr') {
		// 手动开柜操作
		return '<a href="javascript:openCabinet({id:\'' + data.id + '\'});">开柜</a>';
	}

}
/**
 * 开柜操作
 * 
 * @param data
 */
function openCabinet(data) {
	art.dialog.tips('敬请开放...');
}

// 查询
function searchData() {
	var applyUserId = $("#applyUserId").val();
	if (applyUserId) {
		$list_dataParam['applyUserId'] = applyUserId;
	} else {
		delete $list_dataParam['applyUserId'];
	}

	var applyDate = $("#applyDate").val();
	if (applyDate) {
		$list_dataParam['applyDate'] = applyDate;
	} else {
		delete $list_dataParam['applyDate'];
	}

	var state = $("#state").val();
	if (state) {
		$list_dataParam['state'] = state;
	} else {
		delete $list_dataParam['state'];
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['applyUserId'];
	delete $list_dataParam['applyUserName'];
	delete $list_dataParam['applyDate'];
	delete $list_dataParam['state'];
	$("#applyUserId").val('');
	$("#applyUserName").val('');
	$("#applyDate").val('');
	$("#state").val('');
}
/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}