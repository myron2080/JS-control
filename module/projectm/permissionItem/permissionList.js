$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/permissionItem/simpleTreeData";
$list_editUrl = getPath()+"/projectm/permissionItem/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/permissionItem/add";//新增url
$list_deleteUrl = getPath()+"/projectm/permissionItem/delete";//删除url
$list_editWidth = "530px";
$list_editHeight = "300px";
var isModuleType="${isModuleType}";
var moduleType="${moduleType}";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	/*$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
		});
	$("#toolBar").append(
		'<div style="float:right;padding-right:5px;display:inline;">'
    	+'</div>'
	);*/
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
//            {display: '组别', name: 'group.name', align: 'left', width: 120},
            {display: '名称', name: 'name', align: 'left', width: 120,render:nameRender},
            {display: '编码', name: 'number', align: 'left', width: 120},
            {display: '类型', name: 'permissionTypeDesc', align: 'left', width: 120},
            {display: '父权限', name: 'menuPerm.name', align: 'left', width: 120},
            {display: '描述', name: 'description', align: 'left', width: 180},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender}
        ],
        url:getPath()+'/projectm/permissionItem/listData'
    }));
});
function operateRender(data,filterData){
	return '<a href="javascript:editRowNew({id:\''+data.id+'\'});">编辑</a>|'
		+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function nameRender(data,filterData){
if(data.permissionType=='EFFECT') return "<span style='margin-left:20px;'>"+data.name+"</span>";
return "<span>"+data.name+"</span>";
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
function editRowNew(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id+'&moduleType='+moduleType;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id+'&moduleType='+moduleType;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
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




function syncBaseData(){
	var dlg = art.dialog({
		content: $("#syncdiv")[0],
		ok:function(){
			var syncval = $("input[name='synctype']:checked").val();
			if(syncval){
				artDialog.confirm("确定进行同步吗？",function(){ 				
				
				Loading.init(null, '数据同步中，请耐心等候......');				
				$.post(getPath()+"/basedata/basesync/loadSyncData",{synctype:syncval},function(data){
					if(data.STATE=='SUCCESS'){
						art.dialog.tips(data.MSG);					
					}else{
						art.dialog.alert(data.MSG);
					}
					Loading.close();
				},'json');
				
				});
			}else{
				art.dialog.tips("请选择一项");
			}
		},
		cancelVal:'关闭',
		cancel:true
		});
	}
			

