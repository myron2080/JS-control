$list_addUrl = getPath()+'/lunch/weiChatMsg/add';
$list_editUrl = getPath()+'/lunch/weiChatMsg/edit';
$list_deleteUrl = getPath()+'/lunch/weiChatMsg/delete';
$list_editWidth = "560px";
$list_editHeight = "290px";
$(function(){
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
            {display: '标题', name: 'msgTitle', align: 'left', width:'200'},
			{display: '接收人', name: 'acceptuser.nickName', align: 'center', width:80},
			{display: '状态', name: 'status', align: 'center', width:130,render:function(data){
				var status = {};
				status.SUCCESS="成功";
				status.FAIL="失败";
				return status[data.status];
			}},
			{display: '发送时间', name: 'sendDate', align: 'center', width:150},
			{display: '内容', name: 'msgContent', align: 'center', width:250}
        ],
        url: getPath()+"/lunch/weiChatMsg/listData"
    }));
	
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	searchData();
        }
    });
});

//操作
function operateRender(data){
//	return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

//查询
function searchData(){
	var status =   $("#status").val();
	if(status){
		$list_dataParam['status'] = status;
	} else{
		delete $list_dataParam['status'];
	}
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}
//清空
function onEmpty(){
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['status'];
	$("#keyWord").val($("#keyWord").attr("defaultValue"));
	$("#status").val("");
}