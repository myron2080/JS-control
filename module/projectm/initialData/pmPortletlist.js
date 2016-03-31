$list_addUrl = getPath()+"/projectm/portlet/add";
$list_editUrl = getPath()+"/projectm/portlet/edit";
$list_deleteUrl = getPath()+"/projectm/portlet/delete";
$list_editWidth = 650;
$list_editHeight = 200;
$list_dataType="portlet";
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/initialData/simpleTreeData";
$(document).ready(function(){
	//$("#main").ligerLayout({});
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '编码', name: 'number', align: 'center', width: 80},
            {display: '名称', name: 'name', align: 'center', width: 120},
            {display: '行业', name: 'businessType.name', align: 'center', width: 80},
            {display: '状态', name: 'statusStr', align: 'center', width: 80},
            {display: '描述', name: 'description', align: 'center', width: 160},
            {display: '格式', name: 'formatSizeStr', align: 'center', width: 80},
            {display: '首页布局', name: 'layout.name', align: 'center', width: 80},
            {display: '访问路径', name: 'url', align: 'center', width: 150},
            {display: '配置路径', name: 'configUrl', align: 'center', width: 150},
            {display: '操作', name: 'operate', align: 'center', width: 190,render:operateRender}
            ],
            delayLoad:true,
           // enabledSort :true,    
            paging:true,
        url:getPath() + '/projectm/portlet/listData'
    }));  
	//resetList();
});

function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		$list_dataParam['businessType'] = selectNodes[0].id;
	}else{
		delete $list_dataParam['businessType'];
	}
	resetList();
}

function operateRender(row,filterData){
	return (row.status=='ENABLE'?
			('<a href="javascript:void(0)" onclick="updateStatus(\''+row.id+'\',\'DISABLED\');">禁用</a> | ')
			:
			('<a href="javascript:void(0)" onclick="updateStatus(\''+row.id+'\',\'ENABLE\');">启用</a> | ')) 
			+'<a href="javascript:void(0)" onclick="editRow({id:\''+row.id+'\'});">修改</a>'+ 
			' | <a href="javascript:void(0)" onclick="deleteRow({id:\''+row.id+'\'});">删除</a>'+
			(row.configUrl==''?''
			:
			' | <a href="javascript:void(0)" onclick="openConfgiPage({id:\''+row.id+'\',url:\''+row.configUrl+'\',pageSiz:\''+row.configPageSize+'\',name:\''+row.name+'\'});">配置内容</a>');
}
function openConfgiPage(data){
	if(data.url && data.url!=null && data.url!='' ){
		if(data.pageSiz && data.pageSiz!=null && data.pageSiz!='' ){
			var width=data.pageSiz.split("X")[0]+"px";
			var height=data.pageSiz.split("X")[1]+"px"; 
			var dlg = art.dialog.open(getPath()+"/"+data.url,
					{title:"内容配置",
					 lock:true,
					 width:width||'auto',
					 height:height||'auto',
					 id:$list_dataType+"-ADD",
					 button:[{name:'确定',callback:function(){
							if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
								dlg.iframe.contentWindow.saveAdd(this);
							}
							return false;
						}},{name:'取消',callback:function(){
							return true;
						}}],
					 close:function(){
						  
					 }
			});
		}else{
		   top.addTabItem(data.id,getPath()+"/"+data.url,data.name+"配置");
		}
	}
}
function updateStatus(id,status){
	$.post(getPath()+"/projectm/portlet/updateStatus",{id:id,status:status},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				
				art.dialog.tips(res.MSG);
			}else{
				art.dialog.tips('操作成功');
			}
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}