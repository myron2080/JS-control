$list_editWidth = "580px";
$list_editHeight = "270px";
$list_dataType = "基础数据";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/codeCase/simpleTreeData";
$tree_addUrl = getPath()+"/projectm/codeCase/add";
$tree_editUrl = getPath()+"/projectm/codeCase/edit";
$tree_deleteUrl = getPath()+"/projectm/codeCase/delete";
$tree_editWidth = "580px";
$tree_editHeight = "520px";
$tree_dataType = "代码示例";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'locate',text:'定位',click:function(){
					var name = $('#locate').val();
					treeLocate('leftTree','name',name);
				},icon:'locate'},
		       {id:'addNode',text:'新增',click:addNode,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
		});
	initSimpleDataTree();
});

function initSimpleDataTreeTemp(){
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

function updateNode(){
	if($tree_editUrl && $tree_editUrl!=''){
		var tree = $.fn.zTree.getZTreeObj($tree_container);
		var node = tree.getSelectedNodes();
		if(node==null || node.length==0){
			art.dialog.tips("请先选择要编辑的节点");
			return;
		}
		if(node[0].isParent == true){
			 var sortUrl=getPath()+'/projectm/codeCase/updateSort?VIEWSTATE=EDIT&id=' + node[0].id ;
			 var dlg = art.dialog.open(sortUrl,
						{title:getTreeEditTitle('EDIT'),
						lock:true,
						width:'580px',
						height:'500px',
						id:'sort',
						button:[{name:'确定',callback:function(){
								if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
									dlg.iframe.contentWindow.saveEdit();
								}
								return false;
							}},{name:'取消',callback:function(){
								flag = false;
								return true;
							}}],
						close:function(){
							 afterUpdateNode();
						}
					});
			return;
		}
		var paramStr = '';
		if($tree_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id=' + node[0].id;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id=' + node[0].id;
		}
		var flag = true;
		var dlg = art.dialog.open($tree_editUrl+paramStr,
				{title:getTreeEditTitle('EDIT'),
				lock:true,
				width:$tree_editWidth||'auto',
				height:$tree_editHeight||'auto',
				id:$tree_dataType+"-ADD",
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveEdit();
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					 if(flag){
						 if(afterUpdateNode && (typeof afterUpdateNode)=='function'){
							 afterUpdateNode();
						 }
					 }
				 }
			});
	}
}

function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

function getTreeNodeParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		return {parentId:node[0].id};
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

function getPrentId(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		return node[0].id;
	}
	return false;
}

function searchData(){
	var parentId = getPrentId();
	if(!parentId){
		art.dialog.tips("请先在左边选择数据类型");
		return false;
	}
	$.post(getPath()+"/projectm/codeCase/listData",{id:parentId},function(res){
		if(res.items){
			var items = res.items;
			var objData=items[0];
			if(objData){				
				$('#codeDes').html(objData.description);
				$('#codeCase').val("<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" pageEncoding=\"UTF-8\"%>\n"+objData.code);
				if(objData.caseFlag=='Y'){
					var code=objData.code;
					if(code && code.indexOf("${base}")>0){
						code = code.split("${base}").join(base);
					}
//					$('[indexHiden]').eq(1).html(code);
					$('[indexHiden]').show();
				}else{
					$('[indexHiden]').hide();
				}
				$("#codeIframe").attr("src",getPath()+"/projectm/codeCase/readJsp?id="+parentId);
			}else{
				$('#codeDes').html('');
				$('#codeCase').val('');
				$('[indexHiden]').hide();
			}
		}else{
			$('#codeDes').html('');
			$('#codeCase').val('');
			$('[indexHiden]').hide();
		}
		
		
	},'json');
}

function runCode(){
	var code=$('#codeCase').val();
	if(code && code.indexOf("${base}")>0){
		code = code.split("${base}").join(base);
	}
	$('[indexHiden]').eq(1).html(code);
	$('[indexHiden]').show();
}
