$list_editUrl = getPath()+"/basedata/job/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/job/add";//新增url
$list_deleteUrl = getPath()+"/basedata/job/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "320px";
$list_dataType = "岗位";//数据名称
$tree_container = "leftTree";
$tree_addUrl = getPath()+"/basedata/jobcategory/add";//新增
$tree_async_url = getPath()+"/basedata/jobcategory/simpleTreeData";
$tree_editUrl = getPath()+"/basedata/jobcategory/edit";//编辑及查看url
$tree_deleteUrl = getPath()+"/basedata/jobcategory/delete";//删除url
$tree_editWidth = "548px";//界面宽度
$tree_editHeight = "184px";//界面高度
$tree_dataType = "岗位大类";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	
	
/*	$("#toolBar").append(
		'<div style="display:inline;float:left;padding:0 0 0 5px;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
    	+'	</form>'
    	+'</div>'
	);$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:addRow,icon:'add'}
	      /* {id:'jobPermission',text:'批量授权',click:jobPermission,icon:'settings'},
	       {id:'permissionManage',text:'权限项管理',click:permissionManage,icon:'database'}*/
	/*	]
	});
$("#toolBar").ligerToolBar({
	items:[{id:'add',text:'微信组织',click:addWeiXinRow,icon:'add'},
	       {id:'jobEtc',text:'职等管理',click:jobEtc,icon:'add'}
	       ]
	});*/
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addNode,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
		});
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '编码', name: 'number', align: 'left', width: 100},
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '职等', name: 'jobEtc.name', align: 'left', width: 100},
            {display: '微信组织', name: 'weixinOrg.name', align: 'left', width: 100},
            {display: '操作', name: 'operate', align: 'center', width: 240,render:operateRender},
            {display: '描述', name: 'description', align: 'left', width: 180}
            
        ],
        url:getPath()+'/basedata/job/listData'
    }));
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function addWeiXinRow(){
	art.dialog.open(getPath()+"/basedata/weixinorg/list",
			{title:"微信组织",
			lock:true,
			width:'750px',
			height:'500px',
			id:'setWXOrg',
			button:[{name:'关闭'}]}
	);
}

function operateRender(data,filterData){
		var str="";
		str += '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
		str	+= '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>|';
		if(isPermission){
			str += '<a href="javascript:viewPermission({id:\''+data.id+'\'});">权限设置</a>|';
		}
		str += '<a href="javascript:setWXOrg({id:\''+data.id+'\'});">设置微信组织</a>';
		return str;
}
function jobPermission(){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem('jobPermission',getPath()+'/permission/jobPermission/list','岗位权限');
	}
}
var jobId="";
function setWXOrg(data){
	jobId=data.id;
	art.dialog.open(getPath()+"/basedata/weixinorg/orgDataPicker",
			{title:"设置微信组织",
			lock:true,
			width:'750px',
			height:'500px',
			id:'setWXOrg',
			button:[{name:'关闭'}]}
	);
	art.dialog.data("returnFunName","updateJob");
}

function updateJob(obj){
	var updateJobUrl=getPath()+"/basedata/job/setWXOrg?jobId="+jobId+"&wxOrgId="+obj.id;
	$.post(updateJobUrl,{},function(res){
		if("SUCCESS"==res.STATE){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json')
}

function jobEtc(){
	art.dialog.open(getPath()+'/basedata/jobEtc/list',{
		 title:"职等管理",
		 lock:true,
		 width:"870px",
		 height:($(window).height()-200),
		 id:"jobEtc",
		 button:[{name:'确定'}]
	});
}

function permissionManage(){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem('permissionManage',getPath()+'/basedata/param/toParamIndex?flag=PERMISSION','系统设置');
	}
}

function viewPermission(job){
	art.dialog.open(getPath()+'/permission/jobPermission/jobPermissionEdit?job='+job.id,{
		 title:"权限设置",
		 lock:true,
		 width:"1070px",
		 height:($(window).height()-200),
		 id:"jobPermissionEdit",
		 button:[{name:'确定'}]
	});
}
function afterAddRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterEditRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterDeleteRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
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
		if(treeNode.id!='FFFF'){
			$list_dataParam['type'] = treeNode.id;
		}else{
			delete $list_dataParam["type"];
		}
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