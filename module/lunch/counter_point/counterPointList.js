$list_addUrl = getPath() + '/lunch/counterpoint/add';
$list_editUrl = getPath() + '/lunch/counterpoint/edit';
$list_deleteUrl = getPath() + '/lunch/counterpoint/delete';
$list_batchSetUrl = getPath() + '/lunch/counterpoint/batchSet';

$list_selectFloorUrl = getPath() + '/lunch/counterfloor/list';
$list_editWidth = "500px";
$list_editHeight = "250px";
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
			display : '编码',
			name : 'encode',
			align : 'center',
			width : 120
		}, {
			display : '城市',
			name : 'city.name',
			align : 'center',
			width : 150
		}, {
			display : '简称',
			name : 'simplePinyin',
			align : 'center',
			width : 80
		}, {
			display : '柜点名称',
			name : 'name',
			align : 'center',
			width : 150,
			render : showName
		}, {
			display : '经度',
			name : 'longitude',
			align : 'center',
			width : 80
		}, {
			display : '纬度',
			name : 'latitude',
			align : 'center',
			width : 80
		}, {
			display : '状态',
			name : 'isStartUse',
			align : 'center',
			width : 80,
			render : isStartUse
		}, {
			display : '创建人',
			name : 'creator.name',
			align : 'center',
			width : 80
		}, {
			display : '创建时间',
			name : 'createTime',
			align : 'center',
			width : 150
		}, {
			display : '描述',
			name : 'description',
			align : 'center',
			width : 200
		} ],
		checkbox : true,
		url : getPath() + "/lunch/counterpoint/listData"
	}));

	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

});

/**
 * 显示柜点名称
 * 
 * @param data
 */
function showName(data) {
	// 判断是否地图标点
	if (data.isMapMarker == 1) {
		return data.name + "&nbsp&nbsp" + ("<img style='height:15px;' src='" + getPath() + "/default/style/images/marker_red.png'/>");
	} else {// 默认也是0
		return data.name;
	}
}

// 状态显示方法
function isStartUse(data) {
	if (data.isStartUse == 1) {
		return '启用';
	} else if (data.isStartUse == 0) {
		return '<span style="color:red">禁用</span';
	} else {
		// 不显示状态
		var obj = {
			fileName : 'counterPointList.js',
			lineNumber : '46',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}

// 操作
function operateRender(data) {
	
	// 标记：启用；可以地图标点；禁用可以标记；这里判断
	if (data.isStartUse == 1) {
		var caozuo = '';
		caozuo+='<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a> | ';
		caozuo+='<a href="javascript:mapMark({id:\'' + data.id + '\'});">地图标记</a> | ';
		caozuo+='<a href="javascript:selectFloor(\''+data.id+'\');">楼栋设置</a>';
		return caozuo;
		//return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a> | <a href="javascript:mapMark({id:\'' + data.id + '\'});">地图标记</a>';
	} else if (data.isStartUse == 0) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	} else {
		// 不显示操作
		var obj = {
			fileName : 'counterPointList.js',
			lineNumber : '61',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
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
			$.post(getPath() + '/lunch/counterpoint/onOff', {
				id : data.id,
				isStartUse : 1
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
			$.post(getPath() + '/lunch/counterpoint/onOff', {
				id : data.id,
				isStartUse : 0
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

/**
 * 地图标记
 * 
 * @param id
 */
function mapMark(data) {
	art.dialog.data("flag", false);
	art.dialog.open(getPath() + '/lunch/mapmark/toMapMark?fid=' + encodeURIComponent(data.id), {
		lock : true,
		id : "toMapMark",
		title : "柜点地图标记",
		width : 1082,
		height : 590,
		close : function() {
			if (art.dialog.data("flag")) {
				art.dialog.tips("保存成功", null, "succeed");
				searchData();
			}
		}
	});
}

function batchSet() {
	// 1、判断是否至少选择一行
	var rows = $list_dataGrid.getSelectedRows();
	if (rows && rows.length <= 0) {
		art.dialog.tips("请至少选择一条柜点记录！");
		return;
	}
	var rowIds = [];
	for ( var i = 0; i < rows.length; i++) {
		rowIds.push(rows[i].id);
	}
	// rowIds表示需要设置菜品
	// art.dialog.tips('您需要设置的柜点为'+rowIds.join(',')+';改功能等待开发...');
	var dlg = art.dialog.open(getPath() + '/lunch/dishes/setDishesPage?counterPointIds=' + rowIds.join(','), {
		title : '设置菜品',
		lock : true,
		width : '800px',
		height : '400px',
		id : "batchSet",
		button : [ {
			name : '确定',
			callback : function() {
				if (dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveSet) {
					dlg.iframe.contentWindow.saveSet(this);
				}
				return false;
			}
		}, {
			name : '取消',
			callback : function() {
				return true;
			}
		} ]
	});
}

// 查询
function searchData() {
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	var lunchCityId = $("#lunchCityId").val();
	if (lunchCityId && ($('#lunchCityId').attr("defaultValue") != lunchCityId)) {
		$list_dataParam['lunchCityId'] = lunchCityId;
	} else {
		delete $list_dataParam['lunchCityId'];
	}
	var isStartUse = $("#isStartUse").val();
	if (isStartUse) {
		$list_dataParam['isStartUse'] = isStartUse;
	} else {
		delete $list_dataParam['isStartUse'];
	}
	// 是否标点，级联搜索
	var punctuation = $('#punctuation').attr("checked");
	if (punctuation && punctuation == 'checked') {
		$list_dataParam['punctuation'] = 1;
	} else {
		delete $list_dataParam['punctuation'];
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['isStartUse'];
	delete $list_dataParam['punctuation'];
	delete $list_dataParam['lunchCityId'];
	$('#punctuation').attr('checked', false);
	$("#isStartUse").val('');
	$("#lunchCityId").val('');
	$("#lunchCityName").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
}
/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}

//设置楼栋
function selectFloor(id){
	paramStr = '?cpid='+id;
	var flag = false;
	var dlg = art.dialog
	.open($list_selectFloorUrl+paramStr,
			{
				id : "sentCouponsData",
				title : '设置楼栋',
				background : '#333',
				width : 875,
				height : 465,
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