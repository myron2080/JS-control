$list_editUrl = getPath()+"/djworkflow/nodeDefi/edit";//编辑及查看url
$list_addUrl = getPath()+"/djworkflow/nodeDefi/add";//新增url
$list_updateSortNumUrl = getPath()+"/djworkflow/nodeDefi/updateSortNum";
$list_editWidth = "500px";
$list_editHeight = "220px";
$list_dataType = "节点";//数据名称
$(document).ready(function(){
	
	var processId=$('#processId').val();
	var processType=$('#processType').val();
	$list_editUrl +="?processId="+processId+"&processType="+processType;
	$list_addUrl +="?processId="+processId+"&processType="+processType;
	
	$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'添加节点',click:addRow,icon:'add'}]
	});
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '节点编码', name: 'number', align: 'left', width: 80,height:40},
		            {display: '节点名称', name: 'name', align: 'left', width: 120,height:40},
		            {display: '节点类型', name: 'nodeType.name', align: 'left', width: 80,height:40},
		            {display: '驱动函数', name: 'driveFunction', align: 'left', width: 160,height:40},
		            {display: '流出判断', name: 'expression', width: 160,height:40},
		            {display: '操作', name: '', width: 150,height:40,render:operate}
		        ],
        delayLoad:false,
        url:getPath()+'/djworkflow/nodeDefi/listData?processId='+processId+'&processType='+processType
    }));
});


function operate(data,index){
	var str = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
	str += '<a href="javascript:up({id:\''+data.id+'\',index:\''+index+'\',processId:\''+data.processDefinition.id+'\'});">|上移</a>';
	str += '<a href="javascript:down({id:\''+data.id+'\',index:\''+index+'\',processId:\''+data.processDefinition.id+'\'});">|下移</a>';
	str += '<a href="javascript:deleteNode({id:\''+data.id+'\',index:\''+index+'\',processId:\''+data.processDefinition.id+'\'});">|删除</a>';
	return str;
}
function deleteNode(data){
	artDialog.confirm("确定删除该流程节点吗？",function(){ 
		$.post(getPath()+'/djworkflow/nodeDefi/delete',data,function(data){
			if(data && data.STATE == 'SUCCESS'){
				art.dialog.alert(data.MSG);
				refresh();
			}else {
				art.dialog.alert(data.MSG);
			}
		},'json');
	});
}
function up(data){
	if(data.index==0){
		art.dialog.tips('第一条数据不能往上移动');
		return false;
	}
//	$list_dataGrid.up(data.index);
	updateSortNum(data.id,'up',data.processId);
}
function down(data){
	if(data.index==$list_dataGrid.getData().length-1){
		art.dialog.tips('最后一条数据不能往下移动');
		return false;
	}
//	$list_dataGrid.down(data.index);
	updateSortNum(data.id,'down',data.processId);
}

/**
 * 修改当前的存储循序
 */
function updateSortNum(id,type,processId){
	$.post($list_updateSortNumUrl,{id:id,moveType:type,processId:processId},function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}




