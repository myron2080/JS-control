$list_addUrl = getPath() + '/ebbase/categoryAttr/add';  			//设置添加的路径
$list_editUrl = getPath() + '/ebbase/categoryAttr/edit';			//设置修改的路径
$list_setValuesUrl = getPath() + '/ebbase/categoryAttrVal/setValues';
$list_setAreasUrl = getPath() + '/ebbase/categoryAttrVal/setAreas';
$list_editWidth = "640px";				
$list_editHeight = "245px";											//设置修改，添加，查看的框的大小
$list_dataType = "类目属性";											//数据名称
$tree_container = "leftTree";										//指定树的class名
$tree_async_url = getPath()+"/ebbase/goodsCategory/simpleTreeData"; //设置取树的数据的地址

$(function() {
	//加载定位所触发的事件
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val().trim();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	
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
			display : '编码',
			name : 'number',
			align : 'center',
			width : 80
		}, {
			display : '属性名称',
			name : 'name',
			align : 'center',
			width : 80
		}, {
			display : '属性类型',
			name : 'categoryAttributeEnum.name',
			align : 'center',
			width : 80
		}, {
			display : '简拼',
			name : 'simplePinyin',
			align : 'center',
			width : 120
		}, {
			display : '序号',
			name : 'sortNum',
			align : 'center',
			width : 120
		}, {
			display : '创建人',
			name : 'createName',
			align : 'center',
			width : 80
		}, {
			display : '创建时间',
			name : 'createTime',
			align : 'center',
			width : 150
		}, {
			display : '最后更新人',
			name : 'updateName',
			align : 'center',
			width : 80
		}, {
			display : '最后更新时间',
			name : 'lastUpdateTime',
			align : 'center',
			width : 150
		}, {
			display : '状态',
			name : 'isEnable',
			align : 'center',
			width : 80,
			render : isEnable
		} ],
		url : getPath() + "/ebbase/categoryAttr/listData"
	}));

	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
	
	//加载树
	initSimpleDataTree();

})
/**
 * 选择子节点所触发的事件
 * @param event
 * @param treeId
 * @param treeNode
 */
function onTreeNodeClick(event, treeId, treeNode){
	//alert(treeNode.pid+"__"+treeNode.id+"__"+treeNode.name+"__"+treeNode.number+"__"+treeNode.longNumber+"__"+treeNode.leaf);
	//判断是否为叶子节点
	
	//$list_dataParam['goodsCategoryId'] = treeNode.id; 
	//resetList();
	
	searchData();
}
/**
 * 操作
 * 
 * @param data
 * @returns {String}
 */
function operateRender(data) {
	// 标记：启用；禁用可以编辑
	if (data.isEnable == 1) {
		if(data.categoryAttributeEnum.value == 'VALUES'){
			return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>| <a href="javascript:setValues({id:\'' + data.id + '\'});">值设置</a>';
		}else if(data.categoryAttributeEnum.value == 'AREAS'){
			return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>| <a href="javascript:setAreas({id:\'' + data.id + '\'});">区间设置</a>';
		}
		
	} else if (data.isEnable == 0) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	} 
}
/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1){
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/ebbase/categoryAttr/onOff', {
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
			$.post(getPath() + '/ebbase/categoryAttr/onOff', {
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
	
	if (selectNodes[0]!=null) {
		$list_dataParam['goodsCategoryId'] = selectNodes[0].id;
	} else {
		delete $list_dataParam['goodsCategoryId'];
	}
	
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyword'] = keyWord;
	} else {
		delete $list_dataParam['keyword'];
	}
	resetList();
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}else{
			artDialog.alert("请先选择树节点",function(){})
			return 'notValidate';
		}
		
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
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
 * 值设置
 */
function setValues(data){
	paramStr = '?dataid='+data.id;
	var flag = false;
	var dlg = art.dialog
	.open($list_setValuesUrl+paramStr,
			{
				id : "setValues",
				title : '属性值设置',
				background : '#333',
				width : 530,
				height : 450,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					resetList();
				}
			});	
}

/**
 * 区间设置
 */
function setAreas(data){
	paramStr = '?dataid='+data.id;
	var flag = false;
	var dlg = art.dialog
	.open($list_setAreasUrl+paramStr,
			{
				id : "setAreas",
				title : '区间值设置',
				background : '#333',
				width : 640,
				height : 450,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					resetList();
				}
			});
}
