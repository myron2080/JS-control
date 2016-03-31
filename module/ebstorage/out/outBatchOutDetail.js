$list_editWidth="1050px";
$list_editHeight="550px";
$list_editUrl = getPath()+"/ebstorage/out/edit";//编辑及查看url
$list_dataType = "调拨单" ;
var approveEnum={UNAPPROVE:'未审批',APPROVED:'已审批',REJECT:'已驳回',UNSEND:'未发货',SENT:'已发货',GOT:'已收货',
		SUBMITED:'已提交',PICKING:'拣货中',PICKED:'拣货完成',HANG_UP:'已挂起',HAND_CANCEL:'已取消',CLOSED:'已关闭'};
$(document).ready(function(){
	$list_editWidth=$("#width").val();
	$list_editHeight=$("#height").val();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '订单跟踪', name: '', align: 'center',  width: 80, isSort:false, render: orderFollow},
         {display: '审核状态', name: 'approveStatus', align: 'center',  width: 60, isSort:false, render: renderEnum},
         {display: '调拨单号', name: 'number', align: 'center',  width: 140, isSort:false,render:nubmerLink},
         {display: '批次号', name: 'outBatch.number', align: 'center',  width: 140, isSort:false},
         {display: '调出仓库', name: 'outStorage.name', align: 'center', width: 120, isSort:false},
         {display: '调入仓库', name: 'storage.name', align: 'center', width: 120, isSort:false},
         {display: '负责人/联系方式', name: 'storage.person.name', align: 'center', width: 140, isSort:false, render:showNameAndPhone},
         {display: '调拨状态', name: 'stauts', align: 'center',  width: 60, isSort:false, render: rederStatus},
         {display: '调拨时间', name: 'outTimeStr', align: 'center',  width: 160, isSort:false},
         {display: '收货时间', name: 'arrivalTimeStr', align: 'center',  width: 160, isSort:false},
         {display: '创建时间', name: 'createTimeStr', align: 'center',  width: 160, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebstorage/out/listData?outBatchId='+$("#outBatchId").val(),
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.id);
        }
    }));
});

//订单跟踪
function orderFollow(data){
	return '<a href="javascript:void(0);" onclick="showOrderFollow(\''+data.id+'\')">订单跟踪</a>';
}

//打开订单 跟踪页面
function showOrderFollow(id){
	var dlg=art.dialog.open(getPath()+'/ebsite/outorderfollow/list?outOrderId='+id+'&height='+$list_editHeight+'&width='+$list_editWidth,
			{title:"订单跟踪",
			lock:true,
			width:$list_editWidth,
			height:$list_editHeight,
			id:'outOrderFollow',
			button:[{name:'关闭'}]}
	);
}

function nubmerLink(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.id+'\')">'+data.number+'</a>';
}

function showNameAndPhone(data){
	if(null != data.storage.person){
		return data.storage.person.name+'/'+data.storage.person.phone;
	}
	return '';
}

function showdataDetail(id){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+id;
		}
		var dlg=art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth,
				height:$list_editHeight,
				id:$list_dataType+'-VIEW',
				button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
		);
	}
}

/**
 * 返回 审批状态
 * @param data
 * @returns
 */
function renderEnum(data){
	return approveEnum[data.approveStatus];
}

/**
 * 返回 调拨单状态
 * @param data
 * @returns
 */
function rederStatus(data){
	return approveEnum[data.stauts];
}
