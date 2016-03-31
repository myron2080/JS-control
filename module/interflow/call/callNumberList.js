$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[ 
                 {display: '号码', name: 'phoneNo', align: 'center', width: 100, isSort:false},
                 {display: '号码类型', name: 'phoneType', align: 'center',  width: 80, isSort:false},
                 {display: '使用套餐', name: 'currentPackName', align: 'center', width: 180, isSort:false},
                 {display: '状态', name: 'status', align: 'center', width: 60, isSort:false,render:statusRender},
                 {display: '所属组织', name: 'orgName', align: 'center', width: 120, isSort:false},
                 {display: '所属用户', name: 'mobileNo', align: 'center',  width: 120, isSort:false},
                 {display: '购买日期', name: 'buyTime', align: 'center',  width: 120,isSort:false}
                 ],
        enabledSort:true,
        delayLoad:true,
        pageSize:30,
        url:getPath() + '/interflow/callNew/getNumberList',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	okSelect();
	    }
    }));
	searchData();
});

/**
 * 查询
 */
function searchData(){
	$list_dataParam['orgInterfaceId'] = $("#orgInterfaceId").val();
	resetList();
}

/**
 * 确定 
 */
function okSelect(){
	var selects = $list_dataGrid.getSelected();
	if(selects==null || selects.length==0){
		artDialog.alert('请选择数据');
	}else{
		artDialog.open.origin.saveSelect(null, selects);
		art.dialog.close();
	}
}

function statusRender(rowData){
	var status = rowData.status ;
	var name = '' ;
	if(status == 2){
		name = '未分配' ;
	}else if(status == 5){
		name = '在售' ;
	}
	return name ;
	
}