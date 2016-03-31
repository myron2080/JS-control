$list_addUrl = getPath() + '/website/catelog/add';  			//设置添加的路径
$list_editUrl = getPath() + '/website/catelog/edit';			//设置修改的路径
$list_deleteUrl = getPath() + '/website/catelog/delete';			//设置删除的路径
$list_editWidth = "770px";				
$list_editHeight = "345px";											//设置修改，添加，查看的框的大小
$list_dataType = "页签栏目";											//数据名称
$tree_container = "leftTree";										//指定树的class名
$tree_async_url = getPath()+"/website/catelog/simpleTreeData"; //设置取树的数据的地址

$(function() {
	//加载定位所触发的事件
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			searchData();
			},icon:'locate'}
		]
	});
	//加载树
	initSimpleDataTree();
	// 数据列表
	//$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '操作',
			name : 'operate',
			align : 'center',
			width : 130,
			render : operateRender
		}, {
			display : '中文名称',
			name : 'name',
			align : 'center',
			width : 120
		}, {
			display : '页签编码',
			name : 'number',
			align : 'center',
			width : 100
		}, {
			display : '所属页签',
			name : 'pageTab.name',
			align : 'center',
			width : 200
		},{
			display : '长编码',
			name : 'longNumber',
			align : 'center',
			width : 80
		}, {
			display : '父节点',
			name : 'parent.name',
			align : 'center',
			width : 90
		}, {
			display : '序号',
			name : 'sort',
			align : 'center',
			width : 150
		}, {
			display : '数据类型',
			name : 'catelogDataTypeName',
			align : 'center',
			width : 90
		}, {
			display : '动态列',
			name : 'lastUpdateTime',
			align : 'center',
			width : 150,
			render:function (data){
				return "<a style=\"color:blue\" href=\"javascript:editRow({id:'"+(data.id)+"'})\">设置</a>"
			}
		}],
		url : getPath() + "/website/catelog/listData"
	}));
	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

})
function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}
//		else{
//			artDialog.alert("请先选择树节点",function(){})
//			return 'notValidate';
//		}
		
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}
/**
 * 选择子节点所触发的事件
 * @param event
 * @param treeId
 * @param treeNode
 */
function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
/**
 * 操作
 * 
 * @param data
 * @returns {String}
 */
function operateRender(data) {

	var res = "<a style=\"color:blue\" href=\"javascript:editRow({id:'"+ data.id + "'})\">编辑</a>"
		         +" | <a style=\"color:red\" href=\"javascript:deleteRow({id:'"+ data.id +"'})\">删除 </a> |" ;
	if (data.isEnable == 1) {
		res = res+'<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
	} else if (data.isEnable == 0) {
		res = res+'<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a>';
	} 
	return res;
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
			$.post(getPath() + '/website/catelog/onOff', {
				id : data.id,
				isEnable : 1
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
			$.post(getPath() + '/website/catelog/onOff', {
				id : data.id,
				isEnable : 0
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
	} 

}
/**
 * 状态显示方法
 * 
 * @param data
 * @returns {String}
 */
function isEnable(data) {
	if (data.isEnable == 1) {
		return '启用';
	} else if (data.isEnable == 0) {
		return '<span style="color:red">禁用</span>';
	} 
}

/**
 *	查询
 */
function searchData() {
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
			delete $list_dataParam['id'];
			$list_dataParam['longNumber'] = selectNodes[0].longNumber;
		}else{
			$list_dataParam['id'] = selectNodes[0].id;
			delete $list_dataParam['longNumber'];
		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['longNumber'];
	}
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyword'] = keyWord;
		delete $list_dataParam['longNumber'];
	} else {
		delete $list_dataParam['keyword'];
	}
	resetList();
}

/**
 * 清空
 */
function onEmpty() {
	delete $list_dataParam['keyword'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	resetList();
}

/**
 * 添加之后调用的方法
 */
function afterAddRow(){
	//加载树
	initSimpleDataTree();
}
/**
 * 修改之后调用的方法
 */
function afterEditRow(){
	//加载树
	initSimpleDataTree();
}

function afterDeleteRow(){
	initSimpleDataTree();
}



