$list_editUrl = getPath()+"/basedata/cusresource/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/cusresource/add";//新增url
$list_deleteUrl = getPath()+"/basedata/cusresource/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "270px";
$list_dataType = "客户来源";//数据名称
$tree_container = "leftTree";
$tree_addUrl = getPath()+"/basedata/cusresource/add";//新增
$tree_async_url = getPath()+"/basedata/cusresource/simpleTreeData";
$tree_editUrl = getPath()+"/basedata/cusresource/edit";//编辑及查看url
$tree_deleteUrl = getPath()+"/basedata/cusresourceType/delete";//删除url
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "250px";//界面高度
$tree_dataType = "客户来源类型";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});

	$/*("#toolBar").append(
		'<div style="float:left;padding-left:5px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
    	+'	</form>'
    	+'</div>'
	);
	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:beforeAddRow,icon:'add'}]
		});*/
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addNode,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
		});
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '类型', name: 'parent.name', align: 'left', width: 120},
            {display: '名称', name: 'name', align: 'left', width: 100},
            {display: '编码', name: 'number', align: 'left', width: 100},
            {display: '状态', name: 'enable', align: 'center', width: 40,render:booleanRender},
            {display: '简拼', name: 'simplePinyin', align: 'left', width: 80},
            {display: '描述', name: 'description', align: 'left', width: 180},
            {display: '操作', name: 'operate', align: 'center', width: 190,render:operateRender}
        ],
        height:'95%',
        url:getPath()+'/basedata/cusresource/listData'
    }));
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function booleanRender(data){
	return data.enable?"启用":"禁用";
}

function operateRender(data,filterData){
		return '<a href="javascript:enable({id:\''+data.id+'\',enable:'+(data.enable?false:true)+'});">'+(data.enable?'禁用':'启用')+'</a>|' 
//			+'<a href="javascript:viewRow({id:\''+data.id+'\'});">查看</a>|'
			+'<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
			//+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function enable(data){
	$.post(getPath()+"/basedata/cusresource/enable",data,function(res){
		if(res.STATE=="SUCCESS"){
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		$list_dataParam['type'] = treeNode.id;
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
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node && node!=null && node.length>0){
		$list_dataParam['type'] = node[0].id;
	}
	$list_dataParam['key'] = kw;
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