$list_editUrl = getPath()+"/basedata/person/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/person/add";//新增url
$list_editWidth = "740px";
$list_editHeight = "400px";
$list_dataType = "职员";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRow,icon:'add'}
			]
		});
	$("#toolBar").append(
		 '<div style="float:right;padding-right:50px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '工号', name: 'number', align: 'left', width: 80},
            {display: '姓名', name: 'name', align: 'left', width: 70},
            {display: '手机号', name: 'phone', align: 'left', width: 120},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender}
        ],
        url:getPath()+'/basedata/person/simpleListData'
    }));
});
function operateRender(data,filterData){
		return '<a href="javascript:viewRow({id:\''+data.id+'\'});">查看</a>|'
			+'<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
}