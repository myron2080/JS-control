$list_deleteUrl = getPath()+"/projectm/calc/delete";//删除url
$(document).ready(function(){
	$("#main").ligerLayout({});
	eventFun("#number");
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '楼层', name: 'floor', align: 'left', width: 60},
            {display: '楼栋号', name: 'building', align: 'left', width: 60},
            {display: '铺位号', name: 'stores', align: 'left', width: 60},
            {display: '建筑面积', name: 'builtArea', align: 'left', width: 80},
            {display: '套内面积', name: 'setArea', align: 'left', width: 80},
            {display: '公摊面积', name: 'publicArea', align: 'left', width: 80},
            {display: '单价', name: 'price', align: 'left', width: 100},
            {display: '总价', name: 'totalPrice', align: 'left', width: 100},
            {display: '现场折扣', name: 'localDiscount', align: 'left', width: 80},
            {display: '按揭折扣', name: 'mortgageDiscount', align: 'left', width: 80},
            {display: '一次性折扣', name: 'payAllDiscount', align: 'left', width: 80},
            {display: '按时签约折扣', name: 'onTimeDiscount', align: 'left', width: 80},
            {display: '其他折扣', name: 'otherDiscount', align: 'left', width: 100},
            {display: '备案单价', name: 'filingPrice', align: 'left', width: 100},
            {display: '备案总价', name: 'totalFilingPrice', align: 'left', width: 100},
            {display: '按揭款', name: 'mortgagePrice', align: 'left', width: 100},
            {display: '操作', name: 'id', align: 'center', width: 60,render:operationRender}
        ],
        delayLoad:true,
        url:getPath()+'/projectm/calc/listData'
    }));
	searchData();
});

function clean(){
	$("#number").val($("#number").attr("defaultValue"));
}

function operationRender(data){
	return '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function importData(){
	var filePath = $("#filePath").val();
	if(filePath == null || filePath == ""){
		art.dialog.tips("请先选择文件！");
	}else{
		var data = {} ;
		var saveUrl = ctx+"/projectm/calc/saveImportData" ;
		 $.ajaxFileUpload({
	        url: saveUrl,
	        secureuri: false,
	        data: data,
	        fileElementId: 'filePath',
	        dataType: 'json',
	        success: function (res) {
	            if(res.STATE == 'SUCC'){
					art.dialog.tips(res.MSG);
					searchData();
				}else{
					artDialog.alert(res.MSG);
				}
	        },
	        error: function (res) {
	        	art.dialog.alert("由于数据量过大，导入时间比较长，已提交到后台处理，请稍后手动刷新界面！");
	        	//art.dialog.close();
	        }
	    });
	}
}


function searchData(){
	var kw = $('#number').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#number').val(kw);
	if(kw == $('#number').attr('defaultValue')){
		kw = '';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	resetList();
}

function showDemo(){
	art.dialog({
		content:$("#demoTemp").html(),
		id:'demo_temp',
		title:'xls模板',
		okVal:'确定',
		ok:function(){
			return true ;
		}
	});
}



