$list_editUrl = getPath()+"/projectm/dbscript/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/dbscript/add";//新增url
$list_deleteUrl = getPath()+"/projectm/dbscript/delete";//删除url
$list_editWidth = "728px";
$list_editHeight = "411px";

/***********************将新增查看的lock属性去掉 start************************/
//增加行
function addRow(source){
	if($list_addUrl && $list_addUrl!=''){
		var paramStr = '';
		if($list_addUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		if(typeof(getAddRowParam) == "function"){
			var param = getAddRowParam();
			//临时增加不满足则不打开窗口
			if(param=='notValidate') return;
			if(param){
				for(var p in param){
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_addUrl+paramStr,
				{title:getTitle('ADD'),
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 if(flag){
						 if(typeof(afterAddRow)=='function'){
							 afterAddRow();
						 }
						 resetList();
					 }
				 }
				});
	}
}



//查看行
function viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.id;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
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
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
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

/***********************将新增查看的lock属性去掉 end************************/
$(function(){
	bindEvent();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'opera', align: 'left', width: 120,render:opearender},
            {display: '所属行业', name: 'businessTypeName', align: 'left', width: 80},
            {display: '所属模块', name: 'moduleName', align: 'left', width: 80},
            {display: '脚本类型', name: 'scriptTypeName', align: 'left', width: 80},
            {display: '脚本名称', name: 'name', align: 'left', width: 180},
            {display: 'mysql脚本', name: 'mysqlScript', align: 'left', width: 250},
            {display: 'oracle脚本', name: 'oracleScript', align: 'left', width: 250},
            {display: '创建人', name: 'creator.name', align: 'left', width: 80},
            {display: '创建时间', name: 'formatCreateTime', align: 'left', width: 130},
            {display: '同步次数', name: 'sysnCount', align: 'left', width: 55}
            
        ],
        delayLoad:true,
        url:getPath()+'/projectm/dbscript/listData'
    }));
	
	searchData();
});

function opearender(rowData){
	return "<a style='cursor:pointer;' onclick=\"javascript:editRow({id:'"+rowData.id+"&copyAddFlag=true"+"'});\">复制新增</a>|<a style='cursor:pointer;' onclick=\"javascript:editRow({id:'"+rowData.id+"'});\">修改</a>|<a  style='cursor:pointer;' onclick=\"javascript:deleteRow({id:'"+rowData.id+"'});\">删除</a>";
}

function searchData(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		kw = kw.toUpperCase();
		$list_dataParam['key'] = kw;
	}
	
	if(null == $("#module").val() || '' == $("#module").val()){
		delete $list_dataParam['module'];	
	}else{
		$list_dataParam['module'] = $("#module").val();
	}
	
	if(null == $("#scriptType").val() || '' == $("#scriptType").val()|| '0' == $("#scriptType").val()){
		delete $list_dataParam['scriptType'];	
	}else{
		$list_dataParam['scriptType'] = $("#scriptType").val();
	}
	
	var creator = $("#creator").val();
	if(creator==$('#creator').attr('defaultValue')){
		creator = "";
	}
	if(null == creator || '' == creator){
		delete $list_dataParam['creator'];	
	}else{
		$list_dataParam['creator'] = creator;
	}
	
	//创建时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	
	resetList();
}

function bindEvent(){
	$("#queryStandardBtn").click(function(){
		art.dialog.open(getPath()+'/projectm/dbscript/standard',
				{title:"系统脚本维护规范",
				 width:"728px",
				 height:"411px",
				 id:"STANDARD",
				 button:[{name:'关闭',callback:function(){
						flag = false;
						return true;
					}}]
				});
	});
	
	$("#addBtn").click(function(){
		addRow();
	});
	
	$("#searchBtns").click(function(){
		searchData();
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


