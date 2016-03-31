$list_deleteUrl = getPath()+"/permission/jobPermission/delete";//删除url
$tree_container = "leftTree";
$tree_async_url = getPath()+"/permission/jobPermission/simpleTreeData";
$tree_container_job = "leftTree_job";
$tree_async_url_job = getPath()+"/permission/jobPermission/simpleTreeData_job";
var leftGrid;
var jobId;
$(document).ready(function(){
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
	var w = $(window).width();
	var rw = w-400;
	$("#main").ligerLayout({leftWidth:200,rightWidth:rw,centerWidth:150,allowCenterCollapse:true,allowLeftResize:false,allowLeftResize:false,allowRightCollapse:false});
	$("#leftTree_job").height($("#main").height()-20);
	$("#leftToolBar_job").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	$("#leftToolBar").ligerToolBar({
		items:[]
		});
	/*$("#leftToolBar").append(
		'<div style="float:left;padding-left:5px;display:inline;">'
    	+'	<form onsubmit="searchLeftData();return false;">'	
	    +'		<input type="text" name="leftSearchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="leftSearchKeyWord" class="input"/>'
	    +'		<b class="btn bluebtn"><a onclick="searchLeftData();return false;" href="javascript:void(0)">查询</a></b>'
    	+'	</form>'
    	+'</div>'
	);*/
	
	/*$("#toolBar").append(
		'<div style="float:left;padding-left:5px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<li class="bluebtn btn"><a onclick="searchData();return false;" href="javascript:void(0)"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</a></li>'
    	+'	</form>'
    	+'</div>'
	);
	$("#toolBar").ligerToolBar({
		items:[
		    //  {id:'add',text:'增加',click:addPermission,icon:'add'},
		    {id:'add',text:'增加',click:viewPermission,icon:'add'},
		      {id:'delete',text:'删除',click:deletePermission,icon:'delete'}
		    ]
		});
	
	/*leftGrid = $("#leftGridContainer").ligerGrid($.extend({},$list_defaultGridParam,{
	      columns: [ 
	              {display: '岗位', name: 'name', align: 'left', width: 125},
	              //{display: '所属公司', name: 'cu.name', align: 'left', width: 140}
	              //{display: '描述', name: 'description', align: 'left', width: 140}
	          ],
          url:getPath()+'/basedata/job/listData?pageSize=1000',
          pageSize: 1000, 
          usePager:false,
          onSelectRow:function(data){
        	  $list_dataParam['job']=  data.id;
        	  jobId=data.id;
        	  delete $list_dataParam['isModuleType'];
        	  delete $list_dataParam['moduleType'];
        	  var tree = $.fn.zTree.getZTreeObj("leftTree");
        	 // tree.cancelSelectedNode();
        	  initSimpleDataTree();
        	  resetList();
          }
    }));*/
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            //{display: '类型', name: 'permissionItem.group.name', align: 'left', width: 120},
            {display: '名称', name: 'permissionItem.name', align: 'left', width: 120,render:nameRender},
            {display: '编码', name: 'permissionItem.number', align: 'left', width: 100},
            {display: '类型', name: 'permissionItem.permissionTypeDesc', align: 'left', width: 100}, 
            {display: '是否授权', name: 'id', align: 'left', width: 80,render:function(data){
            	if(data.id)return '<span style="color:red;">已授权</span>';
            	else return '未授权';
            	
            }},
            {display: '操作', name: 'operate', align: 'center', width: 80,render:operateRender},
            {display: '描述', name: 'permissionItem.description', align: 'left', width: 220}
        ],
        checkbox:true,
        delayLoad:true,
        url:getPath()+'/permission/jobPermission/listPMData'
    }));
	initSimpleDataTree_job();
});

function nameRender(data,filterData){
	if(data.permissionItem&&data.permissionItem.permissionType=='EFFECT') 
		return "<span style='margin-left:20px;'>"+data.permissionItem.name+"</span>";
	return "<span>"+data.permissionItem.name+"</span>";
}

