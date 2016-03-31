/**
 * 推荐人列表
 * lttboy
 */
$list_dataType = "推荐人列表";//数据名称
$tree_container = "leftTree";										//指定树的class名
$tree_async_url = getPath()+"/ebsite/recommend/simpleTreeData"; //设置取树的数据的地址
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val().trim();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	//加载树
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '地址', name: 'address', align: 'center', width: 180},
            {display: '合伙人名称', name: 'partnerName', align: 'center', width: 120},
            {display: '合伙人电话', name: 'partnerPhone', align: 'center', width: 120},
            {display: '今天推荐量', name: 'todayRecommendCount', align: 'center', width: 120},
            {display: '累计推荐量', name: 'totalRecommendCount', align: 'center', width: 120},
            {display: '有效推荐量', name: 'effectiveRecommendCount', align: 'center', width: 120},
            {display: '有效订单量', name: 'effectiveOrderCount', align: 'center', width: 120}
//            {display: '推荐查看', name: '', align: 'center', width: 120,render:function(){return '点击查看';}}
        ],
        delayLoad:true,
        url:getPath()+'/ebsite/recommend/listData'
    }));
	//添加按照推荐注册时间过滤
	var params ={};
	params.width = 310;
	params.inputTitle = "推荐时间";	
	params.dateFmt = 'yyyy/MM/dd HH:mm:ss';
	params.fmtEndDate = true;
	MenuManager.common.create("DateRangeMenu","recommendDate",params);
	//初始化时间
	var curentDate=new Date();
	MenuManager.menus["recommendDate"].setValue(curentDate.toLocaleDateString()+" 00:00:00",curentDate.toLocaleDateString()+" 23:59:59");
	MenuManager.menus["recommendDate"].confirm();
	//导出按钮
	$("#exportBtn").bind("click",function(){
		exportRecommend();
	});
	// 回车事件
	$('#searchKeyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
});
function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
/**
 * 查询
 */
function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		$list_dataParam['longNumber'] = selectNodes[0].longNumber;
	}else{
		delete $list_dataParam['longNumber'];
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
	//累计推荐最低值
	var totalMin = $('#totalMin').val();
	//累计推荐最高值
	var totalMax = $('#totalMax').val();
	if (totalMin) {
		$list_dataParam['totalMin'] = totalMin;
	} else {
		delete $list_dataParam['totalMin'];
	}
	if (totalMax) {
		$list_dataParam['totalMax'] = totalMax;
	} else {
		delete $list_dataParam['totalMax'];
	}
	//推荐时间
	var recommendDate_begin = "";
	var recommendDate_end = "";
	if(MenuManager.menus["recommendDate"]){
		recommendDate_begin = MenuManager.menus["recommendDate"].getValue().timeStartValue;
		recommendDate_end = MenuManager.menus["recommendDate"].getValue().timeEndValue;
	}
	if(recommendDate_begin != ""){
		$list_dataParam['recommendDate_begin'] = recommendDate_begin;
	} else {
		delete $list_dataParam['recommendDate_begin'];
	}
	if(recommendDate_end != ""){
		$list_dataParam['recommendDate_end'] = recommendDate_end;
	} else {
		delete $list_dataParam['recommendDate_end'];
	}
	resetList();
}
/**
 * 清空
 */
function cleanData(){
	delete $list_dataParam['keyWord'];
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
	delete $list_dataParam['totalMin'];
	$('#totalMin').val('');
	delete $list_dataParam['totalMax'];
	$('#totalMax').val('');
	MenuManager.menus["recommendDate"].resetAll();
	searchData();
}
/**
 * 输入整数
 * @param obj
 */
function replaceNum(obj){
	if( ! (/^\d+(\.\d+)?$/.test($(obj).val())) ){
		$(obj).val('')
	}
}

/**
 * 导出Excel
 */ 
function exportRecommend(){
	var params=urlEncode($list_dataParam);
	console.info(params);
	var url = getPath()+"/ebsite/recommend/exportRecommend?l=1"+params;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}
/**
 * 
 * @param param	将要转为URL参数字符串的对象
 * @param key	参数字符串的前缀
 * @param encode	是否进行URL编码,默认为true
 * @returns {String}
 */
function urlEncode(param, key, encode) {
	if (param == null)
		return '';
	var paramStr = '';
	var t = typeof (param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&'
				+ key
				+ '='
				+ ((encode == null || encode) ? encodeURIComponent(param): param);
	} else {
		for ( var i in param) {
			var k = key == null ? i : key
					+ (param instanceof Array ? '[' + i + ']' : '.' + i);
			paramStr += urlEncode(param[i], k, encode);
		}
	}
	return paramStr;
}
