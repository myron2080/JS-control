$list_editUrl = getPath()+"/projectm/helpInfo/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/helpInfo/add";//新增url
$list_deleteUrl = getPath()+"/projectm/helpInfo/delete";//删除url
$list_editWidth = "1024px";
$list_editHeight = "600px";
$list_dataType = "帮助信息";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/helpInfo/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:170,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRow,icon:'add'}
			]
		});
	$("#toolBar").append(
		'<div style="float:right;padding-right:5px;display:inline;"></div>'
	);
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '功能名称', name: 'name', align: 'left', width: 80},
            {display: '创建日期', name: 'createTime', align: 'left', width: 80},
            {display: '创建人', name: 'creator.name', align: 'left', width: 90},
            {display: '最后修改日期', name: 'lastUpdateTime', align: 'left', width: 180},
            {display: '最后修改人', name: 'updator.name', align: 'left', width: 180},
            {display: '操作', name: 'operate', align: 'center', width: 230,render:operateRender}
        ],
        height:'95%',
        fixedCellHeight:false,
        url:getPath()+'/projectm/helpInfo/listData',
        delayLoad:true,
        onDblClickRow:function(data){
        	showDetailCustomer(data.id);
        }
    }));
	$('#includeContainer').bind('change',searchData);
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
});

function showDetailCustomer(id){
	var showDetailCustomerUrl = getPath()+"/projectm/helpInfo/showDetail";
	art.dialog.open(showDetailCustomerUrl+"?id="+id,
			{title:'预览',
			lock:true,
			width:"1024px",
			height:"640px",
			id:'showDetailHelpInfo',
			button:[{name:'关闭'}]}
	);
}

function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>  |  '
			+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
		
}

function afterAddRow(){
//	$('#'+$tree_container).empty();
	//initSimpleDataTree();
}

function afterEditRow(){
	//$('#'+$tree_container).empty();
	//initSimpleDataTree();
}

function afterDeleteRow(){
//	$('#'+$tree_container).empty();
	//initSimpleDataTree();
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}else{
			artDialog.alert("请先选择树节点",function(){})
			return 'notValidate';
		}
		
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
			delete $list_dataParam['id'];
			$list_dataParam['longNumber'] = selectNodes[0].longNumber;
		}else{
			$list_dataParam['id'] = selectNodes[0].id;
			delete $list_dataParam['longNumber'];
		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['longNumber'];
	}
	resetList();
}

function moveRow(rowData,flag){
	editRow(rowData,flag);
}

//编辑行
function editRow(rowData,editState){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
				paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
				paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		if(editState){
			art.dialog.data("EDITSTATE",'MOVE');
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle(editState?'MOVE':'EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 art.dialog.data("EDITSTATE",null);
					 if(flag){
						 if(typeof(afterEditRow)=='function'){
							 afterEditRow();
						 }
						 refresh();
					 }
				 }
				});
	}
}

//获取弹出窗口的标题
function getTitle(viewstate){
	if(!$list_dataType){
		$list_dataType = "数据";
	}
	switch(viewstate){
		case 'ADD':return $list_dataType+'-新增';
		case 'VIEW':return $list_dataType+'-查看';
		case 'EDIT':return $list_dataType+'-编辑';
		case 'MOVE':return $list_dataType+'-迁移';
		default:return $list_dataType;
	}
}
