$list_addUrl = getPath()+"/lunch/coupons/add";//新增url
$list_editUrl = getPath()+"/lunch/coupons/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/lunch/coupons/delete";//删除url
$list_editWidth = "400px";
$list_editHeight = "500px";
$list_dataType = "数据";//数据名称
$(document).ready(function() {
		//这个基本固定；
		$("#main").ligerLayout({});
		$(".system_tab li").click(function(){
			$(this).parent().find("li").removeClass("hover");
			$(this).addClass("hover");
		});
		//这里表示表格；
		$list_dataGrid = $("#tableContainer").ligerGrid(
				$.extend($list_defaultGridParam, {
					columns : [ {
						display : '操作',
						name : 'operate',
						align : 'center',
						width : 200,
						render : operateRender
					}, {
						display : '名称',
						name : 'name',
						align : 'center',
						width : 100
					}, {
						display : '使用条件',
						name : 'conditionUse',
						align : 'center',
						width : 80
					}, {
						display : '描述',
						name : 'description',
						align : 'center',
						width : 100
					}, {
						display : '有效期至',
						name : 'hasOverdueDate',
						align : 'center',
						width : 150
					},{
						display : '面值',
						name : 'par',
						align : 'center',
						width : 80
					},{
						display: '使用类型', 
						name: 'usetype.name', 
						align: 'center', 
						width:130
					}],
					url : getPath() + "/lunch/coupons/listData"
				}));

		// 回车事件
		$('#keyword').on('keyup', function(event) {
			if (event.keyCode == "13") {
				searchlist();
			}
		});
		
});


//操作
function operateRender(data) {
	// return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a
	// href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	var lianjie = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>'+' | ';
	lianjie+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return lianjie;
}

//删除节点
function delnode(){
//	$(node).closest("span").remove();
	var msg=document.getElementById("nodetr");  
	msg.removeChild(msg.lastChild);
}

//添加数据
function addone(){
	
	var flag = false;
	var dlg = art.dialog
	.open($list_addUrl,
			{
				id : "addhomeData",
				title : '添加数据',
				background : '#333',
				width : 400,
				height : 500,
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
					resetList();
				}
			});	
}

//模糊查询
function searchlist(){	
	var keyword = $("#keyword").val();
	if (keyword && ($('#keyword').attr("defvalue") != keyword)) {
		$list_dataParam['keyWord'] = keyword;
	} else {
		delete $list_dataParam['keyWord'];
	}
	resetList();
}

//清空
function onEmpty(){
	$("#keyword").attr("value", $("#keyword").attr("defvalue"));
	searchlist();
}

