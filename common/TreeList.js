var $tree_container = "tree";//树容器id
var $tree_async_url = "";//取数url
var $tree_async_enable = true;//ajax取数
var $tree_view_selectedMulti = false;//是否允许多选
var $tree_async_autoParam = ['id=parent'];//取数自动传参
var $tree_firstLoaded = false;//是否初次加载
var $tree_addUrl;//新增url
var $tree_editUrl;//编辑及查看url
var $tree_editWidth;//界面宽度
var $tree_editHeight;//界面高度
var $tree_deleteUrl;//删除url
var $tree_dataType;//数据名称
var $tree_async_dataFilter = function(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
		if(childNodes[i].leaf == true || childNodes[i].leaf == "true" || childNodes[i].leaf==1){
			childNodes[i].isParent=false;
		}else{
			childNodes[i].isParent=true;
		}
	}
	return childNodes;
};
/**
 * 初始化树(延迟加载方式)
 * @returns
 */
function initDelayTree(){
	$.fn.zTree.init($("#"+$tree_container), {
		async: {
			enable: $tree_async_enable,
			url:$tree_async_url,
			autoParam:$tree_async_autoParam,
			dataFilter: $tree_async_dataFilter
		},
		view:{
			selectedMulti:$tree_view_selectedMulti
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
		}
	});
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
			tree.expandNode(nodes[0], true, false, true);
			tree.selectNode(nodes[0]);
		}
		if(searchData){
			searchData();
		}
	},'json');
}

function onTreeAsyncSuccess(event, treeId, node, msg){
  if(!$tree_firstLoaded){
	  var tree = $.fn.zTree.getZTreeObj($tree_container);
	  var nodes = tree.getNodes();
	  if(nodes && nodes.length>0){
		  $("span.level0").get(0).click();
		  $("a.level0").get(0).click();
		  $tree_firstLoaded = true;
	  }
  }
}
function resetSelectNode(tree,node){
	tree.reAsyncChildNodes(node, "refresh");
}
//增加节点
function addNode(){
	if($tree_addUrl && $tree_addUrl!=''){
		var paramStr = '';
		if($tree_addUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		if(typeof(getTreeNodeParam) == "function"){
			var param = getTreeNodeParam();
			if(param){
				for(var p in param){
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open($tree_addUrl+paramStr,
				{title:getTreeEditTitle('ADD'),
				 lock:true,
				 width:$tree_editWidth||'auto',
				 height:$tree_editHeight||'auto',
				 id:$tree_dataType+"-ADD",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd();
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 if(flag){
						 if(afterAddNode && (typeof afterAddNode)=='function'){
							 afterAddNode();
						 }
					 }
				 }
		});
	}
}

//编辑节点
function updateNode(){
	if($tree_editUrl && $tree_editUrl!=''){
		var tree = $.fn.zTree.getZTreeObj($tree_container);
		var node = tree.getSelectedNodes();
		if(node==null || node.length==0){
			art.dialog.tips("请先选择要编辑的节点");
			return;
		}
		if(node[0].isParent == true){
			art.dialog.tips('存在子节点，不能编辑');
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
//删除节点
function deleteNode(){
	if($tree_deleteUrl && $tree_deleteUrl!=''){
		art.dialog.confirm('确定要删除该节点?',function(){
			var tree = $.fn.zTree.getZTreeObj($tree_container);
			var node = tree.getSelectedNodes();
			if(node==null || node.length==0){
				art.dialog.tips("请先选择要删除的节点");
				return;
			}
			if(node[0].isParent == true){
				art.dialog.tips("存在子节点，不能删除");
				return;
			}
//			if(node.children!=null || node.isParent==true){
//				art.dialog.tips("存在子节点，不能删除");
//				return;
//			}
			var parentNode = node[0].getParentNode();
			$.post($tree_deleteUrl,{id:node[0].id},function(res){
				if(res.STATE=="SUCCESS"){
					tree.removeNode(node[0]);
					if(parentNode!=null){
						if(parentNode.children.length==0){
							parentNode.children = null;
							parentNode.isParent = false;
						}
					}
				}else{
					art.dialog.tips(res.MSG);
				}
			},'json');
		});
	}
}

function getTreeEditTitle(viewstate){
	if(!$tree_dataType){
		$tree_dataType = "数据";
	}
	switch(viewstate){
		case 'ADD':return $tree_dataType+'-新增';
		case 'VIEW':return $tree_dataType+'-查看';
		case 'EDIT':return $tree_dataType+'-编辑';
		default:return $tree_dataType;
	}
}

var treeLocateCache = {};

function treeLocate(treeId,key,value){
	if(treeId){
		var tree = $.fn.zTree.getZTreeObj(treeId);
		if(tree){
			if(!treeLocateCache[treeId]){
				treeLocateCache[treeId] = {};
			}
			if(key && value){
				var idx = 0;
				if(treeLocateCache[treeId].key==key && treeLocateCache[treeId].value==value){
					idx = treeLocateCache[treeId].index || 0;
				}else{
					treeLocateCache[treeId].index = 0;
					treeLocateCache[treeId].key = key;
					treeLocateCache[treeId].value = value;
				}
				var nodes = tree.getNodesByParamFuzzy(key, value, null);
				if(nodes.length > 0){
					if(idx >= nodes.length){
						idx = 0;
					}
					if(idx < nodes.length){
						tree.expandNode(nodes[idx], true, false, true);
						tree.selectNode(nodes[idx]);
						treeLocateCache[treeId].index = ++idx;
					}
				}
			}else{
				treeLocateCache[treeId] = {};
			}
		}
	}
}

