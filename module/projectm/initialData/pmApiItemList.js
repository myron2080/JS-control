$list_addUrl = getPath()+"/projectm/apiCenter/add";//新增url
$list_editUrl = getPath()+"/projectm/apiCenter/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/projectm/apiCenter/delete";//删除url
$list_editWidth = "630px";
$list_editHeight = "430px";
$list_dataType = "接口中心";
$tree_container = "leftTree";
var isModuleType="${isModuleType}";
var moduleType="${moduleType}";
$tree_async_url = getPath()+"/projectm/permissionItem/simpleTreeData";
$(document).ready(
			function() {
				$("#main").ligerLayout({leftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
				initSimpleDataTree();					
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam,
									{
								columns : [
								            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
								            {display: '编码', name: 'number', align: 'left', width: 70},
								            {display: '名称', name: 'name', align: 'left', width: 80},
								            {display: '接口路径', name: 'apiUrl', align: 'left', width: 180},
								            {display: '接口说明', name: 'description', align: 'left', width: 180}   
										],
										url : getPath()+ '/projectm/apiCenter/listData'
									}));
				});




function operateRender(data,filterData){
  var operateStr="";
  operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|';
  operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
  return operateStr;
}

/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRowEvent(config,t){
	if(t=="禁用"){
		art.dialog.confirm('禁用会导致编号规则无效,是否继续?',function(){
			$.post(getPath() + '/projectm/code/updateStatus',config,function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					refresh();
				}
			},'json');
		});
		return;
	}
	$.post(getPath() + '/projectm/code/updateStatus',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}

/**
 * 点击新增按钮前,设置参数
 * @returns
 */
function getAddRowParam(){
	if(moduleType==""|| moduleType==null){
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {moduleType:null};
	}
	return {moduleType:moduleType};
}
function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}


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

function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if(selectNodes[0].children==undefined){
			$list_dataParam['isModuleType']='FALSE';
			isModuleType = 'FALSE';
		}else{
			$list_dataParam['isModuleType']='TRUE';
			isModuleType = 'TRUE';
		}
		$list_dataParam['moduleType']=selectNodes[0].id;
		moduleType=selectNodes[0].id;
	}else{
//		delete $list_dataParam['isModuleType'];
//		delete $list_dataParam['moduleType'];
	}
	
	var kw = $('#searchKeyWord').val();
	if(kw){
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
	}
	resetList();
}
