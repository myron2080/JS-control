$list_editUrl = getPath()+"/projectm/businessType/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/businessType/add";//新增url
$list_deleteUrl = getPath()+"/projectm/businessType/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "250px";
$list_dataType = "业务类型";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/businessType/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	/*$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRow,icon:'add'}
			]
		});
	$("#toolBar").append(
		'<div style="float:right;padding-right:5px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);*/
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 80},
            {display: '编码', name: 'number', align: 'left', width: 60},
            {display: '状态', name: 'enable', align: 'center', width: 50,render:booleanRender},
            {display: '描述', name: 'description', align: 'left', width: 150},
            {display: '操作', name: 'operate', align: 'center', width: 180,render:operateRender}
        ],
        url:getPath()+'/projectm/businessType/listData',
        delayLoad:true
    }));
});

function booleanRender(data){
	return data.enable?"启用":"禁用";
}

function operateRender(data,filterData){
		return '<a href="javascript:enable({id:\''+data.id+'\',enable:'+(data.enable?"false":"true")+'});">'+(data.enable?"禁用":"启用")+'</a>|'
			+'<a href="javascript:viewRow({id:\''+data.id+'\'});">查看</a>|'
			+'<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
			+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function enable(data){
	$.post(getPath()+"/projectm/businessType/enable",data,function(res){
		if(res.STATE=="SUCCESS"){
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {type:selectNodes[0].id};
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
		$list_dataParam['type'] = selectNodes[0].id;
	}else{
		delete $list_dataParam['type'];
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