$list_addUrl = getPath()+"/basedata/code/add";//新增url
$list_editUrl = getPath()+"/basedata/code/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/basedata/code/delete";//删除url
$list_editWidth = "630px";
$list_editHeight = "330px";
$list_dataType = "编号规则";//数据名称
var typeid = null;
var typename = null;
$(document).ready(
			function() {
					$("#main").ligerLayout({});
					
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam,
									{
										columns : [ {
											display : '单据类型',
											name : 'type.name',
											align : 'center',
											width : 150
										},
										{
											display : '规则名称',
											name : 'name',
											align : 'center',
											width : 150
										},  
										{
											display : '所属组织',
											name : 'codeOrg.name',
											align : 'center',
											width : 150
										}, {
											display : '是否允许断号',
											name : 'isInterrupt',
											align : 'center',
											width : 100,
											render:function(item){
												if(item.isInterrupt=="Y"){
													return '不允许';
												}else if(item.isInterrupt=="N"){
													return '允许';
												}
											}
										}, {
											display : '编码示例',
											name : 'example',
											align : 'center',
											width : 150
										}, {
											display : '状态',
											name : 'isDisable',
											align : 'center',
											width : 80,
											render:function(item){
												if(item.isDisable=="N"){
													return "启用";
												}else if(item.isDisable=="Y"){
													return "禁用";
												}
											}
										}, {
											display : '操作',
											name : 'operate',
											align : 'center',
											width : 150,
											render : operateRender
										} ],
										url : getPath()
												+ '/basedata/code/listData?isModuleType='+isModuleType+'&moduleType='+moduleType
									}));
				});




function operateRender(data,filterData){
	var e = (data.isDisable=='Y'?'N':'Y');
	var t = (data.isDisable=='Y'?'启用':'禁用');
	var operateStr ="";
	if(data.id){
	operateStr +='<a href="javascript:enableRowEvent({id:\''+data.id+'\',isDisable:\''+e+'\'},\''+t+'\');">'+t+'</a>' ;
//	operateStr +='<a href="javascript:viewRow({id:\''+data.id+'\'});">查看</a>|';
	if(e=="N"){
		operateStr +='|<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|';
		operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	}else{
		
		operateStr +='<a href="javascript:setAddRow(\''+data.type.id+'\',\''+data.type.name+'\');">设置</a>';
	}
	return operateStr;
}
function setAddRow(id,name){
	typeid = id;
	typename = name;
	addRow();
}
/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRowEvent(config,t){
	if(t=="禁用"){
		art.dialog.confirm('禁用会导致编号规则无效,是否继续?',function(){
			$.post(getPath() + '/basedata/code/updateStatus',config,function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					refresh();
				}
			},'json');
		});
		return;
	}
	$.post(getPath() + '/basedata/code/updateStatus',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}

/**
 * 点击新增按钮前,设置参数
 * @returns
 */
function getAddRowParam(){
	if(moduleType==""|| moduleType==null){
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {moduleType:null,typeid:typeid,typename:typename};
	}
	var   moduleEmun= $("#moduleEmunDiv").html().split(",");
	var isGoOn=0;
	for ( var i = 0; i < moduleEmun.length; i++) {
		if($.trim(moduleEmun[i])==moduleType){
			isGoOn++;
		}
	}
	if(isGoOn>0){
		return {moduleType:moduleType,typeid:typeid,typename:typename};
	}else{
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {moduleType:null,typeid:typeid,typename:typename};
	}
}
