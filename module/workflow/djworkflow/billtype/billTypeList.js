$list_editWidth = "470px";
$list_editHeight = "160px";
$list_dataType = "单据类型";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/param/simpleTreeData";
$list_nodeSetUrl= getPath()+"/djworkflow/nodeDefi/list";//节点设置
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$("#toolBar").ligerToolBar({
		//items:[{id:'add',text:'新增',click:beforeAddRow,icon:'add'}]
		});
	/*在toolBar中的查询功能*/
	$("#toolBar").append(
			'<div style="float:left;padding-left:5px;display:inline;">'
	    	+'	<form onsubmit="searchData();return false;">'	
		    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="单据编号/单据名称" defaultValue="单据编号/单据名称" value="单据编号/单据名称" id="searchKeyWord" class="input"/>'
		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
	    	+'	</form>'
	    	+'</div>'
		);
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '单据编号', name: 'number', align: 'left', width: 100},
            {display: '单据名称', name: 'name', align: 'left', width: 120},
            {display: '单据描述', name: 'description', align: 'left', width: 100},
            {display: '使用流程', name: 'processDefinition.processModel', align: 'left', width: 200,render:modelRender},
            {display: '版本号', name: 'version', align: 'right', width: 50},
            {display: '流程资源', name: 'resourceName', align: 'left', width: 150,render:function(data){
            	return '<a href="javascript:void(0)" onclick="viewResource(\''+data.deploymentId+'\',\'xml\')">'+data['resourceName']+'</a>';
            }},
            {display: '流程图', name: 'diagramResourceName', align: 'left', width: 150,render:function(data){
            	return '<a href="javascript:void(0)" onclick="viewResource(\''+data.deploymentId+'\',\'image\')">'+data['diagramResourceName']+'</a>';
            }},
            {display: '配置', name: 'operate', align: 'center', width: 190,render:operateRender}
        ],
        url : getPath()+ '/djworkflow/billtype/listData',     
        delayLoad:true
    }));
});

function viewResource(id,type){
	if(type == 'image'){
		art.dialog.open(getPath()+"/workflow/repository/resource?id="+id+"&type="+type,{
			title:'流程资源',
			lock:true,
			width:"800px",
			height:"560px",
			id:"definitionResource",
			button:[
			        {
			        	name:'关闭'
			        }
			]
		});
	}else{
		window.open('','_self'); 
		var newWin = window.open(getPath()+"/workflow/repository/resource?id="+id+"&type="+type,'流程资源','top=0,left=0,scrollbars=no,resizable=no,toolbar=no,location=no');
		var width = '800px';
		var height = '600px';
		newWin.resizeTo(width,height);
		newWin.focus();
	}
}

//渲染流程模型
function modelRender(data,filterData){
	var rendderStr ="";
	if(data.processDefinition){
		if(data.processDefinition.processModel=="ACTIVITY"){
			rendderStr = "Activity流程";
		}else if(data.processDefinition.processModel=="DINGJIAN"){
			rendderStr =  "鼎尖流程";
		}
		return rendderStr+"("+data.processDefinition.name+")";
	}
		return rendderStr;
}
//操作渲染
function operateRender(data,filterData){
		var proId="" ;
		var operateStr="";
		if(data.processDefinition){ 
			proId=data.processDefinition.id;
			operateStr = '|<a href="javascript:nodeSet(\''+proId+'\');">节点设置</a>';}
	return '<a href="javascript:proDefin(\''+data.id+'\',\''+proId+'\');">配置</a>'+operateStr;
			
}

function nodeSet(proId){
	var flag=true;
	var dlg = art.dialog.open($list_nodeSetUrl+"?processId="+proId+"&processType=APPROVAL",
			{title:"节点设置",
			 lock:true,
			 width:"800px",
			 height:"400px",
			 id:'processNoteSet',
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterAddRow)=='function'){
						 afterAddRow();
					 }
					 resetList();
				 }
			 }
			});
}
function proDefin(billTypeId,proId){
	var paramStr = '?VIEWSTATE=ADD&billTypeId='+billTypeId;
	var url = getPath()+"/djworkflow/proDefi/add";
	if(proId!=""){
		url = getPath()+"/djworkflow/proDefi/edit";
		paramStr = '?VIEWSTATE=EDIT&id='+proId;
	}	
	var flag = true;
	var dlg = art.dialog.open(url+paramStr,
		{title:" 流程-编辑",
		 lock:true,
		 width:'480px',
		 height:'180px',
		 id:"prodefin-EDIT",
		 button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit();
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
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if(selectNodes[0].children==undefined){
			$list_dataParam['isModuleType']='FALSE';
		}else{
			$list_dataParam['isModuleType']='TRUE';
		}
		$list_dataParam['moduleType']=selectNodes[0].id;
		moduleType=selectNodes[0].id;
	}else{
//		delete $list_dataParam['isModuleType'];
//		delete $list_dataParam['moduleType'];
	}
	
	searchData();
}

function beforeAddRow(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	
	
	
	$list_dataParam['moduleType']=selectNodes[0].id;
	
	if(node==null || node.length==0 || $list_dataParam['module']==null){
		
		art.dialog.tips('请先在左边选择数据类型!');
		return false;
	}else if($list_dataParam['pid']==null){
		art.dialog.tips('请选择最小节点数。');
		return false;
	}
	addRow({});
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		return {module:node[0].id};
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
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
    }  
}