function initSimpleDataTree_job(){
	$.post($tree_async_url_job,{},function(treeData){
		var tree = $.fn.zTree.init($("#"+$tree_container_job), {
			async: {
				enable: false
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					if(typeof(onTreeNodeClick) == "function"){
						onTreeNodeClick_job(event, treeId, treeNode);
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
			if(nodes[0].children!=undefined){
				var children=nodes[0].children;
				tree.selectNode(children[0]);
			}else{
				tree.selectNode(nodes[0]);
			}
			onTreeNodeClick_job(null,null,null);
		}
		if(searchData){
			searchData();
		}
	},'json');
}
//start
function onTreeNodeClick(event, treeId, treeNode){
	//$list_dataParam['moduleType']=  treeNode.id;
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
//	delete $list_dataParam['isModuleType'];
//  delete $list_dataParam['moduleType'];
	}
	if(selectNodes[0].id=="ALL"){
		delete $list_dataParam['isModuleType'];
		delete $list_dataParam['moduleType'];
	}
	resetList();
}
function onTreeNodeClick_job(event, treeId, treeNode){
	//$list_dataParam['moduleType']=  treeNode.id;
	var tree = $.fn.zTree.getZTreeObj("leftTree_job");
	var selectNodes = tree.getSelectedNodes();
	/*if(selectNodes.length>0){
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
//	delete $list_dataParam['isModuleType'];
//  delete $list_dataParam['moduleType'];
	}
	if(selectNodes[0].id=="ALL"){
		delete $list_dataParam['isModuleType'];
		delete $list_dataParam['moduleType'];
	}
	resetList();*/
	var tree = $.fn.zTree.getZTreeObj("leftTree_job");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes[0].children==undefined){
	  $list_dataParam['job']= selectNodes[0].id;
	  jobId=selectNodes[0].id;
	  delete $list_dataParam['isModuleType'];
	  delete $list_dataParam['moduleType'];
	  var tree = $.fn.zTree.getZTreeObj("leftTree");
	 // tree.cancelSelectedNode();
	  initSimpleDataTree();
	  resetList();}
}

function initSimpleDataTree(){
	$.post($tree_async_url,{job:jobId},function(treeData){
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
//end


function viewPermission(){
	art.dialog.open(getPath()+'/permission/jobPermission/jobPermissionEdit?job='+jobId,{
		 title:"权限设置",
		 lock:true,
		 width:"1000px",
		 height:($(window).height()-200),
		 id:"jobPermissionEdit",
		 button:[{name:'确定'}]
	});
}


function addPermission(){
	if(leftGrid && leftGrid.getSelectedRow()){
		openDataPicker('permissionItem');
	}else{
		art.dialog.tips('请先选择岗位');
	}
}

function selectPermission(oldValue,newValue,doc){
	if(newValue && newValue.length > 0){
		var ps = '';
		for(var i = 0; i < newValue.length; i++){
			ps += newValue[i].id;
			if(i < newValue.length - 1){
				ps += ';';
			}
		}
		$.post(getPath()+'/permission/jobPermission/saveJobPermission',{permissions:ps,job:leftGrid.getSelectedRow().id},function(res){
			art.dialog.tips(res.MSG);
			resetList();
		},'json');
	}
}

function deletePermission(){
	var rows = $list_dataGrid.getSelectedRows();
	if(rows.length>0){
		for(var i = 0; i < rows.length; i++){
			if(!rows[i].id){
				art.dialog.tips('请选择已授权的行');
				return;
			}
		}
		art.dialog.confirm('确定删除这些数据吗?',function(){
			var ids = '';
			for(var i = 0; i < rows.length; i++){
				ids += rows[i].id;
				if(i < rows.length - 1){
					ids += ';';
				}
			}
			$.post(getPath()+'/permission/jobPermission/deleteBatch',{ids:ids},function(res){
				art.dialog.tips(res.MSG);
				refresh();
			},'json');
		});
	}else{
		art.dialog.tips('请先选择需要删除的行');
	}
}
function setPermission(){
	var rows = $list_dataGrid.getSelectedRows();
	if(rows.length>0){
		for(var i = 0; i < rows.length; i++){
			if(rows[i].id){
				art.dialog.tips('请选择未授权的行');
				return;
			}
		}
		art.dialog.confirm('确定授权吗?',function(){
			var ids = '';
			var jobid = '';
			for(var i = 0; i < rows.length; i++){
				jobid = rows[i].job.id;
				ids += rows[i].permissionItem.id;
				if(i < rows.length - 1){
					ids += ';';
				}
			}
			$.post(getPath()+'/permission/jobPermission/saveJobPermission',{permissions:ids,job:jobid},function(res){
				art.dialog.tips(res.MSG);
				refresh();
			},'json');
		});
	}else{
		art.dialog.tips('请先选择需要授权的行');
	}
}
function operateRender(data,filterData){
		var html = '';
		if(data.id) html += '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
		else html += '<a href="javascript:void(0);"  onclick="addPmRow({jobid:\''+(data.job?data.job.id:'')+'\',pmid:\''+data.permissionItem.id+'\'})">授权</a>';
		return  html;
}

function addPmRow(obj){
	if(!obj.jobid) return;
	$.post(getPath()+"/permission/jobPermission/saveJobPermission",{permissions:obj.pmid,job:obj.jobid},function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}

$leftGrid_param = {};
function searchLeftData(){
	var kw = $('#leftSearchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#leftSearchKeyWord').val(kw);
	if(kw==$('#leftSearchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $leftGrid_param['key'];
	}else{
		$leftGrid_param['key'] = kw;
	}
	leftGrid.setOptions({
		parms:$leftGrid_param
	});
	leftGrid.loadData();
	leftGrid.changePage('first');
}