$list_addUrl = getPath()+"/projectm/code/add";//新增url
$list_editUrl = getPath()+"/projectm/code/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/projectm/code/delete";//删除url
$list_editWidth = "630px";
$list_editHeight = "330px";
$list_dataType = "编号规则";//数据名称
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
										columns : [ {
											display : '规则名称',
											name : 'name',
											align : 'center',
											width : 150
										}, 
										{
											display : '单据类型',
											name : 'type.name',
											align : 'center',
											width : 150
										}, 
										{
											display : '所属组织',
											name : 'codeOrg.name',
											align : 'center',
											width : 150
										}, {
											display : '是否允许断号',
											name : 'isInterrupt',
											align : 'center',
											width : 100,
											render:function(item){
												if(item.isInterrupt=="Y")return '不允许';
												return '允许';
											}
										}, {
											display : '编码示例',
											name : 'example',
											align : 'center',
											width : 150
										}, {
											display : '状态',
											name : 'isDisable',
											align : 'center',
											width : 80,
											render:function(item){
												if(item.isDisable=="N"){
													return "启用";
												}
												return "禁用";
											}
										}, {
											display : '操作',
											name : 'operate',
											align : 'center',
											width : 150,
											render : operateRender
										} ],
										url : getPath()
												+ '/projectm/code/listData'
									}));
				});




function operateRender(data,filterData){
	var e = (data.isDisable=='Y'?'N':'Y');
	var t = (data.isDisable=='Y'?'启用':'禁用');
	var operateStr ="";
	operateStr +='<a href="javascript:enableRowEvent({id:\''+data.id+'\',isDisable:\''+e+'\'},\''+t+'\');">'+t+'</a>' ;
//	operateStr +='<a href="javascript:viewRow({id:\''+data.id+'\'});">查看</a>|';
	if(e=="N"){
		operateStr +='|<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|';
		operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	
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
	var   moduleEmun= $("#moduleEmunDiv").html().split(",");
	var isGoOn=0;
	for ( var i = 0; i < moduleEmun.length; i++) {
		if($.trim(moduleEmun[i])==moduleType){
			isGoOn++;
		}
	}
	if(isGoOn>0){
		return {moduleType:moduleType};
	}else{
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {moduleType:null};
	}
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
