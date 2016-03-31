$list_addUrl = getPath()+"/basedata/sqlupgrade/add";//新增url
$list_editUrl = getPath()+"/basedata/sqlupgrade/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/basedata/sqlupgrade/delete";//删除url
$list_editWidth = "750px";
$list_editHeight = "300px";
$list_dataType = "升级脚本";//数据名称
$(document).ready(
			function() {
				$(document).keydown(function(e){
					var charCode= ($.browser.msie)?e.keyCode:e.which;  
					if(charCode==13){  
						$("#searchBtn").click();
				    }});
					$("#main").ligerLayout({});
					/*$("#toolBar").ligerToolBar({
						items:[{id:'sync',text:'同步脚本',click:syncRow,icon:'config'}]
						});*/
					/*$("#toolBar").append(
						'<div style="float:right;padding-right:50px;display:inline;">'
				    	+'	<form onsubmit="searchData();return false;">'	
					    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="脚本名称" defaultValue="脚本名称" value="脚本名称" id="searchKeyWord" class="input"/>'
					    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
				    	+'	</form>'
				    	+'</div>'
					);*/
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam,
									{
										columns : [ {
											display : '操作',
											name : 'operate',
											align : 'center',
											width : 80,
											render : operateRender
										},{
											display : '名称',
											name : 'name',
											align : 'center',
											width : 200
										},{
											display : '模块',
											name : 'moduleDesc',
											align : 'center',
											width : 80
										}, {
											display : 'oracle脚本',
											name : 'oracleScript',
											align : 'center',
											width : 200,
											render:oracleRender
										},{
											display : 'mysql脚本',
											name : 'mysqlScript',
											align : 'center',
											width : 200,
											render:mysqlRender
										},{
											display : '创建时间',
											name : 'createTime',
											align : 'center',
											width : 80
										}, {
											display : '执行时间',
											name : 'runTime',
											align : 'center',
											width : 80
										}, {
											display : '执行状态',
											name : 'runStatusDesc',
											align : 'center',
											width : 80
										}],
										url : getPath()
												+ '/basedata/sqlupgrade/listData',
										 delayLoad:true
									}));
					searchData();
 	});




function operateRender(data,filterData){
	var operateStr ="";
	operateStr +='<a href="javascript:runRow({id:\''+data.id+'\'})">执行</a>';
	return operateStr;
}

function oracleRender(data,filterData){
	var operateStr ="";
	operateStr +='<span title="'+data.oracleScript+'">'+data.oracleScript+'</span>';
	return operateStr;
}

function searchData(){
	var name=$("#searchKeyWord").val();
	if(name==null || name == '' || name == '脚本名称/脚本内容'){
		delete $list_dataParam['name'];
	}else{
		$list_dataParam['name'] = name.toUpperCase();
	}
	var status=$("#status").val();
	if(status==null || status == ''){
		delete $list_dataParam['status'];
	}else{
		$list_dataParam['status'] = status;
	}
	if(null == $("#module").val() || '' == $("#module").val()){
		delete $list_dataParam['module'];	
	}else{
		$list_dataParam['module'] = $("#module").val();
	}
	resetList();
}
function mysqlRender(data,filterData){
	var operateStr ="";
	operateStr +='<span title="'+data.mysqlScript+'">'+data.mysqlScript+'</span>';
	return operateStr;
}

function runRow(obj){
	var objId = obj.id;
	$.post(getPath()+"/basedata/sqlupgrade/runSql",{sqlId:objId},function(data){
		
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();
		}else{
			art.dialog.alert(data.MSG);
		}
	},'json');
}

function syncRow(){
	art.dialog({
	    content: $("#sysDate")[0], 
	    ok: function () {
	    	var syncdate=$("#showDay").val();
	    	//if(syncDate==null || syncDate==''){
	    	//	art.dialog.tips("请选择同步日期！");
	    	//	return false;
	    	//}else{
				artDialog.confirm("确定进行同步吗？",function(){ 	
				Loading.init(null, '数据同步中，请耐心等候......');				
				$.post(getPath()+"/basedata/sqlupgrade/loadSyncSqlData",{synctype:'sql',syncdate:syncdate},function(data){
					Loading.close();
					resetList();
					if(data.STATE=='SUCCESS'){
						art.dialog.tips(data.MSG);
						
					}else{
						art.dialog.alert(data.MSG);
					}
				},'json');
				});
	    	//}
	    	},
	    cancelVal: '关闭',
	 	cancel: true //为true等价于function(){}
	});
}
function syncautoRow(){
	artDialog.confirm("确定进行同步吗？",function(){ 				
		$.post(getPath()+"/basedata/sqlupgrade/loadSyncSqlData",{synctype:'sql',syncdate:mt},function(data){
			resetList();
			if(data.STATE=='SUCCESS'){
				art.dialog.tips(data.MSG);
				
			}else{
				art.dialog.alert(data.MSG);
			}
		},'json');
		});
}
/***********************选择模块************************/

$(function(){
	$("#businessType").change(function(){
		getModule($(this).val());
	});
	
});

/**
 * 得到模块
 * @param parent
 */
function getModule(parentValue){
	$.post(getPath()+"/projectm/dbscript/getModule",{parentValue:parentValue},function(result){
		var $moduleComp = $("#module");
		removeOption($moduleComp);
		var moduleList = result.moduleList;
		for(var i =0; i< moduleList.length; i++){
			var moduleMap = moduleList[i];
			$moduleComp.append("<option value='"+moduleMap.value+"'>"+moduleMap.name+"</option>");
		}
	},"json");
	
}

/**
 * 删除选项
 * @param selectComp
 */
function removeOption(selectComp){
	selectComp.children("option").each(function(){
		$(this).remove();
	});
}