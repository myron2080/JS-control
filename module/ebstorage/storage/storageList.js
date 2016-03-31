$list_dataType = "仓库管理";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/ebstorage/storage/simpleTreeData";
$list_addUrl = getPath() + '/ebstorage/storage/add';
$list_editUrl = getPath() + '/ebstorage/storage/edit';
$list_deleteUrl = getPath() + '/ebstorage/storage/delete';
$list_batchSetUrl = getPath() + '/ebstorage/storage/batchSet';
$list_editWidth="1050px";
$list_editHeight="550px";
$(function() {
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$("#initStorage").on("click",function(){
		initStorage();
	});
	// 数据列表
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val().trim();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	
	initSimpleDataTree();
	
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '操作',
			name : 'operate',
			align : 'center',
			width : 180,
			render : operateRender
		}, {
			display : '名称',
			name : 'storageName',
			align : 'center',
			width : 120,
			render : showName
		}, {
			display : '地址',
			name : 'address',
			align : 'center',
			width : 150
		}, {
			display : '负责人编码',
			name : 'person.number',
			align : 'center',
			width : 150
		}, {
			display : '负责人',
			name : 'person.name',
			align : 'center',
			width : 80
		}, {
			display : '负责人手机',
			name : 'person.phone',
			align : 'center',
			width : 150
		}, {
			display : '联系电话',
			name : 'person.workPhone',
			align : 'center',
			width : 80
		}, {
			display : '所属分店',
			name : 'name',
			align : 'center',
			width : 85
		} ],
		url : getPath() + "/ebstorage/storage/listData"
	}));

	$('#includeContainer').bind('change',searchData);
	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
	$(".addProLink").click(function(){
		addItem();
	});
	searchData();
});



function initSimpleDataTree(){
	$.post($tree_async_url,{},function(treeData){
		var tree = $.fn.zTree.init($("#"+$tree_container), {
			async: {
				enable: false
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					if(typeof(onTreeNodeClick) == "function"){
						onTreeNodeClick(event, treeId, treeNode);
					}
				},
				onAsyncSuccess:function(event, treeId, node, msg){
					if(typeof(onTreeAsyncSuccess) == "function"){
						onTreeAsyncSuccess(event, treeId, node, msg);
					}
				}
			},
			data:{
				simpleData:{
					enable: true,
					idKey: "id",
					pIdKey: "pid",
					rootPId: null
				}
			}
		},treeData);
		var nodes = tree.getNodes();
		if(nodes && nodes.length > 0){
			tree.expandNode(nodes[0], true, false, true);
			tree.selectNode(nodes[0]);
		}
		/*if(searchData){
			searchData();
		}*/
	},'json');
}
/**
 * 显示名称
 * 
 * @param data
 */
