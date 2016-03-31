$list_addUrl = getPath()+"/ebhouse/exchange/add";//新增url
$list_editUrl = getPath()+"/ebhouse/exchange/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebhouse/exchange/delete";//删除url
$list_previewUrl = getPath()+"/ebhouse/exchange/view";//预览url
$list_editWidth = "750px";
$list_editHeight = "350px";
$list_dataType = "营销活动";//数据名称
$(document).ready(function() {
		$("#main").ligerLayout({});
		
		
		$list_dataGrid = $("#tableContainer").ligerGrid(
		$.extend($list_defaultGridParam,
		{columns : [ 
	            	{display : '兑换码',name : 'code',align : 'center',width : 150} ,
	            	{display : '创建时间',name : 'createTime',align : 'center',width : 150} ,
		            {display : '状态',name : 'statusDesc',align : 'center',width : 150},
		            {display : '兑换方式',name : 'spotoffer',align : 'center',width : 150,render : spotRender},
		            {display : '收件人',name : 'consignee',align : 'center',width : 150},
		            {display : '收件电话',name : 'phone',align : 'center',width : 150},
		            {display : '收件地址',name : 'address',align : 'center',width : 150},
		            {display : '款式',name : 'clotheStyle',align : 'center',width : 150,render : styleRender},
		            {display : '码数',name : 'clotheSize',align : 'center',width : 50},
		            {display : '操作',name : 'statusDesc',align : 'center',width : 150,render : operateRender} 
	            	],
					url : getPath()+ '/ebhouse/exchange/listData',
					height:'100%',
					delayLoad:true,
					 onDblClickRow:function(rowData,rowIndex,rowDomElement){
					    	return;
					    }
			}));
		searchlist();
		
		inputEnterSearch('keyword',searchlist);
		
});

function operateRender(data,filterData){
	var operateStr ="";
	if(data.status=='NOOFFER'){
		operateStr +='<a href="javascript:disableRow(\''+data.id+'\',\'DISABLED\');">禁用</a>';
		operateStr +='|<a href="javascript:exchangeRow(\''+data.id+'\');">兑换</a>';
	}else if(data.status == 'OFFERED'){
		operateStr +='<a href="javascript:exchangeRow(\''+data.id+'\');">兑换</a>';
	}else if(data.status=='EXCHANGE'){
		operateStr +='<a href="javascript:sendRow(\''+data.id+'\',\'SENDED\');">发货</a>';
	}else if(data.status=='SENDED'){
		
	}else if(data.status=='DISABLED'){
		operateStr +='<a href="javascript:disableRow(\''+data.id+'\',\'NOOFFER\');">启用</a>';
	}
	return operateStr;
}

function styleRender(data,filterData){
	var str = "";
	if(data.clotheStyle=="MAN") str = "男款";
	if(data.clotheStyle=="WOMAN") str = "女款";
	return str;
}

function spotRender(data,filterData){
	var str = "";
	if(data.status=='EXCHANGE'||data.status=='SENDED'){
		if(data.spotoffer=='1'){
			str = "现场兑换";
		}else if(data.spotoffer=='2'){
			str = "后台兑换";
		}else{
			str = "自助兑换";
		}
	}
	return str;
	
}

function exchangeRow(id){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/ebhouse/exchange/exchangeForm?id="+id,{
		id : "exchangeData",
		title : '兑换',
		background : '#333',
		width : 400,
		height : 300,
		lock : true,
		button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				flag = true;
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		close:function(){
			if(flag){
				searchlist();
			}
		}
	});
}

function searchlist(){
	var params = {};
	params.keyword = $("#keyword").val()==$("#keyword").attr("defvalue")?"":$("#keyword").val();
	params.status = $("#statusel").val();
	$list_dataParam = params;	
	resetList();
}

function addone(){
	
	var flag = false;
	var dlg = art.dialog
	.open($list_addUrl,
			{
				id : "addhomeData",
				title : '添加数据',
				background : '#333',
				width : 400,
				height : 100,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
						searchlist();
					}
				}
			});	
}

function disableRow(id,t){
	$.post(getPath()+"/ebhouse/exchange/updateStatus",{id:id,status:t},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();	
		}else{
			art.dialog.alert(data.MSG);
		}
	},'json');
}

function sendRow(id,t){
	art.dialog.confirm("确认已发货",function(){
	$.post(getPath()+"/ebhouse/exchange/updateStatus",{id:id,status:t},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();	
		}else{
			art.dialog.alert(data.MSG);
		}
	},'json');
	});
}
