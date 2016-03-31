$list_editUrl = getPath()+"/permission/permissionItem/edit";//编辑及查看url
$list_addUrl = getPath()+"/permission/permissionItem/add";//新增url
$list_deleteUrl = getPath()+"/permission/permissionItem/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "300px";
$list_dataType = "权限";//数据名称
$tree_dataType = "权限组";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	

	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
//            {display: '组别', name: 'group.name', align: 'left', width: 120},
            {display: '名称', name: 'name', align: 'left', width: 120,render:nameRender},
            {display: '编码', name: 'number', align: 'left', width: 120},
            {display: '类型', name: 'permissionTypeDesc', align: 'left', width: 120},
            {display: '父权限', name: 'menuPerm.name', align: 'left', width: 120},
            {display: '描述', name: 'description', align: 'left', width: 180},
            {display: '数据来源', name: 'syncType', align: 'left', width: 80,render:resourceRender},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender}
        ],
        url:getPath()+'/permission/permissionItem/listData?isModuleType='+isModuleType+'&moduleType='+moduleType
    }));
});
function resourceRender(data,filterData){
	var imgDis =   '';
	if(data.syncType=='CLOUD'){
		imgDis = '云端';
	}else{
		imgDis = '本地';
	}
	return imgDis;
}
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

//function searchData(){
//	var kw = $('#searchKeyWord').val();
//	kw = kw.replace(/^\s+|\s+$/g,'');
//	$('#searchKeyWord').val(kw);
//	if(kw==$('#searchKeyWord').attr('defaultValue')){
//		kw='';
//	}
//	if(kw==null || kw == ''){
//		delete $list_dataParam['key'];
//	}else{
//		$list_dataParam['key'] = kw;
//	}
//	resetList();
//}