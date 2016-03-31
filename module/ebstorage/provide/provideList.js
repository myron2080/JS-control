$list_addUrl = getPath() + '/storage/provide/add';
$list_editUrl = getPath() + '/storage/provide/edit';
$list_deleteUrl = getPath() + '/storage/provide/delete';
$list_editWidth = "850px";
$list_editHeight = "300px";
$(function() {
	// 数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '操作',
			name : 'operate',
			align : 'center',
			width : 130,
			render : operateRender
		}, {
			display : '状态',
			name : 'status',
			align : 'center',
			width : 80,
			render:function(data){if(data.status=='ENABLE')return '启用';else return '禁用';}
		}, {
			display : '名称',
			name : 'name',
			align : 'center',
			width : 80
		}, {
			display : '地址',
			name : 'familyAddress',
			align : 'center',
			width : 120
		}, {
			display : '负责人',
			name : 'oldName',
			align : 'center',
			width : 80
		}, {
			display : '手机',
			name : 'phone',
			align : 'center',
			width : 150
		}, {
			display : '联系电话',
			name : 'workPhone',
			align : 'center',
			width : 80
		}, {
			display : 'email',
			name : 'email',
			align : 'center',
			width : 80
		}, {
			display : '业务员姓名',
			name : 'crashContract',
			align : 'center',
			width : 80
		}, {
			display : '业务员手机',
			name : 'contractPhone',
			align : 'center',
			width : 80
		}, {
			display : '付款方式',
			name : '',
			align : 'center',
			width : 220,
			render:payment
		}, {
			display : '描述',
			name : 'description',
			align : 'center',
			width : 200
		} ],
		onDblClickRow:function(){
			
		},
		url : getPath() + "/storage/provide/listData"
	}));

	// 回车事件
	$('#keyword').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

});

function payment(data){
	var payMethod='';
	if(data.alipay == 1){
		payMethod+='[支付宝]';
	}
	if(data.micropay == 1){
		payMethod+='[微信钱包]';
	}
	if(data.baidu == 1){
		payMethod+='[百度钱包]';
	}
	if(data.bankCard == 1){
		payMethod+='[银行卡]';
	}
	return payMethod;
}

// 操作
function operateRender(data) {
	if (data.provideId == null || data.provideId == '') {//禁用------>可以编辑
		return '<a href="javascript:editRow({id:\'' + data.id + '\'});">初始化</a>';
	} else if (data.provideId !=null && data.provideId != '' && data.status == 'DISABLED') {//启用
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'ENABLE\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	} else if (data.provideId !=null && data.provideId != '' && data.status == 'ENABLE') {//启用
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'DISABLED\'});">禁用</a>';
	} else {
		console.info('数据错误。。。。');
	}
}

/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 'ENABLE') {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/storage/provide/onOff', {
				id : data.id,
				status : 'ENABLE'
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
	} else if (data.status == 'DISABLED') {
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/storage/provide/onOff', {
				id : data.id,
				status : 'DISABLED'
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
		console.info('参数错误...');
	}
}

// 查询
function searchData() {
	var keyword = $("#keyword").val();
	if (keyword && ($('#keyword').attr("defaultValue") != keyword)) {
		$list_dataParam['keyword'] = keyword;
	} else {
		delete $list_dataParam['keyword'];
	}
	var status = $("#status").val();
	if (status) {
		$list_dataParam['status'] = status;
	} else {
		delete $list_dataParam['status'];
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyword'];
	delete $list_dataParam['status'];
	$("#status").val('');
	$("#keyword").attr("value", $("#keyword").attr("defaultValue"));
	searchData();
}
/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}