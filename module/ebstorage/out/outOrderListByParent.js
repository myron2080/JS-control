$list_editUrl = getPath()+"/ebstorage/out/edit";//编辑及查看url
$list_editWidth="1050px";
$list_editHeight="550px";
$list_dataType = "调拨单" ;
var approveEnum={UNAPPROVE:'未审批',APPROVED:'已审批',REJECT:'已驳回',UNSEND:'未发货',SENT:'已发货',GOT:'已收货',
		SUBMITED:'已提交',PICKING:'拣货中',PICKED:'拣货完成',HANG_UP:'已挂起',HAND_CANCEL:'已取消',CLOSED:'已关闭',
		ZC_READY_PICK:'总仓待拣货',ZC_PICKING:'总仓拣货中',ZC_PICKED:'总仓已拣货',ZC_SENDING:'总仓配送中',ZC_CLOSE:'总仓关闭',FC_GOT:'分仓已收货',
		FC_READY_PICK:'分仓待拣货',FC_PICKING:'分仓拣货中',FC_HANG_UP:'分仓已挂起',FC_PICKED:'分仓已拣货',FC_SENDING:'分仓配送中',
		HC_GOT:'合仓已收货',HAND_CANCEL:'手工取消',BATCH_ZC_OUT:'总分调拨单',BATCH_FC_OUT:'分合调拨单',COMMON_OUT:'普通调拨单'};
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	var parentId=$("#parentId").val();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
         columns:[
         {display: '调拨单号', name: 'number', align: 'center',  width: 120, isSort:false,render:nubmerLink},
         {display: '调拨类型', name: '', align: 'center',  width: 120, isSort:false,render:showTypeEnum},
         {display: '调出仓库', name: 'outStorage.name', align: 'left', width: 120},
         {display: '调入仓库', name: 'storage.name', align: 'left', width: 120},
         {display: '负责人/联系方式', name: 'storage.person.name', align: 'left', width: 120, isSort:false, render:showNameAndPhone},
         {display: '调拨状态', name: 'followStatus', align: 'center',  width: 80, render: rederStatus},
         {display: '调拨时间', name: 'outTimeStr', align: 'center',  width: 130}
		],
        width:"99%",
        enabledSort:true,
        delayLoad : true,
        url:getPath() + '/ebstorage/out/listData?parentId='+parentId,
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.id);
        }
    }));
	searchData();
});

function showTypeEnum(data){
	return approveEnum[data.outType];
}


/**
 * 查询
 */
function searchData(){
	resetList();
}

function nubmerLink(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.id+'\')">'+data.number+'</a>';
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
					width : $("#width").val(),
					height : $("#height").val(),
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
function showNameAndPhone(data){
	if(null != data.storage.person){
		return data.storage.person.name+'/'+data.storage.person.phone;
	}else{
		return '';
	}
}
/**
 * 返回 调拨单状态
 * @param data
 * @returns
 */
function rederStatus(data){
	return approveEnum[data.followStatus];
}
function printer(){
	var parentId=$("#parentId").val();
	var dlg=art.dialog.open(getPath()+'/ebstorage/out/printChildOutOrderList?parentId='+parentId,
			{title:"打印调拨单调拨单",
			lock:true,
			width : $("#width").val(),
			height : $("#height").val(),
			id:'printChildOutOrder',
			 button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
	);
}