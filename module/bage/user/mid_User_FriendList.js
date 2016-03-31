/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/bage/friend/list';
$list_dataType = "朋友列表";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '姓名', name: 'friend.name', align: 'left', width:'80',render:function(data){
            	if(data.friend.name)return data.friend.name else return data.friend.nickName;
            }},
			{display: '公司', name: 'friend.company.name', align: 'left', width:'200'},
			{display: '电话', name: 'friend.phone', align: 'left', width:'80'}
        ],
        url:getPath()+"/bage/friend/listData",
        delayLoad:true,
    }));
	selectList();
});

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	$list_dataParam['userId'] =userId;
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

