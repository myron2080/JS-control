$list_editUrl = getPath()+"/basedata/weChatConfig/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/weChatConfig/add";//新增url
$list_deleteUrl = getPath()+"/basedata/weChatConfig/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "320px";
$list_dataType = "岗位";//数据名称
$tree_container = "leftTree";
//$tree_addUrl = getPath()+"/basedata/jobcategory/add";//新增
//$tree_async_url = getPath()+"/basedata/jobcategory/simpleTreeData";
//$tree_editUrl = getPath()+"/basedata/weChatConfig/edit";//编辑及查看url
//$tree_deleteUrl = getPath()+"/basedata/weChatConfig/delete";//删除url
$tree_editWidth = "548px";//界面宽度
$tree_editHeight = "184px";//界面高度
$tree_dataType = "岗位大类";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'微信配置',click:addWeChatConfig,icon:'add'}
		]
		});
//	$("#toolBar").append(
//		'<div style="float:right;padding-right:5px;display:inline;">'
//    	+'	<form onsubmit="searchData();return false;">'	
//	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
//	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
//    	+'	</form>'
//    	+'</div>'
//	);
	//initSimpleDataTree();
	
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '编码', name: 'number',align: 'left', width: 120},
            {display: '应用关联id', name: 'appId', align: 'left', width: 100},
            {display: 'url',name: 'url' , align:'left',width:100},
            {display: '操作', name: 'operate', align: 'center', width: 240,render:operateRender}
        ],
        url:getPath()+'/basedata/weChatConfig/listData'
    }));
});

function addWeChatConfig(){
	var flag=true;
	var dlg = art.dialog.open(getPath()+"/basedata/weChatConfig/edit",
			{title:"微信配置",
			lock:true,
			width:'500px',
			height:'300px',
			button:[
			{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(this);
				}
				return false;
			}},
			{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
			close:function(){
				 if(flag){
					 refresh();
				 }
			}
			}
	);
}

function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
			+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}
var jobId="";



function viewPermission(job){
	art.dialog.open(getPath()+'/permission/jobPermission/jobPermissionEdit?job='+job.id,{
		 title:"权限设置",
		 lock:true,
		 width:"1070px",
		 height:($(window).height()-200),
		 id:"jobPermissionEdit",
		 button:[{name:'确定'}]
	});
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
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(treeNode.id!='FFFF'){
			$list_dataParam['type'] = treeNode.id;
		}else{
			delete $list_dataParam["type"];
		}
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
		return {type:node[0].id};
	}
	return {};
}

function getTreeNodeParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		return {parent:node[0].id};
	}
	return {};
}

function afterAddNode(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterUpdateNode(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
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
	resetList();
}