$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/initialData/simpleTreeData";
$list_deleteUrl = getPath()+"/projectm/initialData/delete";//删除url
$list_addUrl = getPath()+"/projectm/initialData/add";//新增
$list_editUrl = getPath()+"/projectm/initialData/edit";//编辑及查看url
$list_dataType='模块';//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	/*$("#toolBar").ligerToolBar({
		items: toolbarary
	});*/
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
              {display: '操作', name: 'operate', align: 'center', width: 80,render:function(data,filterData){
            	  return  '<a href="javascript:editRow({id:\''+data.id+'\'});" >修改</a>|'
            	  		  +'<a href="javascript:deleteRow({id:\''+data.id+'\'});" >删除</a>';
              }},      
            {display: '代号', name: 'number', align: 'left', width: 80},
            {display: '编码', name: 'code', align: 'left', width: 80},
            {display: '模块名称', name: 'name', align: 'left', width: 120},
            {display: '数据库简码', name: 'simCode', align: 'left', width: 120},
            {display: '说明', name: 'remark', align: 'left', width: 300},
            {display: '模块类型', name: 'modulesType.label', align: 'left', width: 120}
        ],
        url:getPath()+'/projectm/initialData/getModules'
    }));
	
});


function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		return {businessType:selectNodes[0].id};
	}
	return null;
}


function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		$list_dataParam['businessType'] = selectNodes[0].id;
	}else{
		delete $list_dataParam['businessType'];
	}
	resetList();
}
function getTitle(viewstate){
	if(!$list_dataType){
		$list_dataType = "数据";
	}
	switch(viewstate){
		case 'ADD':return $list_dataType+'-新增';
		case 'VIEW':return $list_dataType+'-查看';
		case 'EDIT':return $list_dataType+'-编辑';
		default:return $list_dataType;
	}
}