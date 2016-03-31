$list_editUrl = getPath()+"/ebsite/messageset/edit";// 编辑及查看url
$list_addUrl = getPath()+"/ebsite/messageset/add?isValid=1";// 新增url
$list_deleteUrl = getPath()+"/ebsite/messageset/delete";// 删除url
$list_editWidth = "580px";
$list_editHeight = "240px";
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
		});
	$("#toolBar").append(
			 '<input style="float:left;margin-left:5px;" type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称" defaultValue="名称" value="名称" id="searchKeyWord" class="input"/>'
	);
	
	$("#toolBar").append(
			'<div style="float:left;display:inline;margin-left:10px;">'
	    	+'	<form onsubmit="searchData();return false;">'	
		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;" id="searchBtn"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
		    +'      <c:if test="${add eq \'Y\'}"><li class="orangebtn btn"><a href="javascript:void(0)"><span onclick="addRow();" id="toAddBtn"><img src='+getPath()+'/default/style/images/common/common_plus.png />新增</a></li></c:if>'
		    +'		<li class="graybtn btn" style="margin-right: 5px;"><a href="javascript:onEmpty();">清空</a></li>'
	    	+'	</form>'
	    	+'</div>'
	);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 320,render : operateRender},
            {display: '名称', name: 'name', align: 'center', width:100},
            {display: '编码', name: 'number', align: 'center', width:120},
            {display: '创建人', name: 'creator.name', align: 'center', width:170},
            {display: '创建日期', name: 'createTime', align: 'center', width:150},
            {display: '备注', name: 'description', align: 'center', width: 150}
        ],
        url:getPath()+'/ebsite/messageset/listData'
    }));
	
	/**
	 * 回车查询
	 */
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

/**
 * 查询
 */
function searchData(){
	//
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}	
	resetList();
}

/**
 * 清空
 */
function onEmpty() {
	delete $list_dataParam['searchKeyWord'];
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
}

/**
 * 操作
 */
function operateRender(data) {
	var str = "";
	if (data.isStartUse == 1) {
		str+= '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
	} else if (data.isStartUse == 0) {
		str+= '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a>';
	} else {
		// 不显示操作
		var obj = {
			fileName : 'messagesetList.js',
			lineNumber : '61',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
	if(edit == "Y"){
		str+= '| <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	}
	return str;
}

/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/ebsite/messageset/onOff', {
				id : data.id,
				isStartUse : 1
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
			$.post(getPath() + '/ebsite/messageset/onOff', {
				id : data.id,
				isStartUse : 0
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
			fileName : 'messagesetList.js',
			lineNumber : '79',
			msg : '程序开发参数传入异常'
		};
		sysout(obj);
	}
}