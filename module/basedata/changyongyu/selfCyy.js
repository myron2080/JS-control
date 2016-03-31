$list_editUrl = getPath()+"/basedata/changyongyu/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/changyongyu/add";//新增url
$list_deleteUrl = getPath()+"/basedata/changyongyu/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "150px";
$list_dataType = "常用语";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/changyongyu/simpleTreeData";
$tree_editWidth = "200px";//界面宽度
$tree_editHeight = "100px";//界面高度
$tree_dataType = "数据类型";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:150,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:beforeAddRow,icon:'add'}]
		});
	$("#toolBar").append(
		'<div style="float:right;padding-right:10px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '描述', name: 'description', align: 'left', width: 300},
            {display: '操作', name: 'operate', align: 'center', width: 80,render:operateRender}
        ],
        height:'95%',
        url:getPath()+'/basedata/changyongyu/listData',
        delayLoad:true
    }));
});

function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a> | '+
		'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}


function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		$list_dataParam['parentId'] = treeNode.id;
	}
	searchData();
}

function beforeAddRow(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node==null || node.length==0){
		art.dialog.tips('请先在左边选择数据类型');
		return false;
	}
	addRow({});
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		return {parentId:node[0].id,objectId:$("#objectId").val()};
	}
	return {};
}

function searchData(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		$list_dataParam['parentId'] = node[0].id;
	}
	resetList();
}