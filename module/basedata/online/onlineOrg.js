$list_editUrl = getPath()+"/basedata/org/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/org/add";//新增url
$list_deleteUrl = getPath()+"/basedata/org/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "250px";
$list_dataType = "组织";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/org/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height("480px");
	$("#toolBar").append(
		' <div style="padding-top:5px;display:inline;"><label id="includeContainer"><input type="checkbox" name="includeChild" id="includeChild" checked="checked" />包含下级</label></div>'
		+'<div style="float:right;padding-right:50px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '编码', name: 'number', align: 'left', width: 120},
            {display: '包含岗位', name: 'jobs', align: 'left', width: 150},
            {display: '描述', name: 'description', align: 'left', width: 180},
            {display: '状态', name: 'status', align: 'left', width: 80,render:function(d){
            	if(d.status=='ENABLE'){
            		return '启用';
            	}
            	return '禁用';
            }}
        ],
        fixedCellHeight:false,
        url:getPath()+'/basedata/online/orgListData',
        onDblClickRow:function(data){
	    	 $(parent.document.getElementById("orgName")).val(data.name);
	    	 parent.closeOrgWin();
	      }
    }));
	$('#includeContainer').bind('click',searchData);
});

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

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
