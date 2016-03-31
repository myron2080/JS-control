$(function(){
	console.info('welcome record page...');
});

$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '领取人', name: 'name', align: 'center', width: 120},
            {display: '领取人电话', name: 'contact', align: 'center', width: 80},
            {display: '领取时间', name: 'createTime', align: 'center', width: 80},
            {display: '途径', name: 'pathway.name', align: 'center', width: 80},
            {display: '备注', name: 'reserveOne', align: 'center', width: 120}
        ],
        delayLoad:true,
        width:'auto',
        height : '250px',
        url:getPath()+'/ebsite/giftrecord/listData?giftId='+$('#giftId').val()
    }));
	/**
	 * 回车查询
	 */
	$('#searchKeyWord').on('keyup', function(event){
		if(event.keyCode == 13){
			searchData();
		}
	});
	searchData();
});

/**
 * 查询
 */
function searchData(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['keyWord'];
	}else{
		$list_dataParam['keyWord'] = kw;
	}
	resetList();
}

/**
 * 清空
 */
function cleanData(){
	delete $list_dataParam['keyWord'];
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
	searchData();
}