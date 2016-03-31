$list_editUrl = getPath()+"/interflow/rssBack/edit";//编辑及查看url
$list_addUrl = getPath()+"/interflow/rssBack/add";//新增url
$list_deleteUrl = getPath()+"/interflow/rssBack/delete";//删除url
$list_editWidth = "460px";
$list_editHeight = "220px";
$list_dataType = "订阅频道";//数据名称
$tree_container = "leftTree";
$tree_addUrl = getPath()+"/interflow/rssDataType/add";//新增
$tree_async_url = getPath()+"/interflow/rssDataType/simpleTreeData";
$tree_editUrl = getPath()+"/interflow/rssDataType/edit";//编辑及查看url
$tree_deleteUrl = getPath()+"/interflow/rssDataType/delete";//删除url
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "220px";//界面高度
$tree_dataType = "订阅类别";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:400,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:beforeAddRow,icon:'add'}]
		});
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addNode,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
		});
	initSimpleDataTree();
	var h=$(window).height();
	$("#left_body").height(h-48);
	$("#right_body").height(h-120);
});


function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		$("#type").val(treeNode.id);
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

function afterAddRow(){
	searchData();
}

function afterDeleteRow(){
	searchData();
}

function afterEditRow(){
	searchData();
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

function searchData(str){
	var flag=true;
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == 'up'){//上一页
		if(currentPage == 1){
			art.dialog.tips("已是第一页!");
			flag=false;
			thePage=parseInt(currentPage,10);
		}else{
			thePage=parseInt(currentPage,10)-1;
		}
	}else if(str == 'down'){//下一页
		if(currentPage == parseInt(totalPage,10)){
			art.dialog.tips("已是最后一页!");
			thePage=parseInt(currentPage,10);
			flag=false;
		}else{
			thePage=parseInt(currentPage,10)+1;
		}
	}else{
		thePage=1;
	}
	$("#currentPage").val(thePage);
	$("#pageLabel").text(thePage);
	if(flag){
		$.post(base+'/interflow/rssBack/getData',{currentPage:thePage,type:$("#type").val()},function(json){
			if(null != json){
				$("#totalPage").val(json.pageCount);
				$("#totalLabel").text(json.pageCount);
				if(null != json.items){
					$("#right_body").html("");
					var slist=json.items;
					var ul="";
					for(var i=0;i<slist.length;i++){
						var obj=slist[i];
						ul+="<div class='rss-news-list'><div class='rss-news-listin'>";
						ul+="<div class='rss-news-font'>";
						ul+="<p class='link-blue w12'>"+obj.title+"</p>";
						ul+="<p class='color999'>"+obj.content+"</p>";
						ul+="</div>";
						ul+="</div>";
						ul+="<div class='rss-news-logo'><div id='rss-news-logo01'><div id='rss-news-logo02'><img src='"+obj.imgPath+"' /></div></div></div>";
						ul+="<div class='rss-news-tool'>";
						ul+="<p><a class='link-blue' href='javascript:void(0);' onclick='editRow({id:\""+obj.id+"\"});'><i class='modification fl'></i><b class='fl'>修改</b></a></p>";
						ul+="<p><a class='link-blue' href='javascript:void(0);' onclick='deleteRow({id:\""+obj.id+"\"});'><i class='delete fl'></i><b class='fl'>删除</b></a></p></div></div>";
					}
					$("#right_body").append(ul);
				}
			}
		},'json');
	}
}

function updateRssData(){
	$.post( getPath()+"/interflow/rssBack/updateRssData",{},function(res){
		art.dialog.tips(res.MSG);
		 
	},'json');
}