$list_addUrl = getPath()+"/projectm/printConfig/add";//新增url
$list_editUrl = getPath()+"/projectm/printConfig/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/projectm/printConfig/delete";//删除url
$list_editWidth = "850px";
$list_editHeight = "450px";
$list_dataType = "打印配置";//数据名称
$tree_container = "leftTree";
var isModuleType="${isModuleType}";
var moduleType="${moduleType}";
$tree_async_url = getPath()+"/projectm/permissionItem/simpleTreeData";
$(document).ready(
			function() {
				$("#main").ligerLayout({leftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
				initSimpleDataTree();
					/*$("#toolBar").append(
						'<div style="float:left;padding-left:5px;display:inline;">'
				    	+'	<form onsubmit="searchData();return false;">'	
					    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称" defaultValue="名称" value="名称" id="searchKeyWord" class="input"/>'
					    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
				    	+'	</form>'
				    	+'</div>'
					);
					$("#toolBar").ligerToolBar({
						items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
						});*/
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam,
									{
										columns : [ {
											display : '编号',
											name : 'number',
											align : 'center',
											width : 150
										},{
											display : '单据名称',
											name : 'name',
											align : 'center',
											width : 150
										},{
											display : '单据类型',
											name : 'billType.name',
											align : 'center',
											width : 150
										}, {
											display : '取数方式',
											name : 'fetchType.name',
											align : 'center',
											width : 150
										}, {
											display : '取数配置',
											name : 'fetchConfig',
											align : 'center',
											width : 300
										},{
											display : '操作',
											name : 'operate',
											align : 'center',
											width : 150,
											render : operateRender
										} ],
										url : getPath()
												+ '/projectm/printConfig/listData'
									}));
				});




function operateRender(data,filterData){
	var operateStr ="";
	operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|';
	operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return operateStr;
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