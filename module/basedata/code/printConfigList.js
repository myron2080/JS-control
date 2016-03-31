$list_addUrl = getPath()+"/basedata/printConfig/add";//新增url
$list_editUrl = getPath()+"/basedata/printConfig/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/basedata/printConfig/delete";//删除url
$list_editWidth = "850px";
$list_editHeight = "450px";
$list_dataType = "打印配置";//数据名称
$(document).ready(
			function() {
					$("#main").ligerLayout({});
					
					$("#toolBar").append(
						'<div style="float:left;padding-left:5px;display:inline;">'
				    	+'	<form onsubmit="searchData();return false;">'	
					    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称" defaultValue="名称" value="名称" id="searchKeyWord" class="input"/>'
					    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
				    	+'	</form>'
				    	+'</div>'
					);
					$("#toolBar").ligerToolBar({
						items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
						});
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam,
									{
										columns : [ {
											display : '编号',
											name : 'number',
											align : 'center',
											width : 150
										},{
											display : '单据名称',
											name : 'name',
											align : 'center',
											width : 150
										},{
											display : '单据类型',
											name : 'billType.name',
											align : 'center',
											width : 150
										}, {
											display : '取数方式',
											name : 'fetchType.name',
											align : 'center',
											width : 150
										}, {
											display : '取数配置',
											name : 'fetchConfig',
											align : 'center',
											width : 300
										},{
											display: '数据来源', 
											name: 'syncType', 
											align: 'center', 
											width: 50,
											render:syncTypeRender
										},{
											display : '操作',
											name : 'operate',
											align : 'center',
											width : 150,
											render : operateRender
										} ],
										url : getPath()
												+ '/basedata/printConfig/listData?isModuleType='+isModuleType+'&moduleType='+moduleType
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