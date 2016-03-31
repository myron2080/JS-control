$list_addUrl = getPath() + "/ebbase/vipgoods/add";// 新增url
$list_deleteUrl = getPath() + "/ebbase/vipgoods/delete";// 删除url
$list_editWidth="1050px";
$list_editHeight="550px";
$list_dataType = "特卖商品列表";// 数据名称
$(document).ready(function() {
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$list_dataGrid = $("#tableContainer").ligerGrid(
	$.extend($list_defaultGridParam, {
		columns : [ {display: '操作',name: 'operate',  align: 'center',width: 140,render:operateRender},           
				{display : '商品编号',name : 'goods.number',align : 'center',width : 130},
				{display : '商品状态',name : 'goods.status.name',align : 'center',width : 60},
				{display : '商品名称',name : 'goods.name',align : 'center',width : 110},
				{display : '可用库存',name : 'goods.ableCount',align : 'center',width : 110},
				{display : '特卖标题',name : 'title',align : 'center',width : 130},
				{display : '份额限制',name : 'limitCount',align : 'center',width : 100},
				{display : '特卖价格',name : 'vipPrice',align : 'center',width : 130},
				{display : '特卖类型',name : 'vipTypeName',align : 'center',width : 100},
				{display : '创建时间',name : 'createTime',align : 'center',width : 100},
				{display : '创建人',name : 'creator.name',align : 'center',width : 100},
				{display : '状态',name : '',align : 'center',width:100,render:renderStatus}
				],
				delayLoad : false,
				url : getPath() + '/ebbase/vipgoods/listData'
			}));
			var params ={};
			params.width = 260;
			params.inputTitle = "创建时间";	
			MenuManager.common.create("DateRangeMenu","createdate",params);
			
			searchData();

			$("#searchBtn").click(function() {
				searchData();
			});
			initClearBtn();
});

function renderStatus(data){
	if(data.status == "ENABLE"){
		return "启用";
	} else if(data.status == "DISABLED"){
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
		$("#goodsCategoryId").val("");
		$("#goodsCategoryName").val("商品类目");
		$("#provideId").val("");
		$("#provideName").val("供应商");
		$("#vipType").val("");
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#importNumber").val($("#importNumber").val());

		MenuManager.menus["createdate"].resetAll();
		$("#isStartUse").val("");
		searchData();

	});
	/*inputEnterSearch("searchKeyWord",searchData);
	inputEnterSearch("importNumber",searchData);*/
	document.onkeydown =function(event){ enterSearch(event)};
}



function operateRender(data, filterData) {
		var str ="";
		if(data.status == "ENABLE"){
			str += '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">禁用</a>|'
		} else if(data.status == "DISABLED"){
			str += '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">启用</a>|'
		}
		str +='<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>|';
		str +='<a href="javascript:refreshRow({id:\''+ data.id + '\'});">刷新</a>';
    return str;
}

/**
 * 刷新
 */
function refreshRow(data){
	art.dialog.confirm('刷新数据会靠前显示，请确认？', function(){
		$.post(getPath() + "/ebbase/vipgoods/refresh" ,{id : data.id}, function(res){
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

/**
 * 启用、禁用操作
 * @param data
 */
function onOff(data){
	var _status = data.status == 1 ? 'DISABLED' : 'ENABLE';
	var msg = "";
	if(_status == "ENABLE"){
		msg = "确定启用操作吗？";
	} else if(_status == "DISABLED"){
		msg = "确定禁用操作吗？";
	}
	art.dialog.confirm(msg, function(){
		$.post(getPath() + "/ebbase/vipgoods/onOff" ,{id : data.id, status : _status}, function(res){
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
	//创建时间
	var createTime_begin = "";
	var createTime_end = "";
	if(MenuManager.menus["createdate"]){
		createTime_begin = MenuManager.menus["createdate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["createdate"].getValue().timeEndValue;
	}
	if(createTime_begin != ""){
		$list_dataParam['createTime_begin'] = createTime_begin;
	} else {
		delete $list_dataParam['createTime_begin'];
	}
	if(createTime_end != ""){
		$list_dataParam['createTime_end'] = createTime_end;
	} else {
		delete $list_dataParam['createTime_end'];
	}
	
	// 商品类目
	var goodsCategoryId = $("#goodsCategoryId").val();
	if (goodsCategoryId != "") {
		$list_dataParam['goodsCategoryId'] = goodsCategoryId;
	} else {
		delete $list_dataParam['goodsCategoryId'];
	}
	//供应商
	var provideId = $("#provideId").val();
	if (provideId != "") {
		$list_dataParam['provideExtId'] = provideId;
	} else {
		delete $list_dataParam['provideExtId'];
	}
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	var vipType = $("#vipType").val();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
		$list_dataParam['key'] = keyWord;
	} else {
		delete $list_dataParam['key'];
	}
	
	if (vipType != "") {
		$list_dataParam['vipType'] = vipType;
	} else {
		delete $list_dataParam['vipType'];
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
