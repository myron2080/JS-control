$list_editWidth="1050px";
$list_editHeight="550px";
$(document).ready(function(){
	$list_editWidth=$("#width").val();
	$list_editHeight=$("#height").val();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '入库单号', name: 'number', align: 'center', width:150,render:viewRender},
			{display: '批次号', name: 'outBatch.number', align: 'center', width:150},
			{display: '供应商', name: 'provideExt.name', align: 'center', width:120},
			{display: '入库仓库', name: 'storage.name', align: 'center', width:120},
			{display: '经办人/联系方式', name: 'data', align: 'center', width:180, render:phoneRender},
			{display: '入库类型', name: 'inStorageTypeName', align: 'center', width:80},
			{display: '类目数', name: 'categoryCount', align: 'right', width:60},
			{display: '质检员', name: 'quality.name', align: 'center', width:100},
			{display: '应到日期', name: 'arrivDateeStr', align: 'center', width:140},
			{display: '创建时间', name: 'createTimeStr', align: 'center', width:140},
			{display: '实到日期', name: 'actArriveDateStr', align: 'center', width:140},
			{display: '入库时间', name: 'formatApprDate2', align: 'center', width:140},
			{display: '状态', name: 'inStorageStatusName', align: 'center', width:100},
			{display: '退货状态', name: 'backStatus', align: 'center', width:100, render:backStatusRender},
			{display: '初审信息', name: 'apprInfo', align: 'left', width:300,render:apprInfoRender},
			{display: '入库信息', name: 'apprInfo2', align: 'left', width:300,render:apprInfoRender2}
        ],
        url:getPath()+"/ebstorage/instorageList/inStorageList?outBatchId="+$("#outBatchId").val(),
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	viewInstorageDetail(rowData);
        }
    }));
});

function viewRender(data,filterData){
	var str='';
	str+='<a href="javascript:viewInstorageDetail({id:\''+data.id+'\'});">' + data.number + '</a>';
	return str;	
}

function viewInstorageDetail(data){
	var url = getPath() + "/ebstorage/instorageList/viewInstorage?id=" + data.id;
	var dlg = art.dialog.open(url,{
		 title:"入库单查看",
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"viewInstorageDetail",
		 button:[{name:'打印',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printerInstorage){
					dlg.iframe.contentWindow.printerInstorage(dlg);
				}
				return false;
			}},{name:'关闭',callback:function(){
				return true;
		}}]
	});
}

function phoneRender(data,filterData){
	var str='';
	if(data.provideExt){//不为空
		str+=data.provideExt.crashContract + "/" + data.provideExt.contractPhone;
	}else{
		str+='';
	}
	return str;	
}

/**
 * 渲染 退货状态
 * @param rowData
 */
function backStatusRender(rowData){
	var _backStatus=rowData.backStatus;
	if(_backStatus == 0){
		return '无退货';
	}else if(_backStatus == 1){
		return '部分退货';
	}else if(_backStatus == 2){
		return '已退货';
	}
}

function apprInfoRender(data,filterData){
	var str='';
	if(data.apprPerson && data.apprPerson.name){
		str+=data.apprPerson.name + "于" + data.apprDate + "日审核，备注：" + data.apprInfo;
	}
	return str;	
}

function apprInfoRender2(data,filterData){
	var str='';
	if(data.apprPerson2 && data.apprPerson2.name){
		str+=data.apprPerson2.name + "于" + data.apprDate2 + "日审核，备注：" + data.apprInfo2;
	}
	return str;	
}