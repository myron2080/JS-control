$(function() {
});
$tree_container = "leftTree";
$tree_async_url = getPath() + "/ebstorage/storage/simpleTreeData";
$list_addUrl = getPath() + '/storage/storagespace/add';
$list_editUrl = getPath() + '/storage/storagespace/edit';
$list_editWidth = "500px";
$list_editHeight = "200px";
$(document).ready(
		function() {
			$("#main").ligerLayout({
				leftWidth : 250,
				minLeftWidth : 200,
				allowLeftCollapse : true,
				allowLeftResize : true
			});
			initSimpleDataTree();
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [ {
							display : '操作',
							name : '',
							align : 'center',
							width : 120,
							render : operateRender
						}, {
							display : '编码',
							name : 'number',
							align : 'center',
							width : 100
						}, {
							display : '简拼',
							name : 'simplePinyin',
							align : 'center',
							width : 80
						}, {
							display : '名称',
							name : 'name',
							align : 'center',
							width : 80
						}, {
							display : '仓库',
							name : 'storage.name',
							align : 'center',
							width : 80
						}, {
							display : '父仓位',
							name : 'parentStorage.name',
							align : 'center',
							width : 130
						}, {
							display : '长度',
							name : 'len',
							align : 'center',
							width : 80
						}, {
							display : '宽度',
							name : 'width',
							align : 'center',
							width : 80
						}, {
							display : '高度',
							name : 'height',
							align : 'center',
							width : 80
						}, {
							display : '类目',
							name : 'goodsCategory.name',
							align : 'center',
							width : 80
						} ],
						url : getPath() + '/storage/storagespace/listData',
						delayLoad : true
					}));

			// 回车事件
			$('#keyWord').on('keyup', function(event) {
				if (event.keyCode == "13") {
					searchData();
				}
			});
			
			//查询
//			searchData();
		});

/**
 * 操作显示
 * 
 * @param data
 */
function operateRender(data) {
	// 标记：启用；可以地图标点；禁用可以标记；这里判断
	if (data.isUse == 1) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',isUse:\'0\'});">禁用</a>';
	} else if (data.isUse == 0) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',isUse:\'1\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	} else {
		console.info('数据出错...');
	}
}
/**
 * 启用禁用；isUse：1表示启用；isUse:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.isUse == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/storage/storagespace/onOff', {
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
	} else if (data.isUse == 0) {
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/storage/storagespace/onOff', {
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
		console.info('参数有误...');
	}
}

/**
 * 点击左边树形节点响应事件
 * 
 * @param event
 * @param treeId
 * @param treeNode
 */
function onTreeNodeClick(event, treeId, treeNode) {
	$('#keyWord').val($('#keyWord').attr('defaultValue'));// 清空查询条件
	$("#isStartUse").val('');// 清空查询条件
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if (node != null && node.length > 0) {
		$list_dataParam['longNumber'] = treeNode.longNumber;
	}
	searchData();
}
/**
 * 右边数据列表查询
 */
function searchData() {
	var keyWord = $('#keyWord').val();
	keyWord = keyWord.replace(/^\s+|\s+$/g, '');
	$('#keyWord').val(keyWord);
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	var isStartUse = $("#isStartUse").val();
	if (isStartUse) {
		$list_dataParam['isStartUse'] = isStartUse;
	} else {
		delete $list_dataParam['isStartUse'];
	}
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if (node != null && node.length > 0) {
		$list_dataParam['longNumber'] = node[0].longNumber;
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['isStartUse'];
	$("#isStartUse").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	searchData();
}
/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber
			+ '---->msg:' + obj.msg);
}