$(function() {
//	alert('saleOfarkList.js...');
});
$tree_container = "leftTree";
$tree_async_url = getPath() + "/lunch/counterpoint/simpleTreeData";
$list_addUrl = getPath() + '/lunch/saleofark/add';
$list_editUrl = getPath() + '/lunch/saleofark/edit';
$list_editWidth = "500px";
$list_editHeight = "150px";
$(document).ready(function() {
	$("#main").ligerLayout({
		leftWidth : 250,
		minLeftWidth : 200,
		allowLeftCollapse : true,
		allowLeftResize : true
	});
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '操作',
			name : '',
			align : 'center',
			width : 120,
			render : operateRender
		}, {
			display : '编码',
			name : 'encode',
			align : 'center',
			width : 100
		}, {
			display : '名称',
			name : 'name',
			align : 'center',
			width : 80
		}, {
			display : '容量',
			name : 'gridCount',
			align : 'center',
			width : 80
		}, {
			display : '创建人',
			name : 'creator.name',
			align : 'center',
			width : 80
		}, {
			display : '创建时间',
			name : 'createTime',
			align : 'center',
			width : 130
		}, {
			display : '状态',
			name : 'isStartUse',
			align : 'center',
			width : 80,
			render : isStartUse
		} ],
		url : getPath() + '/lunch/saleofark/listData',
		delayLoad : true
	}));
	
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	searchData();
        }
    });
});

/**
 * 操作显示
 * 
 * @param data
 */
function operateRender(data) {
	// 标记：启用；可以地图标点；禁用可以标记；这里判断
	if (data.isStartUse == 1) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a> | <a href="javascript:setArk({id:\'' + data.id + '\'});">设置柜格</a>';
	} else if (data.isStartUse == 0) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	} else {
		// 不显示操作
		var obj = {
			fileName : 'saleOfarkList.js',
			lineNumber : '73',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}
/**
 * 设置柜格
 */
function setArk(data) {
	art.dialog.tips('设置柜格。敬请期待...');
}
/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?',function(){
			$.post(getPath() + '/lunch/saleofark/onOff',{id:data.id,isStartUse:1},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定禁用操作吗?',function(){
			$.post(getPath() + '/lunch/saleofark/onOff',{id:data.id,isStartUse:0},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
	} else {
		art.dialog.tips('参数有误，请联系管理员');
		var obj = {
			fileName : 'saleOfarkList.js',
			lineNumber : '100',
			msg : '程序开发参数传入异常，请联系ljw'
		};
		sysout(obj);
	}
}
/**
 * 状态显示
 * 
 * @param data
 * @returns {String}
 */
function isStartUse(data) {
	if (data.isStartUse == 1) {
		return '启用';
	} else if (data.isStartUse == 0) {
		return '<span style="color:red">禁用</span';
	} else {
		// 不显示状态
		var obj = {
			fileName : 'saleOfarkList.js',
			lineNumber : '121',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
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
		$list_dataParam['pid'] = treeNode.id;
		$list_dataParam['type'] = treeNode.type;
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
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['isStartUse'];
	$("#isStartUse").val('');
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