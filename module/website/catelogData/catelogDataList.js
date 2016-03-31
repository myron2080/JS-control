$list_addUrl = getPath() + '/website/catelogData/add';  			//设置添加的路径
$list_editUrl = getPath() + '/website/catelogData/edit';			//设置修改的路径
$list_deleteUrl = getPath() + '/website/catelogData/delete';			//设置删除的路径
$list_editWidth = "870px";				
$list_editHeight = "545px";											//设置修改，添加，查看的框的大小
$list_dataType = "栏目数据";											//数据名称
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
	searchData();
}



/**
 *	查询
 */
function searchData() {
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var selectNodes = tree.getSelectedNodes();
	$list_dataParam['catelogId'] = selectNodes[0].id;
	if (selectNodes[0]!=null) {
		$list_dataParam['longNumber'] = selectNodes[0].longNumber;
	} else {
		delete $list_dataParam['longNumber'];
	}
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyword'] = keyWord;
	} else {
		delete $list_dataParam['keyword'];
	}
	
	$.post(getPath() + '/website/catelog/findDataType', {
		id : selectNodes[0].id,
	}, function(res) {
		if(res.catelogDataType=="SINGLE"){
			$("#data_iframe").attr("src",base+"/website/catelogData/showPage?path=catelogDataSingle&cid="+selectNodes[0].id);
		}else{
			$("#data_iframe").attr("src",base+"/website/catelogData/showPage?path=catelogDataBonus&cid="+selectNodes[0].id);
		}
	}, 'json');
	
}




