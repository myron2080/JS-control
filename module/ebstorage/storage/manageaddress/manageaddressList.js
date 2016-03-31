$list_deleteUrl = getPath()+"/permission/jobPermission/delete";//删除url
$list_editUrl = getPath() + '/ebstorage/storage/edit';
$tree_container = "leftTree";
$tree_async_url = getPath()+"/ebbase/address/simpleTreeData";
$tree_container_job = "leftTree_job";
$tree_async_url_job = getPath()+"/ebstorage/storage/simpleTreeData2";
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
	$("#main").ligerLayout({leftWidth:200,rightWidth:rw,centerWidth:150,allowCenterCollapse:true,allowLeftResize:true,allowLeftResize:true,allowRightCollapse:true});
	$("#leftTree_job").height($("#main").height()-20);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate1',text:'定位',click:function(){
			var name = $('#locate1').val().trim();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	$("#leftToolBar_job").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val().trim();
			treeLocate('leftTree_job','name',name);
			},icon:'locate'}
		]
	});
	$("#leftToolBar").ligerToolBar({
		items:[]
		});

	$('#includeContainer').bind('change',searchData);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            
	        {display: '状态', name: 'operate', align: 'center', width: 130,render : operateRender},
            {display: '地址', name: 'fullName', align: 'left', width: 300,render : isEnableRender},
            {display: '仓库', name: 'storageName', align: 'left', width: 130},//,render : addressun
            {display: '仓库负责人', name: 'personName', align: 'left', width: 130,render : updateRender}
        ],
        checkbox:true,
        delayLoad:true,
        url:getPath()+'/ebbase/address/listStorageData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showDetailData(rowData);
        }
    }));
	initSimpleDataTree_job();
});

function isEnableRender(data){
	var str = data.fullName ;
	if(data.fullName != null && data.fullName != ""){
		if(data.isEnable == 0){
			str += '  ' + '<a style=\"color:blue\" href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a>';
		}else{
			str += '  ' +  '<a style=\"color:blue\" href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
		}
	}
	return str;
}

/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/ebbase/address/onOff', {
				id : data.id,
				isEnable : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/ebbase/address/onOff', {
				id : data.id,
				isEnable : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} 
}

function updateRender(data){
	var str = data.personName;
	if(data.personName != null && data.personName != ""){
		str += '   ' +'<a href="javascript:editRow({id:\'' + data.storageInAddressId + '\',id2:\''+data.org.id+'\'});">编辑</a>';
	}
	return str;
}

