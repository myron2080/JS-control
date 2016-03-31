$list_addUrl = getPath()+"/ebhouse/notice/add";//新增url
$list_editUrl = getPath()+"/ebhouse/notice/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebhouse/notice/delete";//删除url
$list_editWidth = "750px";
$list_editHeight = "500px";
$list_dataType = "新闻资讯";//数据名称
$(document).ready(function() {
		$("#main").ligerLayout({});
		
		var params = {};
		params.inputTitle = "创建时间";
		params.width="310";
		MenuManager.common.create("DateRangeMenu","createTimeLi",params);
	
		
		$list_dataGrid = $("#tableContainer").ligerGrid(
		$.extend($list_defaultGridParam,
		{columns : [ 
	            	{display : '标题',name : 'name',align : 'center',width : 150} ,
	            	{display : '内容',name : 'preview',align : 'center',width : 250} ,
	            	{display : '资讯类型',name : 'partName',align : 'center',width : 150} ,
	            	{display : '置顶',name : 'id',align : 'center',width : 100,render : topRender} ,
	            	{display : '创建人',name : 'creator.name',align : 'center',width : 150} ,
	            	{display : '创建时间',name : 'createTime',align : 'center',width : 150} ,
		            {display : '状态',name : 'statusDesc',align : 'center',width : 150} ,
		            {display : '操作',name : 'id',align : 'center',width : 150,render : operateRender} ,
	            	],
					url : getPath()+ '/ebhouse/notice/listData',
					height:'100%',
					delayLoad:true
			}));
		searchlist();
		
		inputEnterSearch('keyword',searchlist);
		$(".system_tab_title li").bind("click",function(){
			$(".system_tab_title li").removeClass("hover");
			$(this).addClass("hover");
			$("#partNumber").val($(this).attr("keyval"));
			searchlist();
		});
});


function searchlist(){
	var params = {};
	
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTimeLi"]){
		queryStartDate = MenuManager.menus["createTimeLi"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTimeLi"].getValue().timeEndValue;
		params.createTimeStaStr = queryStartDate;
		params.createTimeEndStr = queryEndDate;
	}
	
	var keyword = $("#keyword").val();
	if(keyword == $("#keyword").attr("defvalue")) keyword = '';
	params.keyword = keyword;
	
	if($("#partNumber").val()!=''){
		params.partNumber=$("#partNumber").val();
	}
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
				width : 750,
				height : 500,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiData){
							dlg.iframe.contentWindow.valiData(dlg);
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

function operateRender(data,filterData){
	var operateStr ="";
	if(data.status=='ENABLE'){
		operateStr +='<a href="javascript:enableRow(\''+data.id+'\',\'DISABLED\');">禁用</a>|';
	}else{
		operateStr +='<a href="javascript:enableRow(\''+data.id+'\',\'ENABLE\');">启用</a>|';
	}
	//operateStr +='<a href="javascript:previewRow(\''+data.id+'\');">预览</a>|';
	operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>|';
	operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	
	return operateStr;
}

function topRender(data,filterData){
	var topstr = "";
	if(data.istop==1){
		topstr += '<span>已置顶</span>';
		topstr += '<a  style="margin-left:5px;" href="javascript:void(0);" onclick=topnotice("'+data.id+'","0")>取消置顶</a>';
	}else{
		topstr += '<a href="javascript:void(0);" onclick=topnotice("'+data.id+'","1")>置顶</a>';
	}
	return topstr;
}

function topnotice(id,t){
	$.post(getPath()+"/ebhouse/notice/updatetop",{id:id,istop:t},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();	
		}else{
			art.dialog.alert(data.MSG);
		}
	},'json');
}

function previewRow(id){
	art.dialog.open($list_addUrl,
			{
				id : "viewData",
				title : '预览数据',
				width : 750,
				height : 310
			}
	);
				
}

function enableRow(id,t){
	$.post(getPath()+"/ebhouse/notice/updatetop",{id:id,status:t},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();	
		}else{
			art.dialog.alert(data.MSG);
		}
	},'json');
}