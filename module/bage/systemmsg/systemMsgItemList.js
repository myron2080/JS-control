/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/bage/systemmsgitem/list';
$list_dataType = "接收人";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '接收人', name: 'receiver.name', align: 'left', width:80},
			{display: '公司', name: 'receiver.company.name', align: 'left', width:120},
			{display: '电话', name: 'receiver.phone', align: 'left', width:80},
			{display: '是否已读', name: 'isRead.name', align: 'left', width:80}
        ],
        url:getPath()+"/bage/systemmsgitem/listData",
        delayLoad:true,
    }));
	selectList();
});

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	$list_dataParam['msgId'] =msgId;
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

