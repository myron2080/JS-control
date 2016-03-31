$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
		items:[
			{id:'add',text:'增加',click:addPermission,icon:'add'},
			{id:'delete',text:'删除',click:deletePermission,icon:'delete'}
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
        url:getPath()+'/permission/user/listData',
        delayLoad:true
    }));
});