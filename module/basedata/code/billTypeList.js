$list_addUrl = getPath()+"/basedata/billType/add";//新增url
$list_editUrl = getPath()+"/basedata/billType/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/basedata/billType/delete";//删除url
$list_editWidth = "570px";
$list_editHeight = "450px";
$list_dataType = "单据类型";//数据名称
$(document).ready(
			function() {
					$("#main").ligerLayout({});
					
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam,
									{
										columns : [ {
											display : '单据编号',
											name : 'number',
											align : 'center',
											width : 150
										}, {
											display : '单据名称',
											name : 'name',
											align : 'center',
											width : 150
										}, {
											display : '权限项',
											name : 'permissionItem.name',
											align : 'center',
											width : 150
										}, {
											display : '排序号',
											name : 'idx',
											align : 'center',
											width : 50
										}, {
											display : '单据描述',
											name : 'description',
											align : 'center',
											width : 150
										}, {
											display : '数据来源',
											name : 'syncType',
											align : 'center',
											width : 50,
											render : syncTypeRender
										},{
											display : '操作',
											name : 'operate',
											align : 'center',
											width : 150,
											render : operateRender
										} ],
										url : getPath()
												+ '/basedata/billType/listData?isModuleType='+isModuleType+'&moduleType='+moduleType
									}));
				});




function operateRender(data,filterData){
	var operateStr ="";
	operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|';
	operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return operateStr;
}
function syncTypeRender(data){
	return data.syncType=='CLOUD'?"云端":"本地";
}

/**
 * 点击新增按钮前,设置参数
 * @returns
 */
function getAddRowParam(){
	if(moduleType==""|| moduleType==null){
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {moduleType:null};
	}
	var   moduleEmun= $("#moduleEmunDiv").html().split(",");
	var isGoOn=0;
	for ( var i = 0; i < moduleEmun.length; i++) {
		if($.trim(moduleEmun[i])==moduleType){
			isGoOn++;
		}
	}
	if(isGoOn>0){
		return {moduleType:moduleType};
	}else{
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {moduleType:null};
	}
}