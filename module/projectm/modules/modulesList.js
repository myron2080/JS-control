$list_addUrl = getPath()+"/projectm/modulesFunction/toAddFunctionPage";//新增功能点URL
$list_editUrl = getPath()+"/projectm/modulesFunction/toEditFunctionPage";//编辑及查看url
$list_deleteUrl = getPath()+"/projectm/modulesFunction/delete";//删除功能点url
$list_editWidth = "260px"; //编辑窗口
$list_editHeight = "110px";
$list_dataType = "功能点";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/modulesList/simpleTreeData";  //模块列表数据
var isModuleType = null;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-20);
	initSimpleDataTree();
	//初始化事件
	initEvent();
	$list_dataGrid = $("#tableContainer").ligerGrid(
			$.extend($list_defaultGridParam,
			{columns : [ 
		            	{display : '操作',name : 'id',align : 'center',width : 100,render : operateRender} ,
		            	{display : '功能点名称',name : 'name',align : 'center',width : 180} ,
			            {display : '默认处理人',name : 'person.name',align : 'center',width : 175} ,
			            {display : '创建时间',name : 'createTime',align : 'center',width : 100} ,
		            	],
						url : getPath()+ '/projectm/modulesList/listFunctionData',
						height:'98%',
						delayLoad:true
		}));
	setTimeout(function(){
		selectBranch();
	},200);
});
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
			for ( var i = 0; i < nodes.length; i++) {
				tree.expandNode(nodes[i], true, true, true);
			} 
		}
	},'json');
}
function initEvent(){
	//新增功能点
	$("#function_add").click(function(){
		var tree = $.fn.zTree.getZTreeObj($tree_container);
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			if(isModuleType=="FALSE"){
				art.dialog.alert("请选择最小节点");
			}
			if(isModuleType=="TRUE"){
			addRow();
			}
		}else{
			art.dialog.alert("请选择一个模块");
		}
	});
}

/**
 * 点击树
 * @param event
 * @param treeId
 */
function onTreeNodeClick(event, treeId, treeNode){
	selectBranch();
}


/**
 * 添加的时候获取参数
 */
function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {modules_id:selectNodes[0].id,modules_name:selectNodes[0].name};
		}else{
			return {modules_id:null,modules_name:null}
		}
	}
	return null;
}

/**
 * 获取树选择的id
 */
function getSelectNodeId(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			if(selectNodes[0].children==undefined){
				isModuleType = 'TRUE';
			}else{
				isModuleType = 'FALSE';
			}
			return selectNodes[0].id
		}else{
			return '';
		}
	}
	return '' ;
}

/**
 * 查找
 */
function selectBranch(){
	var modules_id = getSelectNodeId() ;
	$list_dataParam["modules_id"]= modules_id;
	resetList();
}

/**
 * 操作
 * @param data
 * @param filterData
 */
function operateRender(data){
	return "<a class='modify_font' href='javascript:editRow({id:\""+data.id+"\"});'>修改</a>|"
		+"<a class='delete_font' href='javascript:deleteRow({id:\""+data.id+"\"});'>删除</a>";
}

function afterAddRow(){
	selectBranch();
}

function afterEditRow(){
	selectBranch();
}

function afterDeleteRow(){
	selectBranch();
}