function showName(data) {
	// 判断是否地图标点
	if (data.mapoint == 1) {
		return data.storageName + "&nbsp&nbsp" + ("<img style='height:15px;' src='" + getPath() + "/default/style/images/marker_red.png'/>");
	} else {// 默认也是0
		return data.storageName;
	}
}
function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}
function initStorage(){
	$("#initStorage").text("初始化中...").off();
	$.post(getPath() + '/ebstorage/storage/initsave'
			, function(res) {
		if("初始化仓库成功"==res.MSG){
			art.dialog.tips(res.MSG);
		}else{
			art.dialog({
				content: res.MSG,
				time:5,
				close:function(){
					art.dialog.close();
				},
				width:200
			});
		}
		if (res.STATE == 'SUCCESS') {
			$("#initStorage").text("初始化仓库").on("click",function(){
				initStorage();
			});
			refresh();
		}
	}, 'json');
}
// 操作
function operateRender(data) {
	// 标记：启用；可以地图标点；禁用可以编辑；这里判断
	if (data.status == 'ENABLE') {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">禁用</a> | <a href="javascript:mapMark({id:\'' + data.storageId + '\'});">地图标记</a>';// | <a href="javascript:addressEdit({id:\'' + data.storageId + '\',id2:\''+data.id+'\'});">管辖地址</a> 
	} else if (data.status == 'DISABLED') {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.storageId + '\',id2:\''+data.id+'\'});">编辑</a>';  // | <a href="javascript:addressEdit({id:\'' + data.storageId + '\',id2:\''+data.id+'\'});">管辖地址</a> 
	} else {
		// 不显示操作
		var obj = {
			fileName : 'storageList.js',
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
	var _status = data.status == 1 ? 'DISABLED' : 'ENABLE';
	if(_status == 'DISABLED'){
		var msg = "确定禁用操作吗？"
	}else{
		var msg = "确定启用操作吗？"
	}
	art.dialog.confirm(msg, function() {
		//ebstorage/storage/
		$.post(getPath() + '/ebstorage/storage/onOff', {
			id : data.id,
			status : _status
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
}

/**
 * 地图标记
 * 
 * @param id
 */
function mapMark(data) {
	art.dialog.data("flag", false);
	art.dialog.open(getPath() + '/ebstorage/map/toMapMark?fid=' + encodeURIComponent(data.id), {
		lock : true,
		id : "toMapMark",
		title : "地图标记",
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

// 查询
function searchData() {
	//树形的参数
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	if(tree!=null && tree!=""){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes.length>0){
			if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
				delete $list_dataParam['orgId'];
				$list_dataParam['longNumber'] = selectNodes[0].longNumber;
			}else{
				$list_dataParam['orgId'] = selectNodes[0].id;
				$list_dataParam['longNumber'] = selectNodes[0].longNumber;
			}
		}else{
			delete $list_dataParam['orgId'];
			delete $list_dataParam['longNumber'];
		}
	}
	
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
	searchData();
}
//查看行
function viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			if(rowData.storageId == "" || rowData.storageId == null){
				paramStr = '&VIEWSTATE=VIEW&id='+rowData.id;
			}else{
				paramStr = '&VIEWSTATE=VIEW&id='+rowData.storageId;
			}
		}else{
			if(rowData.storageId == "" || rowData.storageId == null){
				paramStr = '?VIEWSTATE=VIEW&id='+rowData.id;
			}else{
				paramStr = '?VIEWSTATE=VIEW&id='+rowData.storageId;
			}
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				 width:"612px",
				 height:"150px",
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}
function addressEdit(rowData){
	var addurl=getPath() + '/ebstorage/storage/addressEdit';
	var paramStr;
	if(addurl.indexOf('?')>0){
		if(rowData.id == "" || rowData.id == null){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id2;
		}else{
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}
	}else{
		if(rowData.id == "" || rowData.id == null){
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id2;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
	}

	var flag = true;
	var address="仓库管辖地址"
	var dlg = art.dialog.open(addurl+paramStr,
			{title:address,
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:$list_dataType+"-EDIT",
			 button:[{name:'确定绑定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消绑定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.deleteAddress){
						dlg.iframe.contentWindow.deleteAddress(this);
					}
					return false;
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
//编辑行
function editRow(rowData){
	//判断是否有编辑权限
	if(bj != 'Y'){
		art.dialog.tips('您无权操作！');
		return ;
	}
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			if(rowData.id == "" || rowData.id == null){
				paramStr = '&VIEWSTATE=EDIT&id='+rowData.id2;
			}else{
				paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
			}
		}else{
			if(rowData.id == "" || rowData.id == null){
				paramStr = '?VIEWSTATE=EDIT&id='+rowData.id2;
			}else{
				paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:"612px",
				 height:"350px",
				 id:$list_dataType+"-EDIT",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(this);
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

//添加地址
function addItem(data){
	var item=$("#cloneTr").clone();
	item.find("#goodsNumber").attr("autocomp","{id:'autoInventoryGoods',type:1,tagId:'autoId[id]',backFun:'autoGoods',param:'{storageId:\\'"+$("#zcStorageId").val()+"\\'}',closeFun:'goodsAutoClose'}");
	item.removeAttr("id");
	if(null != data){//赋值
		var len = $("input[value='" + data.goodsId + "']").length;
		if(len>0){//该商品已经 存在 
			return false;
		}
		item.find("#goodsId").val(data.goodsId);
		item.find("#goodsId").parents("td").find("span").text(data.goodsNumber);
		item.find("#goodsNumber").val(data.goodsNumber);

		
		item.find("#goodsName").text(data.goodsName);
		item.find("#specifications").text(data.specifications);
		item.find("#unit").text(data.unit);
		
		item.find("#price").parents("td").find("span").text(data.outprice);//调拨单价
		item.find("#price").val(data.outprice);
		
		item.find("#outCount").parents("td").find("span").text(data.outcount);//调拨数量
		item.find("#outCount").val(data.outcount);
		
		item.find("#getCount").parents("td").find("span").text(data.actcount);//实收数量
		item.find("#getCount").val(data.actcount);//实收数量
		
		item.find("#faultDesc").parents("td").find("span").text(data.description);//描述
		item.find("#faultDesc").val(data.description);//入库单价
		inventoryAvailableOne(item);
		caclOneTr(item);
	}
	$(".scrollContent").append(item);
	item.fadeIn();
	AutoComp.init();
}

//删除地址
function deleteItem(obj){
	if($(".scrollContent>tr").length>1){
		$(obj).parents("tr").remove();
	}else{
		art.dialog.tips("请至少保留一条商品信息",1.5);
	}
}


