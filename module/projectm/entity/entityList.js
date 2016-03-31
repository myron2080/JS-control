$list_addUrl = getPath()+"/projectm/entity/add";//新增url
$list_editUrl = getPath()+"/projectm/entity/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/projectm/entity/delete";//删除url
$list_editWidth = "600px";
$list_editHeight = "350px";
$list_dataType = "实体设计";//数据名称
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
											{
												display : '管理',
												name : 'manager',
												align : 'center',
												width : 80,
												render : manager
											} ,
											{
												display : '操作',
												name : 'operate',
												align : 'center',
												width : 100,
												render : operateRender
											} ,         
										   {
											display : '实体名称',
											name : 'entityName',
											align : 'center',
											width : 150
										}, {
											display : '中文名称',
											name : 'name',
											align : 'center',
											width : 150
										}, {
											display : '表名',
											name : 'tableName',
											align : 'center',
											width : 180
										}, {
											display : '实体类型',
											name : 'entityType.label',
											align : 'center',
											width : 150
										}, {
											display : '描述',
											name : 'description',
											align : 'center',
											width : 150
										},
										{
											display : '字段数',
											name : '',
											align : 'center',
											width : 50,
										} 
										],
										url : getPath()
												+ '/projectm/entity/listData'
									}));
				});




function operateRender(data,filterData){
	var operateStr ="";
	operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>|';
	operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';

	return operateStr;
}
function manager(data,filterData){
	return '<a href="javascript:indexRow(\''+data.id+'\');">索引</a>';
	
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
function indexRow(id){
	var flag = true;
	var dlg = art.dialog.open(getPath()+"/projectm/entity/index?id="+id,
			{title:'索引',
			 width:'728px',
			 height:'380px',
			 id:'index',
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				
				 if(flag){
					 refresh();
				 }
			 }
			});
	
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
