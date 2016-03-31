
$(document).ready(function(){
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '操作类型', name: 'operationType.name', align: 'left', width: 100,height:40},
		            {display: '交易金额(元)', name: 'costDetail.tradAmount', align: 'left', width: 100,height:40},
		            {display: '交易分钟(分钟)', name: 'costDetail.tradMin', align: 'left', width: 100,height:40},
		            {display: '备注', name: 'description', align: 'left', width: 150,height:40},
		            {display: '操作IP', name: '', align: 'left', width: 100,height:40},
		            {display: '操作时间', name: 'createTime', align: 'left', width: 100,height:40}
		        ],
        delayLoad:true,
        url:getPath()+'/projectm/phoneMobile/detailData'
    }));
	searchData();
});

function searchData(){
	var memberId=$('#memberId').val();
	if(!memberId){
		memberId="-1";
	}
	$list_dataParam['memberId'] =memberId;
	resetList();
}

