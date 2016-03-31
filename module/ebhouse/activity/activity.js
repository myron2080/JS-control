$list_addUrl = getPath()+"/ebhouse/activity/add";//新增url
$list_editUrl = getPath()+"/ebhouse/activity/edit";//编辑url
$list_editWidth = "300px";
$list_editHeight = "130px";

$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	    columns: [ 
	        {display: '类型名称', name: 'name', align: 'left', width: 80},
	        {display: '单价', name: 'priceForMoney', align: 'left', width: 90},
	        {display: '原价', name: 'opriceForMoney', align: 'left', width: 180},
	        {display: '认筹金', name: 'raiseGold', align: 'left', width: 180},
	        {display: '操作', name: 'operate', align: 'center', width: 230,render:operateRender}
	    ],
	    rownumbers: true,
	    height:'95%',
	    fixedCellHeight:false,
	    url:getPath()+'/ebhouse/activity/listData',
	    delayLoad:false
	}));
});	

function operateRender(data,filterData){
	var stateStr = "";
	if(data.state=="1"){
		stateStr = '<a href="javascript:updateState(\''+data.id+'\',0);">禁用</a>';
	}else{
		stateStr = '<a href="javascript:updateState(\''+data.id+'\',1);">启用</a>';
	}
    return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'+stateStr;
}


function updateState(id,state){
	$.post(base+'/ebhouse/activity/updateState',{id:id,state:state},function (){
		resetList();
		});
}