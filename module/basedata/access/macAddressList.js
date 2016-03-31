$list_editUrl = getPath()+"/basedata/access/address/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/access/address/add";//新增url
$list_deleteUrl = getPath()+"/basedata/access/address/delete";//删除url
$list_editWidth = "560px";
$list_editHeight = "250px";
$list_dataType = "终端许可";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	
	/*$("#toolBar").append(
		'<div style="float:left;padding-left:5px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" style="width:185px;" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="识别码/部门/人员" defaultValue="识别码/部门/人员" value="识别码/部门/人员" id="searchKeyWord" class="input"/>'
	    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
    	+'	</form>'
    	+'</div>'
	);
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRow,icon:'add'}
		]
		});*/
	searchData();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '所属部门', name: 'org.name', align: 'left', width: 120},
            {display: '权限类型', name: 'accessType.name', align: 'left', width: 80},
            {display: '使用人', name: 'person.name', align: 'left', width: 80},
            {display: '终端类型', name: 'terminalType.name', align: 'left', width: 80},
            {display: '状态', name: 'enable', align: 'left', width: 60,render:function(data){
            	return data.enable?"启用":"禁用";
            }},
            {display: '识别码', name: 'mac', align: 'left', width: 120},
            /*{display: 'IP', name: 'ip', align: 'left', width: 120},*/
            {display: '备注', name: 'description', align: 'left', width: 250},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
        url:getPath()+'/basedata/access/address/listData'
    }));
});
function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
			+'<a href="javascript:enable(\''+data.id+'\','+(data.enable?0:1)+');">'+(data.enable?"禁用":"启用")+'</a>|'
			+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}
function enable(id,enable){
	$.post(getPath()+"/basedata/access/address/enable",{id:id,enable:enable},function(res){
		if(res.STATE=='SUCCESS'){
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}