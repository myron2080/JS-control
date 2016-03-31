$(document).ready(function(){
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '套餐名称', name: 'name', align: 'center', width: 80,height:40},
		            {display: '价格', name: 'price', align: 'left', width: 80,height:40,render:getPrice},
		            {display: '总点数', name: 'allPoint', align: 'left', width: 80,height:40},
		            {display: '套餐说明', name: 'info', align: 'left', width: 200,height:40},
		            {display: '使用有效期', name: 'effective', align: 'left', width: 120,height:40},
		            {display: '剩余数量', name: 'shopNum', align: 'center', width: 80,height:40}
		        ],
        delayLoad:false,
        url:getPath()+'/projectm/pmPhoneCombo/getPoints?id='+$('#dataId').val(),
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	okSelect();
	    }
    }));
});

function okSelect(){
	var selects = $list_dataGrid.getSelected();
	if(selects==null || selects.length==0){
		artDialog.alert('请选择数据');
	}else{
		artDialog.open.origin[art.dialog.data("returnFunName")].call(null, selects);
		art.dialog.close();
	}
}

function getPrice(data){
	var proce=data.price;
	return proce/100 +"元";
}