$list_editUrl = getPath()+"/permission/user/edit";//编辑及查看url
$list_addUrl = getPath()+"/permission/user/add";//新增url
$list_editWidth = "580px";
$list_editHeight = "250px";
$list_dataType = "用户";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
		items:[
			/*{id:'add',text:'编辑',click:editRow,icon:'modify'},*/
			{id:'assignRole',text:'用户权限管理',click:assignUserPermission,icon:'modify'}
		]
		});
	$("#toolBar").append(
			'<div style="float:right;padding-right:50px">'
	    	+'	<form onsubmit="searchData();return false;">'	
	    	+'	<table><tr>'
	    	+'	<td>'
	        +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="用户名" defaultValue="用户名" value="用户名" id="searchKeyWord" class="input"/>'
	    	+'	</td>'
		    +'		<td>'
		    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
	    	+'	</td></tr></table></form>'
	    	+'</div>'
		);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '用户名', name: 'userName', align: 'left', width: 80},
            {display: '员工编码', name: 'number', align: 'left', width: 80},
            {display: '姓名', name: 'name', align: 'left', width: 80},
            {display: '状态', name: 'status', align: 'center', width: 120},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender}
        ],
        url:getPath()+'/permission/user/listData'
    }));
});

function assignUserPermission(){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem('assignUserPermission',getPath()+'/permission/personPermission/list','用户权限');
	}
}

function operateRender(data,filterData){
	var e = (data.status.name=='启用'?'DISABLED':'ENABLE');
	var t = (data.status.name=='启用'?'禁用':'启用');
	return '<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>|'
		+'<a href="javascript:viewRow({id:\''+data.id+'\'});">查看</a>|'
		+'<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
}
function enableRow(config){
	$.post(getPath() + '/permission/user/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}