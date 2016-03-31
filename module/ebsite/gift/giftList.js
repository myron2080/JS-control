/**
 * 礼包
 * by lttboy
 */
$list_addUrl = getPath()+"/ebsite/gift/add";//新增url
$list_editUrl = getPath()+"/ebsite/gift/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebsite/gift/delete";//删除url
$list_editWidth = "600px";
$list_editHeight = "300px";
$list_dataType = "礼包";//数据名称
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operation', align: 'center', width: 120,render:operation},
            {display: '名称', name: 'name', align: 'center', width: 120},
            {display: '编码', name: 'number', align: 'center', width: 80},
            {display: '状态', name: 'status.name', align: 'center', width: 80},
            {display: '类型', name: 'type.name', align: 'center', width: 80},
            {display: '开始时间', name: 'createTime', align: 'center', width: 120},
            {display: '结束时间', name: 'endTime', align: 'center', width: 120},
            {display: '有效期', name: 'validity', align: 'center', width: 80},
            {display: '备注', name: 'desc', align: 'center', width: 120},
            {display: '领取记录', name: '', align: 'center', width: 120,render:getRecord}
        ],
        delayLoad:true,
        url:getPath()+'/ebsite/gift/listData'
    }));
	
	/**
	 * 回车查询
	 */
	$('#searchKeyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
	
	searchData();
	params ={};
	params.inputTitle = "礼包日期";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
});
/**
 * 查询
 */
function searchData(){
	var beginDate = "";
	var endDate = "";
	if(MenuManager.menus["effectdate"]){
		beginDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	if(beginDate != ""){
		$list_dataParam['beginDate'] = beginDate;
	} else {
		delete $list_dataParam['beginDate'];
	}
	if(endDate != ""){
		$list_dataParam['endDate'] = endDate + " 23:59:59";
	} else {
		delete $list_dataParam['endDate'];
	}
	
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['keyWord'];
	}else{
		$list_dataParam['keyWord'] = kw;
	}
	
	var statu = $('#statu').val();
	if(statu==null || statu == ''){
		delete $list_dataParam['statu'];
	}else{
		$list_dataParam['statu'] = statu;
	}
	
	var type = $('#type').val();
	if(type==null || type == ''){
		delete $list_dataParam['type'];
	}else{
		$list_dataParam['type'] = type;
	}
	
	resetList();
}
/**
 * 清空
 */
function cleanData(){
	delete $list_dataParam['keyWord'];
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
	delete $list_dataParam['statu'];
	$("#statu").val('');
	delete $list_dataParam['type'];
	$("#type").val('');
	MenuManager.menus["effectdate"].resetAll();
	searchData();
}

/**
 * 操作
 * @param data
 */
function operation(data){
	var opras = '';
	//删除/编辑
	//要求：启用的数据，不可以操作删除/编辑；禁用可以操作删除/编辑等操作
	if(data.status.value == 'YES'){//表示启用中
		opras += '<a href="javascript:changeStatus({id:\'' + data.id + '\',status:\'NO\'});">禁用</a>';
	}else if(data.status.value == 'NO'){
		opras += '<a href="javascript:changeStatus({id:\'' + data.id + '\',status:\'YES\'});">启用</a>';
		opras += ' | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
		opras += ' | <a href="javascript:deleteRow({id:\'' + data.id + '\'});">删除</a>';
	}
	return opras;
}

/**
 * 启用/禁用
 * @param data
 * @returns
 */
function changeStatus(data){
	
	var tips = '';
	if(data.status == 'YES'){
		tips = '确定要启用操作吗?';
	}else{
		tips = '确定要禁用操作吗?';
	}
	art.dialog.confirm(tips,function(){
		$.post(base+'/ebsite/gift/changeStatus',{id:data.id,status:data.status},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				if(typeof(afterDeleteRow)=='function'){
					afterDeleteRow();
				}
				refresh();
			}
		},'json');
		return true;
	},function(){
		return true;
	});
}

/**
 * 查看领取记录
 * @param data
 * @returns
 */
function getRecord(data){
	return '<a href="javascript:recordView({id:\'' + data.id + '\'});">查看</a>';
}
/**
 * 领取记录
 * @param data
 * @returns
 */
function recordView(data){
	//开启一个窗口
	art.dialog.open(base+'/ebsite/giftrecord/list?giftId='+data.id,
			{title:'领取记录',
			lock:true,
			width:$list_editWidth||'auto',
			height:$list_editHeight||'auto',
			id:'RECORD-VIEW',
			button:[{name:'关闭'}]}
	);
}