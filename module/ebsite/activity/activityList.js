$list_addUrl = getPath() + '/ebsite/activity/add';
$list_editUrl = getPath() + '/ebsite/activity/edit';
$list_deleteUrl = getPath() + '/ebsite/activity/delete';
$list_editWidth = "630px";
$list_editHeight = "450px";
$(function() {
	// 数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '操作',
			name : 'operate',
			align : 'left',
			width : 170,
			render : operateRender
		}, {
			display : '标题',
			name : 'title',
			align : 'left',
			width : 120
		}, {
			display : '图片',
			name : '',
			align : 'center',
			width : 120,
			height:100,
			render:function(data){
				if(data.photoPath != "" && data.photoPath != null){
					return "<img width='100px' height='70px' src="+getPath()+"/images/" + data.photoPath.replace("size","100X75")+">";
				}
			}
		},{
			display : '商品列表图片',
			name : '',
			align : 'center',
			width : 120,
			height:100,
			render:function(data){
				if(data.activityListPhotoPath != "" && data.activityListPhotoPath != null){
					return "<img width='100px' height='70px' src="+getPath()+"/images/" + data.activityListPhotoPath.replace("size","100X75")+">";
				}
			}
		},{
			display : '客户端',
			name : 'differentiateTypeSt',
			align : 'center',
			width : 150
		},{
			display : '级别',
			name : 'showTypeSt',
			align : 'center',
			width : 150
		}, {
			display : '类型',
			name : 'typeSt',
			align : 'center',
			width : 150
		}, {
			display : '排序索引',
			name : 'index',
			align : 'center',
			width : 80
		}, {
			display : '打开方式',
			name : 'openTypeSt',
			align : 'center',
			width : 150
		}, {
			display : '商品',
			name : 'goods.name',
			align : 'center',
			width : 150
		}, {
			display : '类目',
			name : 'goodsCategory.name',
			align : 'center',
			width : 150
		},{
			display : '预售抢购活动',
			name : 'activityName',
			align : 'center',
			width : 150
		}, {
			display : '特产省份',
			name : 'basicData.name',
			align : 'center',
			width : 150
		}, {
			display : '创建时间',
			name : 'createTime',
			dateFormat:"yyyy-MM-dd HH:mm",formatters:"date",
			align : 'center',
			width : 150
		}, {
			display : '创建人',
			name : 'createName',
			align : 'center',
			width : 150
		}, {
			display : '跳转链接',
			name : 'value',
			align : 'center',
			width : 150,
			render:function(data){
				if(data.openType== "WEB"){
					return data.value;
				}
				return ""
			}
		}, {
			display : '是否banner',
			name : 'isBanner',
			align : 'center',
			width : 80,
			render:function(data){
				if(data.isBanner== "" || data.isBanner==0){
					return "否";
				}
				return "是"
			}
		},{
			display : '是否启用',
			name : 'isUse',
			align : 'center',
			width : 80,
			render:function(data){
				if(data.isUse== "" || data.isUse==0){
					return "否";
				}
				return "是"
			}
		}],
		url : getPath() + "/ebsite/activity/listData"
	}));

	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

});

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
	var html = "";
	if(hdbj_permission=='Y' && hdbj_permission!='undifined'){
		html+='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
	}
	if(hdsc_permission=='Y' && hdsc_permission!='undifined'){
		html+='| <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	if(hdbj_permission=='Y' && data.type && data.type.value=='ACTIVITY' && data.isBanner==0){
		html+='| <a href="javascript:goodsMannager(\''+data.id+'\');"><span style="color:green">商品设置<span></a>';
	}
	return html;
}


function goodsMannager(id){
	var flag = false;
	var url= base+"/ebsite/activityItem/list?id="+id
	var dlg = art.dialog.open(url,
			{title:"商品管理",
			 lock:true,
			 width:"600px",
			 height:(window.screen.height * 51 /100)+"px",
			 id:"goodsMannager",
			 button:[{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
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

// 查询
function searchData() {
	var keyWord = $("#keyWord").val().trim();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	var type = $("#type").val();
	if (type && type!="类型") {
		$list_dataParam['type'] = type;
	} else {
		delete $list_dataParam['type'];
	}
	
	var differentiateType = $("#differentiateType").val();
	if (differentiateType && differentiateType!="客户端" ) {
		$list_dataParam['differentiateType'] = differentiateType;
	} else {
		delete $list_dataParam['differentiateType'];
	}
	
	var showType = $("#showType").val();
	if (showType && showType!="级别") {
		$list_dataParam['showType'] = showType;
	} else {
		delete $list_dataParam['showType'];
	}
	
	var openType = $("#openType").val();
	if (openType && openType!="打开方式") {
		$list_dataParam['openType'] = openType;
	} else {
		delete $list_dataParam['openType'];
	}
	
	if($("#isBanner").is(':checked')){
		$list_dataParam['isBanner'] = 1;
	}else{
		/*$list_dataParam['isBanner'] = 0;*/
		delete $list_dataParam['isBanner'];
	}
	var isUse = $("#isUse").val();
	if(isUse!=2){
		$list_dataParam['isUse'] = isUse;
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['type'];
	delete $list_dataParam['differentiateType'];
	delete $list_dataParam['showType'];
	delete $list_dataParam['openType'];
	delete $list_dataParam['isBanner'];
	delete $list_dataParam['isUse'];
	$("#type").val('');
	$("#differentiateType").val('');
	$("#showType").val('');
	$("#openType").val('');
	$("#isBanner").val('');
	$("#isUse").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	$("#isBanner").attr("checked",false);
	searchData();
}

//编辑行
function editRow(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[{name:'确定',callback:function(){
					 	var pageType = this.iframe.contentWindow.$("#pageType").val();
					 	var image_size = this.iframe.contentWindow.$("#image_size").val();
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							if(pageType == 1 && image_size == 100) {
								art.dialog.alert("<br>保存失败:" +"<br><br>&nbsp;所选择的图片中，存在内存大小超出设定范围的图片");
							} else if(pageType == 2 && image_size == 50) {
								art.dialog.alert("<br>保存失败:" +"<br><br>&nbsp;所选择的图片中，存在内存大小超出设定范围的图片");
							} else {
								dlg.iframe.contentWindow.saveEdit(this);
							}
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					
					 if(flag){
						 if(typeof(afterEditRow)=='function'){
							 afterEditRow();
						 }
						 refresh();
					 }
				 }
				});
	}
}

/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}