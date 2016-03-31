$list_editUrl = getPath()+"/hr/leaveRule/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/leaveRule/add";//新增url
$list_deleteUrl = getPath()+"/hr/leaveRule/delete";//删除url
$list_editWidth = "540px";
$list_editHeight = "280px";
$list_dataType = "请假规则";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
/*	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:beforeAddRow,icon:'add'}]
		});
	//在toolBar中的查询功能
	$("#toolBar").append(
	    '<div style="float:right;padding-right:50px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);*/
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '所属组织', name: 'org.name', align: 'left', width:130},
      			{display: '规则名称', name: 'name', align: 'left', width:130 },
      			{display: '规则描述', name: 'description', align: 'left', width:300 },
      			{display: '状态', name: 'enable', align: 'left', width:80,render:function(data){
                	return data.enable?"启用":"禁用";
                }},
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/hr/leaveRule/listData',
        delayLoad:false
    }));
	//新增
	$("#add").click(function(){
		beforeAddRow();
	});
});

function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
		+'<a href="javascript:enable(\''+data.id+'\','+(data.enable?0:1)+');">'+(data.enable?"禁用":"启用")+'</a>|'
		+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}
function enable(id,enable){
	$.post(getPath()+"/hr/leaveRule/enable",{id:id,enable:enable},function(res){
		if(res.STATE=='SUCCESS'){
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	addRow({});
}


/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//所属组织
	var orgId= $("#orgId").val();

	//查询所属组织
	if(orgId == '' || orgId == null){
		delete $list_dataParam['orgId'];
	} else{
		$list_dataParam['orgId'] = orgId;
	}
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
