$list_addUrl = getPath() + '/ebsite/backbill/add';
$list_editUrl = getPath() + '/ebsite/backbill/edit';
$list_deleteUrl = getPath() + '/lebsite/backbill/delete';
$list_editWidth = (window.screen.width  * 58 /100)+"px";
$list_editHeight = (window.screen.height * 53 /100)+"px";
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
			display : '订单编码',
			name : 'order.orderNo',
			align : 'center',
			width : 120,
			render: showDetail
		}, {
			display : '申请人',
			name : 'member.userName',
			align : 'center',
			width : 120
		}, {
			display : '申请时间',
			name : 'applyDateTime',
			align : 'center',
			width : 150
		}, {
			display : '退款类型',
			name : 'backType.name',
			align : 'center',
			width : 120
		}, {
			display : '退款金额',
			name : 'backMoney',
			align : 'center',
			width : 80
		}, {
			display : '退款状态',
			name : 'status.name',
			align : 'center',
			width : 120
		}, {
			display : '货物状态',
			name : 'goodsStatus.name',
			align : 'center',
			width : 120
		}, {
			display : '审批信息',
			name : 'checkInfo',
			align : 'center',
			width : 180
		}, {
			display : '财务审批信息',
			name : 'financeCheckInfo',
			align : 'center',
			width : 180
		}, {
			display : '退款备注',
			name : 'desc',
			align : 'center',
			width : 150
		}],
		url : getPath() + "/ebsite/backbill/listData",
		checkbox:true,
		delayLoad : true,
		onDblClickRow:function(rowData,rowIndex,rowDomElement){
			
	    }
	}));
	
	var params ={};
	params.width = 260;
	params.inputTitle = "申请时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);

	//初始化时间
	MenuManager.menus["effectdate"].setValue(new Date().toLocaleDateString(),new Date().toLocaleDateString());
	MenuManager.menus["effectdate"].confirm();
	
	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
	searchData();
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
	//审核
//	console.info(data.status);
	if(data.status.value == 'REFUNDING'){
		return '<a href="javascript:check({id:\'' + data.id + '\'});">审核</a>';
	}
	//暂无操作
}

//查看订单
function showDetail(data){
	//查看
	return '<a href="javascript:viewBackBill({id:\'' + data.id + '\'});">'+data.order.orderNo+'</a>';
}

function check(data){
	
	//判断是否有足够的权限
	if(sh != 'Y'){
		art.dialog.tips('您没有权限操作！');
		return ;
	}
	var flag = true;
	var dlg = art.dialog.open(getPath()+'/ebsite/backbill/check/'+data.id,
	{title:'审核',
	 lock:true,
	 width:(window.screen.width  * 58 /100)+'px',
	 height:(window.screen.height * 53 /100)+'px',
	 id:'check',
	 button:[{name:'通过',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.checkPass){
				dlg.iframe.contentWindow.checkPass(this);
			}
			return false;
		}},{name:'驳回',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.turndown){
				dlg.iframe.contentWindow.turndown(this);
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

function viewBackBill(data){
	var dlg = art.dialog.open(getPath()+'/ebsite/backbill/viewBackBill/'+data.id,
	{title:'查看',
	 lock:true,
	 width:(window.screen.width  * 58 /100)+'px',
	 height:(window.screen.height * 53 /100)+'px',
	 id:'viewBackBill',
	 button:[{name:'关闭'}]
	});
}


// 查询
function searchData() {
	var keyWord = $("#keyWord").val().trim();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	//按状态查
	var status = $("#status").val();
	if (status) {
		$list_dataParam['status'] = status;
	} else {
		delete $list_dataParam['status'];
	}
	//按单据类型查
	var backType = $("#backType").val();
	if (backType) {
		$list_dataParam['backType'] = backType;
	} else {
		delete $list_dataParam['backType'];
	}
	
	//按开始时间和结束时间查询
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["effectdate"]){
		startDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	//查询开始时间
	if(startDate != ""){
		$list_dataParam['startTime'] = startDate;
	} else {
		delete $list_dataParam['startTime'];
	}
	//查询结束时间
	if(endDate != ""){
		$list_dataParam['endTime'] = endDate;
	} else {
		delete $list_dataParam['endTime'];
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['status'];
	MenuManager.menus["effectdate"].resetAll();
	
	$("#status").val('');
	$("#backType").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	searchData();
}

//批量审批退单
function batchCheck(){
	//打开页面
	//记录选中的值
	var HtmlStr='<div style="width: 300px;height: 130px;padding: 20px;">'+
					'<div>审批备注：</div>'+
					'<div style="margin-top: 10px;">'+
						'<textarea id="batchCheckTxt" style="width: 98%;height: 90px;" placeholder="请输入审批备注..."></textarea>'+
					'</div>'+
				'</div>';
	
	//判断是否开启窗口
	//1、判断是否至少选择一行
	var rows=$list_dataGrid.getSelectedRows();
	if(rows && rows.length<=0){
		art.dialog.tips("请至少选择一行！");
		return;
	}
	var rowIds=[];
	for(var i=0;i<rows.length;i++){
		//具有审批的数据才加入
		var row=rows[i];
		if(row.status.value == 'REFUNDING'){//如果为退款中或者财务驳回才可以审核
			rowIds.push(row.id);
		}
	}
	if(rowIds && rowIds.length<=0){//表示选择的数据有错误
		art.dialog.tips("你选择的数据没有审核的需求，请核对！");
		return;
	}
	console.info("ids:"+rowIds);
	var flag=true;
	art.dialog({
	    content: HtmlStr,
	    title:'批量审批',
	    id: 'batchCheck',
	    lock:true,
	    width:'300px',
		height:'auto',
		ok: function () {
			//请求
			if(flag){
				//点击之后，需要禁用
				flag=false;
				var batchCheckTxt=$(this.content()).find('#batchCheckTxt').val();
				console.info(batchCheckTxt);
				var _this=this;
				$.post(base+'/ebsite/backbill/batchCheck',{ids:rowIds.join(','),checkInfo:batchCheckTxt},function(res){
					if(res.STATE=='SUCCESS'){
						//1秒钟之后关闭窗口
						art.dialog.tips(res.MSG);
						_this.time(1);
					}else{
						//默认不关闭窗口
						flag=true;
					}
				},'json');
		        return false;
			}
			return false;
	    },
	    cancelVal: '关闭',
	    cancel: true ,
		close:function(){
			searchData();
		}
	});
}

function hello(dlg){
	return false;
}

/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}