//编辑行
function editRow(rowData){
	//判断是否有编辑权限
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			if(rowData.id == "" || rowData.id == null){
				paramStr = '&VIEWSTATE=EDIT&id='+rowData.id2;
			}else{
				paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
			}
		}else{
			if(rowData.id == "" || rowData.id == null){
				paramStr = '?VIEWSTATE=EDIT&id='+rowData.id2;
			}else{
				paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:"612px",
				 height:"350px",
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

function nameRender(data,filterData){
	if(data.permissionItem&&data.permissionItem.permissionType=='EFFECT') 
		return "<span style='margin-left:20px;'>"+data.permissionItem.name+"</span>";
	return "<span>"+data.permissionItem.name+"</span>";
}


function deleteAddress(){
	var rows = $list_dataGrid.getSelectedRows();
	if(rows.length>0){
		var ids = '';
		for(var i = 0; i < rows.length; i++){
			ids += rows[i].id;
			if(i < rows.length - 1){
				ids += ';';
			}
		}
		$.post(getPath()+'/storage/storageInAddress/removeAddressByNumber',{ids:ids,storageId:id},function(res){
			if(res.STATE == "SUCCESS"){
				searchData();
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');

	}else{
		art.dialog.tips('请先选择需要取消绑定的地址');
	}

}
function saveEdit(){
	var selectNodes = $list_dataGrid.getSelectedRows();
	if(selectNodes && selectNodes.length > 0){
		var ids = '';
		for(var i = 0; i <selectNodes.length; i++){
			ids += selectNodes[i].id;
			if(i < selectNodes.length - 1){
				ids += ';';
			}
		}
		$.post(base +'/storage/storageInAddress/saveAddressByNumber',
				{ids:ids,storageId:id},function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					if(res.MSG==1){//最明细的仓库才允许地址绑定的操作
						
						var title = "解绑地址且新增仓库";
						var url = base + "/storage/storageInAddress/addStorage/"+id+"?ids="+ids;
						var flag = true;
						var dlg = art.dialog.open(url,{
							 title: title,
							 lock:true,
							 width:"500px",
							 height:"200px",
							 id:"editInStorage",
							 button:[{name:'绑定',callback:function(){
									if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
										dlg.iframe.contentWindow.saveEdit(dlg);
									}
									return false;
								}},{name:'取消',callback:function(){
									flag = false;
									return true;
								}}],
							 close:function(){
								 if(flag){
										var str_url=base+"/ebstorage/storage/manageaddress/list";
										window.location.href=str_url;
//									 refresh();
								 }
							 }
						});
						
					}else{
						searchData();
						art.dialog({
							content: res.MSG,
							time:1,
							close:function(){
								art.dialog.close();
							},
							width:200
						});
					}
				}else{
					art.dialog.close();
				}
			}else{

				art.dialog.tips(res.MSG);
			}
	    },'json');
    }else{
		art.dialog.tips('请先选择需要确定绑定的地址');
	}
}
var i=0;
function initSimpleDataTree_job(){
	$.post($tree_async_url_job,{},function(treeData){
		var tree = $.fn.zTree.init($("#"+$tree_container_job), {
			async: {
				enable: false
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					if(typeof(onTreeNodeClick_job) == "function"){
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
					rootPId: ""
				}
			}
		},treeData);
		var nodes = tree.getNodes();
		if(nodes && nodes.length > 0){
			tree.expandNode(nodes[0], true, false, true);
				tree.selectNode(nodes[0]);
				if(i==0){

					initSimpleDataTree();
					//initDelayTree();
					i++;
				}
		}
		if(searchData){
			searchData();
		}
	},'json');
}
/**
 * 初始化树(延迟加载方式)
 * @returns
 */
var addre="";
function initDelayTree(){
	 addre=$.fn.zTree.init($("#"+$tree_container), {
		async: {
			enable: $tree_async_enable,
			url:$tree_async_url,
			autoParam:$tree_async_autoParam,
			dataFilter: $tree_async_dataFilter
		},
		view:{
			selectedMulti:$tree_view_selectedMulti
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
		}
	});

	
}
function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

function onTreeAsyncSuccess(event, treeId, node, msg){
	 console.log("test");
	 var nodes = addre.getNodes();
		if(nodes && nodes.length > 0){
			addre.expandNode(nodes[0], true, false, true);
			addre.selectNode(nodes[0]);
		}
//	 $("#leftTree_1_switch").click();
//	 $("#leftTree_1_a").click();
	}
function searchData(){

	var tree = $.fn.zTree.getZTreeObj("leftTree_job");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes!=null && selectNodes!=""){
		id=selectNodes[0].sid;
	}
	
	tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes ="";
	if(tree!=null && tree!=""){
		selectNodes=tree.getSelectedNodes();
	}
	//console.log(selectNodes[0].longNumber+"test"+zongcangid);
	if(selectNodes.length>0){
		delete $list_dataParam['id'];
		$list_dataParam['longNumber'] = selectNodes[0].longNumber;
		/* 如果选择，就淡定显示底部数据*/
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){

			$list_dataParam['start'] = "1";
		 }else{
				delete $list_dataParam['start'];
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
	var workUnit = $("#startagestart").val();
	if(workUnit==null || workUnit == ''){
		delete $list_dataParam['startagestart'];
	}else{
		$list_dataParam['startagestart'] = workUnit;
		if(workUnit==3){

			$list_dataParam['bfstorageid'] = id;
		}
	}
	resetList();
}
function onTreeNodeClick_job(event, treeId, treeNode){
//	var tree = $.fn.zTree.getZTreeObj("leftTree_job");
//	var selectNodes = tree.getSelectedNodes();
//	console.log("t");
//	if(i==0){
//	  initSimpleDataTree();
//	  }else{

			searchData();
//	  }

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
				tree.expandNode(nodes[i], true, false, true);
				tree.selectNode(nodes[0]);
			} 
		}
		if(searchData){
			searchData();
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

function operateRender(data,filterData){
	 var res ='';
		if(data.storageInAddressId==null || data.storageInAddressId==""){
			res="未绑定";
		}
		else if(id==data.storageInAddressId){

			res="<font color='red'>本仓库绑定</font>";
		}
		else{

			res="<font color='red'>其他仓库绑定</font>";
		}
		return res;
}

function onEmpty() {
	delete $list_dataParam['key'];
	delete $list_dataParam['startagestart'];
	$("#startagestart option:first").prop("selected", 'selected');
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
	$("[name='includeChild']").removeAttr("checked");
	searchData();
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
function showDetailData(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.storageInAddressId;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.storageInAddressId;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:'612px',
				height:'160px',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}