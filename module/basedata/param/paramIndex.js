$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/param/simpleTreeData";
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
});

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
	resetList();
	chooseTab(moduleType,isModuleType,tabKey);
}



function  chooseTab(moduleType,isModuleType,key){
	var srcUrl = "";
	if(key=="PARAMSET"){
		tabKey = "PARAMSET";
		srcUrl = getPath()+"/basedata/param/list?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}else if(key=="BILLTYPE"){
		tabKey = "BILLTYPE";
		srcUrl = getPath()+"/basedata/billType/list?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}else if(key=="CODERULE"){
		tabKey = "CODERULE";
		srcUrl = getPath()+"/basedata/code/list?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}else if(key=="PERMISSION"){
		tabKey = "PERMISSION";
		srcUrl = getPath()+"/permission/permissionItem/list?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}else if(key=="PRINTCONFIG"){
		tabKey = "PRINTCONFIG";
		srcUrl = getPath()+"/basedata/printConfig/list?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}else if(key=="APICENTER"){
		tabKey = "APICENTER";
		srcUrl = getPath()+"/basedata/apiCenter/list?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}
	$("#homeIframe").attr("src",srcUrl);
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
			

