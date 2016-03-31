/**
 * 交易信息
 */
$list_deleteUrl = getPath()+'/bage/usertrade/delete';
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '交易类型', name: 'tradeEnumStr', align: 'center', width:80},
			{display: '交易金额', name: 'amount', align: 'right', width:80},
			{display: '交易分钟', name: 'minute', align: 'right', width:100},
			{display: '备注', name: 'desc', align: 'left', width:300},
			{display: '操作人', name: 'operator.name', align: 'center', width:90,render:operatRender},
			{display: '操作时间', name: 'operationTime', align: 'center', width:90},
			{display: '操作', name: 'sumMinute', align: 'center', width:120,render:operateRender}
        ],
        url:getPath()+"/bage/usertrade/listData",
        parms:{userId:userId}
    }));
});



function operatRender(data,filterData){
	var str='';
	str+=data.operator.name;
	if(data.user.referee && data.user.referee != null){
		if(data.user.referee.name != null && data.user.referee.name !=""){
			str+= "/" +  data.user.referee.name;
		}else{
			str+= "/" +  data.user.referee.phone;
		}
	}
	return str;	
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var str='';
	str+='<a href="javascript:update({id:\''+data.id+'\',tradeEnum:\'' + data.tradeEnum + '\'});">修改| </a>';
	str+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除 </a>';
	return str;	
}




function update(data){
	var url = getPath()+"/bage/usertrade/edit?id=" + data.id + "&tradeEnum=" + data.tradeEnum;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:"充值/赠送/扣除",
		 lock:true,
		 width:'430px',
		 height:'150px',
		 id:"usertradeEdit",
		 button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
					dlg.iframe.contentWindow.save();
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}
