$list_editUrl = getPath()+"/interflow/call/manage/edit";//编辑及查看url
$list_addUrl = getPath()+"/interflow/call/manage/add";//新增url
$list_deleteUrl = getPath()+"/interflow/call/manage/delete";//删除url
$list_editWidth = 360;
$list_editHeight = 160;

$list_dataType = "话务控制";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/interflow/call/manage/treeDataAll";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	 
	initDelayTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '工号', name: 'objectNumber', align: 'left', width: 80},
            {display: '姓名', name: 'objectName', align: 'left', width: 80},
            {display: '状态', name: 'enable', align: 'center', width: 80,render:enableRender},
            {display: '注册号码', name: 'loginNumber', align: 'left', width: 150},
            {display: '操作', name: 'operate', align: 'center', width: 200,render:operateRender}
        ],
        url:getPath()+'/interflow/call/manage/listData',
        delayLoad:true,
        height:"96%",
        usePager:true,
        enabledSort:false
    }));
	
	bindEvent(); 
	searchData();
});

 
/**
 * 绑定事件
 */
function bindEvent(){
	
	//新增
	$("#toAddBtn").bind("click",addRow);
	
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	
	//清空
	$("#resetBtn").click(function(){
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	});
	
	eventFun($("#searchKeyWord"));
	
	inputEnterSearch('searchKeyWord',searchData);
	
}

/**
 * 操作
 * @param data
 * @returns {String}
 */
function operateRender(data){
	 var str = '';
	 if(data.id == null || data.id == ''){
		 str = '<a href="javascript:addCallPerson({id:\''+data.id+'\',objectId:\''+data.objectId+'\'});">开通</a>';
	 }else{
		 str = '<a href="javascript:editCallPerson({id:\''+data.id+'\',objectId:\''+data.objectId+'\'});">修改</a>';
		 str += '<span style="margin-left:5px;"></span>|<span style="margin-left:5px;"></span>' ;
		 str += '<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
		 if(data.enable=='YES'){
			 str += '<span style="margin-left:5px;"></span>|<span style="margin-left:5px;"></span>' ;
			 str += '<a href="javascript:doEnable({id:\''+data.id+'\',type:\'N\'});">禁用</a>';
		 }else{
			 str += '<span style="margin-left:5px;"></span>|<span style="margin-left:5px;"></span>' ;
			 str += '<a href="javascript:doEnable({id:\''+data.id+'\',type:\'Y\'});">启用</a>';
		 }
	 }
	 return  str;
}

/**
 * 开通
 * @param params
 */
function addCallPerson(params){
	$list_addUrl = getPath()+"/interflow/call/manage/add";
	$list_addUrl += "?objectId=" + params.objectId ;
	addRow(params);
}

/**
 * 修改
 * @param params
 */
function editCallPerson(params){
	$list_editUrl = getPath()+"/interflow/call/manage/edit";
	$list_editUrl += "?objectId=" + params.objectId ;
	editRow(params);
}

/**
 * 启用、禁用
 * @param params
 */
function doEnable(params){
	$.post(getPath()+'/interflow/call/manage/doEnable',{
		id:params.id,
		type:params.type
	},function(res){
		if(res && res.STATE == 'SUCCESS'){
			art.dialog.tips("操作成功");
			searchData();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

/**
 * 启用、禁用
 * @param data
 */
function enableRender(data){
	var enable = data.enable ;
	if(enable == 'YES'){
		return '启用' ;
	}else if(enable == 'NO'){
		return '禁用';
	}
	return '未开通';
}
/**
 * 树节点点击
 * @param event
 * @param treeId
 * @param treeNode
 */
function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
/**
 * 查询
 */
function searchData(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		$list_dataParam['orgLongNumber']=selectNodes[0].longNumber;
		$list_dataParam['includeChild']=true;
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['orgLongNumber'];
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

/**
 * 删除行
 * @param rowData
 */
function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		var cfDlg = art.dialog.confirm('是否删除此用户呼叫权限',function(){
			art.dialog({
				title:'删除',
				content:'是否彻底回收该用户的去电号码？（回收之后去电号码将不能再使用，不回收去电号码可分配给他人使用）',
				ok:function(){
					$.post($list_deleteUrl,{id:rowData.id,isCallBack:'YES'},function(res){
						art.dialog.tips(res.MSG);
						if(res.STATE=='SUCCESS'){
							if(typeof(afterDeleteRow)=='function'){
								afterDeleteRow();
							}
							refresh();
						}
					},'json');
					return true;
				},
				okVal:'回收号码',
				cancel:function(){
					$.post($list_deleteUrl,{id:rowData.id,isCallBack:'NO'},function(res){
						art.dialog.tips(res.MSG);
						if(res.STATE=='SUCCESS'){
							if(typeof(afterDeleteRow)=='function'){
								afterDeleteRow();
							}
							refresh();
						}
					},'json');
					return true ;
				},
				cancelVal:'不回收号码'
			});
		});
	}
}