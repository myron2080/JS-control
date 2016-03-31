$list_addUrl = getPath() + "/ebsite/weixin/participants/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/weixin/participants/delete";// 删除url
$list_editUrl = getPath() + "/ebsite/weixin/participants/edit";// 设置修改的路径
$list_editWidth="600px";
$list_editHeight="300px";
$list_dataType = "投票参与人列表";// 数据名称
$(document).ready(function() {
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$list_dataGrid = $("#tableContainer").ligerGrid(
	$.extend($list_defaultGridParam, {
		columns : [ {display: '操作',name: 'operate',  align: 'center',width: 160,render:operateRender},           
				{display : '编号',name : 'pNumber',align : 'center',width : 130},
				{display : '姓名',name : 'playerName',align : 'center',width : 130},
				{display : '拉票宣言',name : 'pManifesto',align : 'center',width : 120},
				{display : '票数',name : 'pCount',align : 'center',width : 130},
				{display : '参加时间',name : 'pCreateTime',align : 'center',width : 120},
				{display : '状态',name : 'pState',align : 'center',width : 130,render:renderStatus},
				],
				delayLoad : false,
				url : getPath() + '/ebsite/weixin/participants/listData'
			}));
			searchData();

			$("#searchBtn").click(function() {
				searchData();
			});
			initClearBtn();
});

function renderStatus(data){
	if(data.pState == "1"){
		return "启用";
	} else if(data.pState == "0"){
		return "<span style='color:red'>禁用</span>";
	}
}

/**
 * 清空按钮
 */
function initClearBtn(){
	
	$("#addBtn").bind("click",function(){
		addRow({});
	});
	
	
	$("#resetBtn").bind("click",function(){
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#importNumber").val($("#importNumber").val());
		$("#isStartUse").val("");
		searchData();

	});
	document.onkeydown =function(event){ enterSearch(event)};
}



function operateRender(data, filterData) {
		var str ="";
		if(data.pState == "1"){
			str += '<a href="javascript:onOff({id:\'' + data.id + '\',pState:\'0\'});">禁用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>  '
		} else if(data.pState == "0"){
			str += '<a href="javascript:onOff({id:\'' + data.id + '\',pState:\'1\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>  '
		}
		//str +='<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
    return str;
}

/**
 * 启用、禁用操作
 * @param data
 */
function onOff(data){
	var _status = data.pState;
	var msg = "";
	if(_status == "1"){
		msg = "确定启用操作吗？";
	} else if(_status == "0"){
		msg = "确定禁用操作吗？";
	}
	art.dialog.confirm(msg, function(){
		$.post(getPath() + "/ebsite/weixin/participants/onOff" ,{id : data.id, pState : _status}, function(res){
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				refresh();
			}
		},'json');
		return true;
	}, function(){
		return true;
	});
}

function searchData() {
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
		$list_dataParam['key'] = keyWord;
	} else {
		delete $list_dataParam['key'];
	}
	
	var isStartUse = $("#isStartUse").val();
	if (isStartUse) {
		$list_dataParam['isStartUse'] = isStartUse;
	} else {
		delete $list_dataParam['isStartUse'];
	}
	resetList();
}

function enterSearch(e) {

	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}


//var code = "shan_sheng";
//var nikename = "单";
//var icopath = "";
//function weixin() {
//	
//}
