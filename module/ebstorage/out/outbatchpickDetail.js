$list_editUrl = getPath()+"/ebstorage/out/edit";//编辑及查看url
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
            {display: '操作', name: '', align: 'center',  width: 140, render:printBatch},
            {display: '分批单号', name: 'number', align: 'center',  width: 120},
            {display: '配送调拨单', name: 'outNumbers', align: 'left',  width: 730, render:outNumberRender}
		],
        width:"99%",
        url:getPath() + '/ebstorage/outbatchpick/detailData?outParentId='+$("#outParentId").val(),
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	
        }
    }));
});

/**
 * 操作 渲染
 * @param data
 */
function printBatch(data){
	var res='<a href="javascript:void()" onclick="printBatchFun(\''+data.id+'\')">打印分批配送单</a>&nbsp;';
	res+='<a href="javascript:void()" onclick="deleteBatchPick(\''+data.id+'\')">删除</a>&nbsp;';
	return res;
}

function deleteBatchPick(id){
	art.dialog.confirm("确定删除该分批配送单?",function(){
		$.post(getPath()+'/ebstorage/outbatchpick/deleteBatchPick',{id:id},function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips("删除成功");
				resetList();
			}
		},'json')
	});
}

function printBatchFun(id){
	var dlg = art.dialog.open(getPath() + '/ebstorage/outbatchpick/printBatchFun/'+id,
			{title:'分批配送单_详情',
			 lock:true,
			 width:$("#width").val(),
			 height:$("#height").val(),
			 id:'printBatchFun',
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

function outNumberRender(data,index,value){
	var numbers=value.split(",");
	var resLink='';
	for(var i=0;i<numbers.length;i++){
		resLink+='<a href="javascript:void()" onclick="showdataDetail(\''+numbers[i]+'\')">'+numbers[i]+'</a>&nbsp;';
	}
	return resLink;
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
				width:$("#width").val(),
				height:$("#height").val(),
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