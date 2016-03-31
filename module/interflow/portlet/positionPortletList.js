$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/jobcategory/simpleTreeData";
var curupdateId = "";
var $list_deleteUrl = getPath()+"/interflow/positionPortlet/delete";//删除url

$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});

	$("#toolBar").ligerToolBar({
		items:[
		       {id:'jobPermission',text:'批量设置',click:batchSet,icon:'settings'}
		]
		});
	$("#toolBar").append(
		'<div style="float:right;padding-right:50px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		checkbox:true,
        columns: [ 
            {display: '名称', name: 'position.name', align: 'left', width: 120},
            {display: '岗位类型', name: 'position.jobCategory.name', align: 'left', width: 100},
            {display: '版本', name: 'layout.name', align: 'left', width: 100},
            {display: '操作', name: 'operate', align: 'center', width: 210,render:operateRender}
        ],
        url:getPath()+'/interflow/positionPortlet/listData'
    }));
});
function operateRender(data,filterData){
		return '<a href="javascript:updateSet({posid:\''+data.position.id+'\'});">设置</a>|'
			+'<a href="javascript:deleteRow({id:\''+((data.id)?data.id:'nodata')+'\'});">取消</a>';
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
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
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		$list_dataParam['type'] = treeNode.id;
	}
	searchData();
}



function searchData(){
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
	resetList();
}

function batchSet(){
	art.dialog.open(getPath()+"/framework/dataPicker/list?query=getHomeSet&status=ENABLE",{
		id : "getHomeSet",
		title : '首页版本',
		background : '#333',
		width : 450,
		height : 450,
		lock : true	 
		});
	art.dialog.data("returnFunName","updateBatchPortlet");
}

function updateSet(obj){
	curupdateId = obj.posid;
	art.dialog.open(getPath()+"/framework/dataPicker/list?query=getHomeSet&status=ENABLE",{
		id : "getHomeSet",
		title : '首页版本',
		background : '#333',
		width : 450,
		height : 450,
		lock : true	 
		});
	art.dialog.data("returnFunName","updatePortlet");
}

function updatePortlet(obj,type){
	var param = {};
	param['layoutid'] = obj[0].id;
	param['posid'] = curupdateId;
	$.post(getPath()+"/interflow/positionPortlet/saveAndUpdate",param,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){

			refresh();
		}
	},'json');
}

function updateBatchPortlet(obj){
	var selected = $list_dataGrid.getSelectedRows();
	var curupdateId = '';
	for(var i=0;i<selected.length;i++){
		curupdateId += selected[i].position.id+","; 
	}
	var param = {};
	param['layoutid'] = obj.id;
	param['posid'] = curupdateId;
	$.post(getPath()+"/interflow/positionPortlet/saveAndUpdate",param,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){

			refresh();
		}
	},'json');
}