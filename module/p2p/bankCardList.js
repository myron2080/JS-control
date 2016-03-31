$list_addUrl = getPath()+"/p2p/bankCardList/add";//新增url
$list_editUrl = getPath()+"/p2p/bankCardList/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/p2p/bankCardList/delete";//删除url
$list_editWidth = "650px";
$list_editHeight = "160px";
$list_dataType = "资金账户";//数据名称
$(document).ready(
			function() {
					$("#main").ligerLayout({});
					$("#toolBar").ligerToolBar({
						items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
						});
					$("#toolBar").append(
						'<div style="float:right;padding-right:50px;display:inline;">'
				    	+'	<form onsubmit="searchData();return false;">'	
					    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/联系人/联系电话" defaultValue="名称/联系人/联系电话" value="名称/联系人/联系电话" id="searchKeyWord" class="input"/>'
					    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
				    	+'	</form>'
				    	+'</div>'
					);
		$list_dataGrid = $("#tableContainer").ligerGrid(
		$.extend($list_defaultGridParam,
		{columns : [ 
	            	{display : '客户名称',name : 'p2puserName',align : 'center',width : 150} ,
	            	{display : '账号',name : 'cardNo',align : 'center',width : 150} ,
	            	{display : '所属银行',name : 'bank.bankName',align : 'center',width : 150} ,
	            	{display : '所属支行',name : 'branch.name',align : 'center',width : 150} ,
		            {display : '操作',name : 'operate',align : 'center',width : 150,render : operateRender} ],
					url : getPath()+ '/p2p/bankCardList/listData'
			}));
});




function operateRender(data,filterData){
	var operateStr ="";
	operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|';
	operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return operateStr;
}

