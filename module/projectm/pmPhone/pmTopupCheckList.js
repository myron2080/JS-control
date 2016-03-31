$list_editUrl = getPath() + "/projectm/pmTeleFee/edit";// 编辑及查看url
$list_addUrl = getPath() + "/projectm/pmTeleFee/add";;// 新增url
$list_deleteUrl = getPath() + "/projectm/pmPhonemember/delete";// 删除url
$tree_container = "leftTree";
$tree_async_url = getPath() + "/projectm/customer/simpleTreeData";
$tree_addUrl = getPath() + "/projectm/customer/add";// 新增
$tree_editUrl = getPath() + "/projectm/customer/edit";// 编辑及查看url
$tree_deleteUrl = getPath() + "/projectm/customer/delete";// 删除url
$list_editWidth = 430;
$list_editHeight = 150;
$list_dataType = "电话费充值";
$tree_editWidth = "580px";// 界面宽度
$tree_editHeight = "250px";// 界面高度
$tree_dataType = "客户类型";// 数据名称

$(document)
		.ready(
				function() {
					$("#main").ligerLayout({
						leftWidth : 200,
						minLeftWidth : 150,
						allowLeftCollapse : true,
						allowLeftResize : true
					});

					initSimpleDataTree();

					var columnsParam = [ {
						display : '充值日期',
						name : 'chargDate',
						align : 'center',
						width : 150,
						dateFormat:"yyyy-MM-dd",
						formatters:"date",
						isSort : false
					}, {
						display : '充值金额',
						name : 'money',
						align : 'center',
						width : 80,
						isSort : false
					}, {
						display : '充值方式',
						name : '',
						align : 'center',
						width : 100,
						isSort : false,
						render: topUp
					}, {
						display : '操作人',
						name : 'person.name',
						align : 'center',
						width : 100,
						isSort : false
					}, {
						display : '备注',
						name : 'remark',
						align : 'center',
						width : 140,
						isSort : false
					} ];
					//加载数据的地方
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam, {
								columns : columnsParam,
								enabledSort : true,
								height:'80%',
								delayLoad : true,
								parms : {
									orgId : $("#orgId").val()
								},
								url : getPath()
										+ '/projectm/pmTeleFee/listData'
							}));
				});

// 增加行
function addTFeeCharg() {
	$list_addUrl = getPath() + "/projectm/pmTeleFee/add";
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if (node == null || node.length == 0
			|| node[0].id == '65a19487-c95e-44b1-859a-7cfa41aaa04a') {
		art.dialog.tips('请先在左边选择客户类型');
		return false;
	}
	$list_addUrl += "?customerId=" + node[0].id;
	addRow();
}
//充值方式的渲染
function topUp(){
	return "线下充值";
}

function refreshTree() {
	initSimpleDataTree();
}
function afterAddNode() {
	$('#' + $tree_container).empty();
	refreshTree();
}

function afterUpdateNode() {
	$('#' + $tree_container).empty();
	refreshTree();
}

function afterDeleteNode() {
	$('#' + $tree_container).empty();
	refreshTree();
}

function editMethod(data) {
	return "";
}

function onTreeNodeClick(event, treeId, treeNode) {
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if (node != null && node.length > 0) {
		if (treeNode.id == '65a19487-c95e-44b1-859a-7cfa41aaa04a') {// 全部客户
			delete $list_dataParam['customerId'];
		} else {
			$list_dataParam['customerId'] = treeNode.id;
		}
	}
	queryAccount();
	searchData();
}
function searchData() {
	resetList();
}


function queryAccount() {
	//遍历前清空数据
	$("#showblance").html("");
	$.post(getPath() + "/projectm/pmPhonemember/queryAccount", $list_dataParam,
			function(data) {
				$("#showblance").html("");
				if (data.STATE == 'SUCCESS') {
					$.each(data.configList, function(i, item) {
						$("#showblance").append(
								'<p>'+item.orgName+' 电话总数：<span id=phoneCount'+i+'>'+item.memberCount+'</span> 当前余额：' + item.balance
										+ ' 资费备注：'+item.remark+'</p>');
					});
				}
			}, 'json');
}

function clearSearch() {
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	$('#state').val('');
	$('#parten').val('');
}

// 回车查询
$(document).keydown(function(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
});
