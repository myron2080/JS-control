$list_addUrl = getPath()+"/lunch/counterfloor/add";//新增url
$list_editUrl = getPath()+"/lunch/counterfloor/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/lunch/counterfloor/delete";//删除url
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
						display : '柜点名称',
						name : 'countpoint.name',
						align : 'center',
						width : 180
					}, {
						display : '楼栋名称',
						name : 'floor.name',
						align : 'center',
						width : 180
					}, {
						display : '启用状态',
						name : 'isEnable',
						align : 'center',
						width : 120,
						render:function(data){
							if(data.isEnable == 0){
								return "已禁用";
							}else if(data.isEnable == 1){
								return "已启用";
							}else{
								return "已禁用";
								console.info("数据异常");
							}
						}
					}],
					url : getPath() + "/lunch/counterfloor/listData?cpid="+cpid
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
	//状态为已启用
	if(data.isEnable == 1){
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
	}
	//状态为已禁用
	else{
		var lianjie = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>' + ' | ';
		lianjie+= '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a>';
		return lianjie;
	}
	// return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a
	// href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	
}
/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/lunch/counterfloor/onOff', {
				id : data.id,
				isEnable : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/lunch/counterfloor/onOff', {
				id : data.id,
				isEnable : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else {
		art.dialog.tips('参数有误，请联系管理员');
		var obj = {
			fileName : 'counterPointList.js',
			lineNumber : '79',
			msg : '程序开发参数传入异常，请联系ljw'
		};
		sysout(obj);
	}
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

