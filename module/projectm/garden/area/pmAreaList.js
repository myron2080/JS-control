$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/pmArea/getTreeArea";
$list_editUrl = getPath()+"/projectm/pmArea/edit";
$list_addUrl = getPath()+"/projectm/pmArea/add";
$list_deleteUrl = getPath()+"/projectm/pmArea/delete";//删除url
$list_editWidth = "450px";
$list_editHeight = "180px";
$tree_dataType = "城市管理";//数据名称
$(document).ready(function(){
	initSimpleDataTree();
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '名称', name: 'name', align: 'left', width:160,render: showMapRender},
			{display: '编码', name: 'number', align: 'left', width: 150 },
			{display: '全拼', name: 'fullPinyin', align: 'left', width:150 },
			{display: '简拼', name: 'simplePinyin', align: 'left', width: 50},
			{display: '描述', name: 'description', align: 'left', width: 55},
			{display: '操作', name: 'clienteleagent', align: 'left', width: 150,render:operateRender}
        ],
        url:getPath()+'/projectm/pmArea/getAreaListData',
        delayLoad:true
    }));
	
	$('#searchBtn').bind('click',function(){
		searchData();
	});
	$("#configDefaultMap").click(function(){
		art.dialog.open(getPath()+'/basedata/system/initMapData', {
			title:"地图初始化状态设置",
			id : 'opernInitMap',
			width:1082,
			height:562
		});
	});
	
	
});

function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		return {parentId:node[0].parentAreaId,cityId:node[0].cityId,areaType:$('#areaType').val()};
	}
	return {};
}

function getPrentData(){
	var data={};
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		data.cityId=node[0].cityId;
		data.parentAreaId=node[0].parentAreaId;
		return data;
	}
	return false;
}

function searchData(){
	var parentData = getPrentData();
	if(!parentData){
		art.dialog.tips("请先在左边选择数据类型");
		return false;
	}
	if(parentData.parentAreaId){
		delete $list_dataParam['cityId'];
		$list_dataParam['parentId'] = parentData.parentAreaId;
	}else{
		delete $list_dataParam['parentId'];
		$list_dataParam['cityId'] = parentData.cityId;
	}
	$list_dataParam['areaType'] = $('#areaType').val();
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	return '<a href="javascript:mapMark(\''+data.id+'\');">地图标点</a> | '
	+ '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function showMapRender(data,index,cdata){
	var zoom = data.zoom;
	return data.name+"&nbsp&nbsp" + (zoom>0?"<img style='height:15px;' src='" + getPath()+"/default/style/images/marker_red.png'/>":"");
}

/**
 * *************************************
 * 地图标点
 * *************************************
 * */
function mapMark(id){
	art.dialog.data("flag",false);
	art.dialog.open(getPath()+'/projectm/pmArea/toMapMark?fid=' + encodeURIComponent(id),
	{
		lock : true,
		id : "toMapMark",
		title : "片区地图标点",
		width:1082,
		height:590,
		close:function(){
			if(art.dialog.data("flag")){
				art.dialog.tips("保存成功",null,"succeed");
				resetList();
			}
		}
	});
}