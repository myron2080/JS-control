$list_editUrl = getPath()+"/hr/person/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/person/add";//新增url
$list_deleteUrl = getPath()+"/hr/person/delete";//删除url
//$list_editWidth = "650px";
//$list_editHeight = "400px";
$list_editWidth = "952px";

$list_editHeight = ($(window).height()-150)+"px";
$list_dataType = "职员";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/hr/person/treeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	var items = [];
    if($("#addPersonFlag").val()=='Y'){
    	items.push({id:'add',text:'新增',click:addRow,icon:'add'});
    }				
	var permissionContent = {id:'permission',text:'批量授权',click:permissionManager,icon:'calendar'};
	if($("#hasPermission").val() && ("true" == $("#hasPermission").val())){	//如果有权限
		items.push(permissionContent);
	}
	$("#toolBar").ligerToolBar({
		items:items
		});
	$("#toolBar").append(
		' <div style="padding-top:5px;display:inline;"><label id="includeContainer"><input type="checkbox" name="includeChild" id="includeChild" checked="checked" />包含下级</label></div>'
		+' <div style="padding-top:5px;display:inline;"><label id="disabledContainer">用户状态:<select name="status" id="status"><option value="">全部</option><option value="ENABLE">启用</option><option value="DISABLED">禁用</option></select></label></div>'
		+'<div style="float:right;padding-right:50px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" style="width:180px;" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码/身份证号/职位" defaultValue="名称/编码/身份证号/职位" value="名称/编码/身份证号/职位" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	initDelayTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '工号', name: 'number', align: 'left', width: 80},
            {display: '姓名', name: 'name', align: 'left', width: 70},
            {display: '组织', name: 'personPosition.position.belongOrg.name', align: 'left', width: 120},
            {display: '职位', name: 'personPosition.position.name', align: 'left', width: 100},
            {display: '职级', name: 'personPosition.jobLevel.name', align: 'left', width: 100},
            {display: '入职日期', name: 'innerDate', align: 'left', width: 80},
            {display: '用户状态', name: 'status.name', align: 'center', width: 60},
            {display: '职员维护', name: 'operate', align: 'center', width: 80,render:operateRender,isSort:false},
            {display: '用户维护', name: 'operate', align: 'center', width: 150,render:userOperateRender,isSort:false}
        ],
        url:getPath()+'/hr/person/listData',
        delayLoad:true,
        enabledSort:true
    }));
	$('#includeContainer').bind('click',searchData);
	
	$('#status').bind('change',function(){
		searchData();
	});
});

function permissionManager(){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem('assignUserPermission',getPath()+'/permission/personPermission/list','职员权限');
	}
}

function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
}

function userOperateRender(data){
	var e = (data.status.name=='启用'?'DISABLED':'ENABLE');
	var t = (data.status.name=='启用'?'禁用':'启用');
	var str = '<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>';
	if($("#hasPermission").val() && ("true" == $("#hasPermission").val())){	//如果有权限
		str += '|<a href="javascript:personPermission({id:\''+data.id+'\'});">权限设置</a>';
		str += '|<a href="javascript:editUser({id:\''+data.id+'\'});">登录设置</a>';
	}
	return  str;
}

function viewRow(rowData){
	art.dialog.open(getPath()+"/hr/person/view"+"?id="+rowData.id,
			{title:getTitle('VIEW'),
			lock:true,
			width:$list_editWidth||'auto',
			height:$list_editHeight||'auto',
			id:$list_dataType+'-VIEW',
			button:[{name:'关闭'}]}
	);
}

function personPermission(person){
	art.dialog.open(getPath()+"/permission/personPermission/singlePersonPermission?person="+person.id,{
		title:'权限设置',
		lock:true,
		width:'800px',
		height:'480px',
		id:"personPermission",
		button:[{name:'确定'}]
	});
}

function viewUser(user){
	var u = getPath()+"/permission/user/edit";
	var paramStr = '?VIEWSTATE=VIEW&id='+user.id;
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:"用户-查看",
		 lock:true,
		 width:'580px',
		 height:'250px',
		 id:"user-VIEW",
		 button:[{name:'确定'}]
		});
}

function editUser(user,state){
		var u = getPath()+"/permission/user/edit";
		var paramStr = '?VIEWSTATE=EDIT&id='+user.id;
		var flag = true;
		var dlg = art.dialog.open(u+paramStr,
			{title:"用户-编辑",
			 lock:true,
			 width:'580px',
			 height:'250px',
			 id:"user-EDIT",
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

function enableRow(config){
	$.post(getPath() + '/permission/user/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
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
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if($('#status').val() == '' || $('#status').val() == undefined){
			delete $list_dataParam['status'];
			$list_dataParam['orgLongNumber']=selectNodes[0].longNumber;
			$list_dataParam['includeChild']=true;
			
		}else{
			$list_dataParam['orgLongNumber']=selectNodes[0].longNumber;
			$list_dataParam['includeChild']=true;
			$list_dataParam['status'] = $('#status').val();
		}
		
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['orgLongNumber'];
	}
	//不查离职人员 jobStatusNotIn=1
	$list_dataParam['jobStatusNotIn'] = 1;
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
	
	if($('#includeDisabled:checked').attr('checked') == true || $('#includeDisabled:checked').attr('checked') == 'checked'){
		$list_dataParam['includeDisabled'] = true;
	}else{
		delete $list_dataParam['includeDisabled'];
	}
	//根据组织和长编码排序
	$list_dataParam['sortname'] = 'longNumberAndPost';
	$list_dataParam['sortorder'] = 'asc';
	resetList();
}