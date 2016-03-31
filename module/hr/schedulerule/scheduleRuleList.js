$list_editUrl = getPath()+"/hr/scheduleRule/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/scheduleRule/add";//新增url
$list_deleteUrl = getPath()+"/hr/scheduleRule/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "150px";
$list_dataType = "排班设置";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '所属组织', name: 'org.name', align: 'left', width:130},
      			{display: '创建人', name: 'creator.name', align: 'left', width:130},
      			{display: '创建时间', name: 'createTime', align: 'left', width:130 },
      			{display: '更新人', name: 'updator.name', align: 'left', width:130 },
      			{display: '最后更新时间', name: 'lastUpdateTime', align: 'left', width:130 },
      			{display: '状态', name: 'enable', align: 'left', width:80,render:function(data){
                	return data.enable?"启用":"禁用";
                }},
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/hr/scheduleRule/listData',
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
	$.post(getPath()+"/hr/scheduleRule/enable",{id:id,enable:enable},function(res){
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
		$list_dataParam['searchOrgId'] = orgId;
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
