$list_editUrl = getPath()+"/basedata/mark/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/mark/add";//新增url
$list_deleteUrl = getPath()+"/basedata/mark/delete";//删除url
$list_dataType='标签';
$list_editWidth = "350px";
$list_editHeight = "150px";
$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/mark/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	//展示树形
	initSimpleDataTree();
	//显示列表
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '标签', name: 'name', align: 'center', width: 120},
            {display: '编码', name: 'number', align: 'center', width: 100},
            {display: '归属标签', name: 'parent.name', align: 'center', width: 100},
            {display: '标签级别', name: '', align: 'center', width: 80,render:function(data){if(data.system == 1) return '用户级';else return '系统级';}},
            {display: '显式/隐式', name: '', align: 'center', width: 80,render:function(data){if(data.display == 1)return '显式';else return '隐式';}},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
        delayLoad:true,
        url:getPath()+'/basedata/mark/listData'
    }));
	bandEnter('searchKeyWord');
	$list_dataParam['type'] = 'NOSYS';
	searchData();
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function operateRender(data){
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a> | '
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}
/**
 * 加载右边的数据
 */
function searchData(){
	//标签名
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
	//级别
	var isSystem = $('#system').val();
	if(isSystem==null || isSystem == ''){
		delete $list_dataParam['system'];
	}else{
		$list_dataParam['system'] = isSystem;
	}
	//显示
	var isDisplay = $('#display').val();
	if(isDisplay==null || isDisplay == ''){
		delete $list_dataParam['display'];
	}else{
		$list_dataParam['display'] = isDisplay;
	}
	resetList();
}
/**
 * 响应左边点击事件
 * @param event
 * @param treeId
 * @param treeNode
 */
function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(treeNode.id=='ISSYS'){
			$list_dataParam['type'] = 'ISSYS';
		}else if(treeNode.id=='NOSYS'){
			$list_dataParam['type'] = 'NOSYS';
		}else {
		   delete $list_dataParam['type'] ;
		}
		if(treeNode.id!='ISSYS' && treeNode.id!='NOSYS'){//节点[数据库中存在]
			//判断是否存在长编码
			if(treeNode.longNumber!=null && treeNode.longNumber!=''){
				$list_dataParam['longNumber'] = treeNode.longNumber;
			}else{//表示非系统级别
				$list_dataParam['number'] = treeNode.number;
			}
		}else{
			delete $list_dataParam['number'] ;
			delete $list_dataParam['longNumber'] ;
		}
	}
	searchData();
}
/**
 * 清空
 */
function cleanData(){
	$("#searchKeyWord").val($('#searchKeyWord').attr('defaultValue'));//清空关键字
	$("#system").find("option").eq(0).attr("selected",true);
	$("#display").find("option").eq(0).attr("selected",true);
}
/**
 * 绑定回车查询
 * @param id
 */
function bandEnter(id){
	$('#'+id).bind('keypress',function(event){
        if(event.keyCode == "13")    
        {
        	searchData();
        }
    });
}
/**
 * 刷新左边的树
 */
function afterAddRow(){
	$.ajaxSetup({
		 async : false
	});
	var oldtree = $.fn.zTree.getZTreeObj($tree_container);
	var oldnode = oldtree.getSelectedNodes();
	$('#'+$tree_container).empty();
	initSimpleDataTree();
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node=tree.getNodeByParam("id",oldnode[0].id,null);
	//判断新选中的节点后，在刷新
	commentCondition(node);
	tree.expandNode(node, true, false, true);
	tree.selectNode(node);
	$.ajaxSetup({
		 async : false
	});
}
function commentCondition(node){
	if(node.id=='ISSYS'){
		$list_dataParam['type'] = 'ISSYS';
	}else if(node.id=='NOSYS'){
		$list_dataParam['type'] = 'NOSYS';
	}else {
	   delete $list_dataParam['type'] ;
	}
	if(node.id!='ISSYS' && node.id!='NOSYS'){//节点[数据库中存在]
		//判断是否存在长编码
		if(node.longNumber!=null && node.longNumber!=''){
			$list_dataParam['longNumber'] = node.longNumber;
		}else{//表示非系统级别
			$list_dataParam['number'] = node.number;
		}
	}else{
		delete $list_dataParam['number'] ;
		delete $list_dataParam['longNumber'] ;
	}
}
function afterEditRow(){
	$.ajaxSetup({
		 async : false
	});
	var oldtree = $.fn.zTree.getZTreeObj($tree_container);
	var oldnode = oldtree.getSelectedNodes();
	$('#'+$tree_container).empty();
	initSimpleDataTree();
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node=tree.getNodeByParam("id",oldnode[0].id,null);
	commentCondition(node);
	tree.expandNode(node, true, false, true);
	tree.selectNode(node);
	$.ajaxSetup({
		 async : false
	});
}

function afterDeleteRow(){
	$.ajaxSetup({
		 async : false
	});
	var oldtree = $.fn.zTree.getZTreeObj($tree_container);
	var oldnode = oldtree.getSelectedNodes();
	$('#'+$tree_container).empty();
	initSimpleDataTree();
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node=tree.getNodeByParam("id",oldnode[0].id,null);
	if(!node){
		node=tree.getNodeByParam("id",oldnode[0].pid,null);
		commentCondition(node);
	}
	tree.expandNode(node, true, false, true);
	tree.selectNode(node);
	$.ajaxSetup({
		 async : false
	});
}
/**
 * 加载树形结构[重写]
 */
function initSimpleDataTree(){
	$.post($tree_async_url,{},function(treeData){
		var tree = $.fn.zTree.init($("#"+$tree_container), {
			async: {
				enable: false
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					if(typeof(onTreeNodeClick) == "function"){
						onTreeNodeClick(event, treeId, treeNode);
					}
				},
				onAsyncSuccess:function(event, treeId, node, msg){
					if(typeof(onTreeAsyncSuccess) == "function"){
						onTreeAsyncSuccess(event, treeId, node, msg);
					}
				}
			},
			data:{
				simpleData:{
					enable: true,
					idKey: "id",
					pIdKey: "pid",
					rootPId: null
				}
			}
		},treeData);
		var nodes = tree.getNodes();
		if(nodes && nodes.length > 0){
			tree.expandNode(nodes[0], true, false, true);
			tree.selectNode(nodes[0]);
		}
	},'json');
}