$list_addUrl = getPath() + '/ebsite/activityItem/add?activityId='+activityId;
$list_editUrl = getPath() + '/ebsite/activityItem/edit?activityId='+activityId;
$list_deleteUrl = getPath() + '/ebsite/activityItem/delete?activityId='+activityId;
$list_editWidth = "330px";
$list_editHeight = "130px";
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
			display : '活动名称',
			name : 'activity.title',
			align : 'left',
			width : 120
		}, {
			display : '商品名称',
			name : 'goods.name',
			align : 'center',
			width : 120,
			height:100
		}, {
			display : '创建时间',
			name : 'createTime',
			align : 'center',
			width : 150
		}],
		url : getPath() + ("/ebsite/activityItem/listData?activityId="+activityId)
	}));

	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

});

// 操作
function operateRender(data) {
	// 标记：启用；可以地图标点；禁用可以标记；这里判断
	var html = "";
	html+='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
	html+='| <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return html;
}

// 查询
function searchData() {
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	$list_dataParam['activityId'] = activityId;
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	searchData();
}
