$(function(){
	initHistoryData();
});
/**
 * 初始化
 */
function initHistoryData(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	    columns: [ 
	        {display: '访问时间', name: 'vtime', align: 'center', width: 120},
	        {display: '昵称', name: 'nickName', align: 'center', width: 120},
	        {display: '手机号', name: 'phone', align: 'center', width: 80},
	        {display: '来路及搜索关键词', name: 'sourceLink', align: 'center', width: 180},
            {display: '来源地区', name: 'adress', align: 'center', width: 150},
            {display: '入口页', name: 'visitLink', align: 'center', width: 200}
        ],
	    delayLoad:true,
	    width:"840px",
	    url:getPath()+'/ebhouse/visitorOfPhone/histroyVisitorData',
	    onDblClickRow:function(rowData,rowIndex,rowDomElement){
	    	/*alert("编辑");*/
	    }
	}));
	searchData();
}
function searchData(){
	//绑定一个参数[phone]
	$list_dataParam['phone']=$('#phone').val();
	resetList();
}