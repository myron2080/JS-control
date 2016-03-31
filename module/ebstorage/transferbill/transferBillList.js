$list_addUrl = getPath() + '/transferBill/add';
$list_editUrl = getPath() + '/transferBill/edit';
$list_deleteUrl = getPath() + '/transferBill/delete';
$list_editWidth = (window.screen.width  * 58 /100)+"px";
$list_editHeight = (window.screen.height * 37 /100)+"px";
$list_dataType = "调拨";
$(function() {
	// 数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
		columns : [ {
			display : '操作',
			name : 'operate',
			align : 'center',
			width : 150,
			render : operateRender
		}, {
			display : '调拨编码',
			name : 'billNo',
			align : 'center',
			width : 130
		}, {
			display : '发货分店',
			name : '',
			align : 'center',
			width : 120,
			render:function(data){return data.fromStorage.name}
		}, {
			display : '申请人',
			name : 'provide.name',
			align : 'center',
			width : 100
		}, {
			display : '发货分店负责人/联系方式',
			name : '',
			align : 'center',
			width : 150,
			render:function(data){if(data.fromStorage != null && data.fromStorage.person != null){
				return data.fromStorage.person.name+'/'+data.fromStorage.person.phone;
				}else{
					return '';
				}
			}
		}, {
			display : '收货分店',
			name : '',
			align : 'center',
			width : 100,
			render:function(data){if(data.toStorage != null){return data.toStorage.name}else{return ''}}
		}, {
			display : '收货分店负责人/联系方式',
			name : '',
			align : 'center',
			width : 180,
			render:function(data){if(data.toStorage != null && data.toStorage.person != null){
					return data.toStorage.person.name+'/'+data.toStorage.person.phone;
				}else{
					return '';
				}
			}
		}, {
			display : '调拨备注',
			name : 'description',
			align : 'center',
			width : 150
		}, {
			display : '创建时间',
			name : 'createTime',
			align : 'center',
			width : 150
		}, {
			display : '审核信息',
			name : '',
			align : 'center',
			width : 180,
			render:function(data){if(data.approver != null ){
					return data.approver.privadeName+'于'+data.approveTime+'审核通过,备注:'+data.approveInfo;
				}else{
					return '';
				}
			}
		},
		{
			display : '确认收货信息',
			name : '',
			align : 'center',
			width : 180,
			render:function(data){
				if (data.confirmInfo!=null && data.confirmTime!=null && data.confirmorName!=null ) {
					return data.confirmorName+'于'+data.confirmTime+'确认收货,备注'+data.confirmInfo;
				} else{
					return '';
				}
			}
		}],
		url : getPath() + "/transferBill/listData"
	}));
		
	var params ={};
	params.width = 260;
	params.inputTitle = "创建时间";	
	MenuManager.common.create("DateRangeMenu","createDate",params);
	var param ={};
	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});

});
//审核
function approval(data){
	
	//判断
	if('Y' != sh){
		art.dialog.tips('您无权操作！');
		return ;
	}
	
	var dlg = art.dialog.open(getPath() + '/transferBill/approval?id='+data.id,
			{title:'调拨审批',
			 lock:true,
			 width:(window.screen.width  * 53 /100)||'auto',
			 height:$list_editHeight||'auto',
			 id:'approval',
			 button:[{name:'同意',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'不同意',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.noPass(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 refresh();
			 }
			});
}
/**确认发货
 * add by lhh
 * 2015/11/5
 */
function confirmPast(data){
	
	//判断是否有发货的权限
	if('Y' != qrfh){
		art.dialog.tips('您无权操作！');
		return ;
	}
	art.dialog.confirm('请确认发货操作?',function(){
		$.post(getPath() + '/transferBill/enterConfirm',{id:data.id,status:'CONFIRMPAST',confirmDescription:'确认发货...'},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				refresh();
			}
		},'json');
		return true;
	},function(){
		return true;
	});
}
//确认收货
function enterPass(data){
	if(qr == 'Y'){
		var dlg = art.dialog.open(getPath() + '/transferBill/approval?enter=Y&id='+data.id,
				{title:'调拨货品确认',
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:'enterPass',
				 button:[{name:'通过',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.enterPass(this);
						}
						return false;
					}},{name:'不通过',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.noEnterPass(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 refresh();
				 }
				});
	}else{
		return '无权操作';
	}
}
//操作---编辑---删除----审批【确认收货】
function operateRender(data) {
	//审核通过就不可以编辑
	if(data.approveStatus!='UNAPPROVE'){
		if(data.approveStatus=='REJECT'){//已经驳回----重新提交然后在审核
			return '已驳回 | <a href="javascript:editRowExt({id:\'' + data.id + '\'});">编辑</a> | <a href="javascript:deleteRowExt({id:\'' + data.id + '\'});">删除</a>';
		}else{
			//判断是否是已经确认通过
			if(data.approveStatus == 'APPROVED'){//如果审核通过则需要确认调拨
				//如果审核通过。。。需要确认发货人
				return '审核通过 | <a href="javascript:confirmPast({id:\'' + data.id + '\'});">确认发货</a>';
			}else if(data.approveStatus == 'CONFIRMPAST'){//如果为确认发货
					return '发货中  | <a href="javascript:enterPass({id:\'' + data.id + '\'});">确认收货</a>';
			}else if(data.approveStatus == 'ENTERPASS'){
				return '已发货 | 已确认';
			}
		}
	}else if(data.approveStatus == 'UNAPPROVE' ){
		return '<a href="javascript:approval({id:\'' + data.id + '\'});">审核</a> | <a href="javascript:editRowExt({id:\'' + data.id + '\'});">编辑</a> | <a href="javascript:deleteRowExt({id:\'' + data.id + '\'});">删除</a>';
	}
}

function editRowExt(data){
	//判断是否有权限操作
	if('Y' == bj){//有编辑权限
		editRow(data);		
	}else{
		art.dialog.tips('你无权操作！');
	}
}
function deleteRowExt(data){
	//判断是否有权限操作
	if('Y' == sc){//有删除权限
		deleteRow(data);		
	}else{
		art.dialog.tips('你无权操作！');
	}
}
// 查询
function searchData() {
	var keyWord = $("#keyWord").val();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	var createTime_begin = "";
	var createTime_end = "";
	if(MenuManager.menus["createDate"]){
		createTime_begin = MenuManager.menus["createDate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["createDate"].getValue().timeEndValue;
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
	
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	delete $list_dataParam['createTime_end'];
	delete $list_dataParam['createTime_begin'];
	MenuManager.menus["createDate"].resetAll();
}
/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}