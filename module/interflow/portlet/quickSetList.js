$list_addUrl = getPath()+"/interflow/quickSet/add";//新增url
$list_editUrl = getPath()+"/interflow/quickSet/edit";//新增url
$list_deleteUrl = getPath()+"/interflow/quickSet/delete";//新增url
$list_editWidth = "520px";
$list_editHeight = "270px";
$(document).ready(function(){
	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '菜单', name: 'menuName', align: 'left', width: 320},
            {display: '岗位', name: 'jobName', align: 'left', width: 320},
            {display: '操作', name: 'creator.name', align: 'center', width: 180,render:operate}
        ],
        parms:{},
        url:getPath()+'/interflow/quickSet/listData'
    }));
});

function operate(data){
	var str = '<a href=javascript:setJob(\''+data.id+'\');>配置</a>';
	str+='|<a href=javascript:editRow({id:\''+data.id+'\'});>修改</a>';
	str+='|<a href=javascript:deleteRow({id:\''+data.id+'\'});>删除</a>';
	return str;
}

function setJob(id){
	var dlg = art.dialog.open(getPath()+"/interflow/quickSet/setJobPage?id="+id,{
		title:'选择岗位',
		 lock:true,
		 width:'520px',
		 height:'270px',
		 id:"selectJob",
		 close:function(){
			 resetList();
		 },
		 button:[{name:'确定',callback:function(){
			 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
				 dlg.iframe.contentWindow.saveEdit(dlg);
			 }
				return false;
			}},{name:'取消',callback:function(){
				return true;
			}}]
	});
}