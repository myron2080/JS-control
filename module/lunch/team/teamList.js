/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/lunch/team/list';
$list_editUrl = getPath()+'/lunch/team/edit';
$list_addUrl = getPath()+'/lunch/team/add';
$list_deleteUrl = getPath()+'/lunch/team/delete';
$list_saveUrl = getPath()+'/lunch/team/save';
$list_resetPasswordUrl=getPath()+'/lunch/team/resetPassword';
$list_editWidth = "460px";
$list_editHeight = "300px";
$list_resetPasswordWidth="300px";
$list_resetPasswordHeight="160px";

$list_dataType = "团体管理";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
                {display: '操作', name : 'operate', align: 'center', width: 160,render : operateRender},
                {display: '账户名', name: 'account', align: 'center', width:100},
      			{display: '团体名称', name: 'teamName', align: 'center', width:100},     			
      			{display: '联系人', name: 'contactPerson', align: 'center', width:100},
      			{display: '联系电话', name: 'telephone', align: 'center', width:100},
      			{display: '详细地址', name: 'address', align: 'center', width:200},
      			{display: '备注', name: 'description', align: 'center', width:200},
      			{display: '状态', name: 'isUse', align: 'center', width:100,render : isUse}
        ],
        url:getPath()+"/lunch/team/listData"
    }));
	
	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
});

function clearInput(){
	$("#keyWord").val($("#keyWord").attr("defaultValue"));
	searchData();
}
/************************
 * 根据条件查询数据
 * **********************
 */

function searchData(){
	
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	
	var isUse = $("#eanble").val();
	if (isUse) {
		$list_dataParam['eanble'] = isUse;
	} else {
		delete $list_dataParam['eanble'];
	}
	resetList();
}

/**
 * 操作
 * 
 * @param data
 * @returns {String}
 */
function operateRender(data) {
	// 标记：启用；禁用可以编辑
	if (data.eanble == 1) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
	} else if (data.eanble == 0) {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a> | <a href="javascript:resetPassword({id:\'' + data.id + '\'});">重置密码</a>';
	} else {
		// 不显示操作
		var obj = {
			fileName : 'teamList.js',
			lineNumber : '84',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}

//重置密码
//function resetPassword
function resetPassword(rowData){
	if($list_resetPasswordUrl && $list_resetPasswordUrl!=''){
		var paramStr;
		if($list_resetPasswordUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=RESETPASSWORD&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=RESETPASSWORD&id='+rowData.id;
		}
		var flag = true;
		var dlg = art.dialog.open($list_resetPasswordUrl+paramStr,
				{title:getTitle('RESETPASSWORD'),
				 lock:true,
				 width:$list_resetPasswordWidth||'auto',
				 height:$list_resetPasswordHeight||'auto',
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
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/lunch/team/onOff', {
				id : data.id,
				eanble : 1
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
			$.post(getPath() + '/lunch/team/onOff', {
				id : data.id,
				eanble : 0
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
			fileName : 'teamList.js',
			lineNumber : '131',
			msg : '程序开发参数传入异常，请联系ljw'
		};
		sysout(obj);
	}
}
/**
 * 状态显示方法
 * 
 * @param data
 * @returns {String}
 */
function isUse(data) {
	if (data.eanble == 1) {
		return '启用';
	} else if (data.eanble == 0) {
		return '<span style="color:red">禁用</span';
	} else {
		// 不显示操作
		var obj = {
			fileName : 'teamList.js',
			lineNumber : '84',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}

/**
 * **************************************
 * 清空
 * **************************************
 * */
function onEmpty() {
	delete $list_dataParam['keyword'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	searchData();
}

/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
    }  
}



