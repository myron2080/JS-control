$list_editUrl = getPath()+"/hr/wagestemplate/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/wagestemplate/add";//新增url
$list_deleteUrl = getPath()+"/hr/wagestemplate/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "180px";
$list_dataType = "工资条模板";//数据名称
var  g;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                {display: '工资条编码', name: 'wageNumber', align: 'left', width:80},
      			{display: '工资条名称', name: 'name', align: 'left', width:80},
      			{display: '工资模板描述', name: 'remark', align: 'left', width:200 },
      			{display: '缺省模板', name: 'isDefult.name', align: 'left', width:80 },
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/hr/wagestemplate/listData',
        delayLoad:false,
        onSelectRow:function(data){
        	//alert(data.isDefult.value);
      	   if(data.isDefult.value=='YES'){
      		   $("#setDeafult_a").html(" 取消缺省模板");
      	   }else{
      		 $("#setDeafult_a").html("设置缺省模板");
      	   }
        }
    }));
	$("#selectData").click(function(){
		selectList();
	});
	$("#addNew").click(function(){
		beforeAddRow();
	});
	//清除
	$("#clearData").click(function(){	
		MenuManager.menus["createTime"].resetAll();
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	});
	eventFun($("#keyConditions"));
	$("#setDeafult").click(function(){
		setDefult();
	});
});

function operateRender(data,filterData){
	//var e = (data.status=='ENABLE'?'DISABLED':'ENABLE');
	//var t = (data.status=='ENABLE'?'禁用':'启用');
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	//+ '|<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>';
}
function setDefult(){
	var row = $list_dataGrid.getSelectedRow();
    var  param={};
    param['id'] = row.id;
    param['isDefult'] = (row.isDefult.value=='YES'?'NO':'YES');
	//alert(row.id);
	var t = (row.isDefult.value=='YES'?'取消':'设置为');
	art.dialog.confirm('确定'+t+'缺省模板吗?',function(){
	$.post(getPath() + '/hr/wagestemplate/setDfult',param,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}
/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRow(config){
	var t = (config.status=='ENABLE'?'启用':'禁用');
	art.dialog.confirm('确定'+t+'数据吗?',function(){
	$.post(getPath() + '/hr/salaryItem/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//时间
	/*var queryStartDate = "";
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
	}*/
	//关键字条件
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	resetList();
}
function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}


function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	addRow({});
}
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
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'保存',callback:function(){
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
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'保存',callback:function(){
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
				 button:[{name:'保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						//dlg.iframe.contentWindow.saveAdd(this,"CANCEL");
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
 * 
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
