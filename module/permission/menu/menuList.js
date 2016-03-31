$list_editUrl = getPath()+"/permission/menu/edit";//编辑及查看url
$list_addUrl = getPath()+"/permission/menu/add";//新增url
$list_deleteUrl = getPath()+"/permission/menu/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "320px";
$list_dataType = "菜单";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/permission/menu/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
		});
	$("#toolBar").append(
		' <div style="display:inline;padding-top:3px; float:left;"><label id="includeContainer"><input style="border:none; float:left;" type="checkbox" name="includeChild" id="includeChild" checked="checked" /><b style="float:left;">包含下级</b></label></div>'
		+'<div style="float:left;padding-left:10px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '编码', name: 'number', align: 'left', width: 120},
            {display: '上级菜单', name: 'parent.name', align: 'left', width: 120},
            {display: '权限', name: 'permissionItem.name', align: 'left', width: 120},
            {display: '描述', name: 'description', align: 'left', width: 180},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender}
        ],
        url:getPath()+'/permission/menu/listData',
        delayLoad:true
    }));
	$('#includeContainer').bind('click',searchData);
});
function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
			+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function afterAddRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterEditRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterDeleteRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
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
	resetList();
}