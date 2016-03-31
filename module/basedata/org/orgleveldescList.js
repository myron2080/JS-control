$list_editUrl = getPath()+"/basedata/orgleveldesc/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/orgleveldesc/add";//新增url
$list_deleteUrl = getPath()+"/basedata/orgleveldesc/delete";//删除url
$list_editWidth = "300px";
$list_editHeight = "150px";
$list_dataType = "组织级别";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '级别',name:'seq',align:'center',width:100}
        ],
        url:getPath()+'/basedata/orgleveldesc/listData'
    }));
});

function operateRender(data,filterData){
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a> | '
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});" >删除</a>  ';
}