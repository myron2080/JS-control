$list_addUrl = getPath()+"/lunch/usercoupons/add";//新增url
$list_editUrl = getPath()+"/lunch/usercoupons/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/lunch/usercoupons/delete";//删除url
$list_editWidth = "320px";
$list_editHeight = "160px";
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
						display : '用户名',
						name : 'user.nickName',
						align : 'center',
						width : 80
					}, {
						display : '优惠券类型',
						name : 'coupons.name',
						align : 'center',
						width : 80
					}, {
						display : '创建时间',
						name : 'createTime',
						align : 'center',
						width : 100
					}, {
						display : '使用状态',
						name : 'isUse',
						align : 'center',
						width : 80,
						render:function(data){
							if(data.isUse==1){
								return "已经使用";
							}else if(data.isUse==0){
								return "未使用";
							}else{
								return "否";
								console.info("数据异常");
							}
						}
					}, {
						display : '使用时间',
						name : 'userTime',
						align : 'center',
						width : 150
					}
					, {
						display : '是否过期',
						name : 'overdue',
						align : 'center',
						width : 80,
						render:function(data){
							if(data.overdue){
								return "未过期";
							}else if(data.overdue==false){
								return "已过期";
							}else{
								return "已过期";
								console.info("数据异常");
							}
						}
					}, {
						display : '有效期',
						name : 'overdueDate',
						align : 'center',
						width : 150
					}],
					url : getPath() + "/lunch/usercoupons/listData?userid="+userid
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
	var lianjie = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
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
				width : 320,
				height : 160,
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

