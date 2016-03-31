$list_editWidth = "580px";
$list_editHeight = "320px";
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
		});
	$("#toolBar").append(
			 '<input style="float:left;margin-left:5px;" type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="货品标题/关注人" defaultValue="货品标题/关注人" value="货品标题/关注人" id="searchKeyWord" class="input"/>'
	);
	$("#toolBar").append(
			 '<li class="k01" id ="effectTime" name="effectTime" style="width:200px;text-align:left;float:left;margin: 0 0 0 5px;">提醒日期:不限<div class="k01_right"></div></li>'
	);
	

	$("#toolBar").append(
			'<div style="float:left;display:inline;margin-left:10px;">'
	    	+'	<form onsubmit="searchData();return false;">'	
		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;" id="searchBtn"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
		    +'		<li class="graybtn btn" style="margin-right: 5px;"><a href="javascript:onEmpty();">清空</a></li>'
	    	+'	</form>'
	    	+'</div>'
	);
	
	params ={};
	params.inputTitle = "提醒日期";	
	MenuManager.common.create("DateRangeMenu","effectTime",params);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '货品标题', name: 'snappingGoodsItem.title', align: 'center', width: 320},
            {display: '关注人', name: 'member.mobilePhone', align: 'center', width:100},
            {display: '关注日期', name: 'time', align: 'center', width:120},
            {display: '提醒日期', name: 'remindDate', align: 'center', width:170,dateFormat:"yyyy-MM-dd HH:mm",formatters:"date"},
            {display: '提醒状态', name: 'remindStatusName', align: 'center', width:150},
            {display: '提醒', name: 'remindName', align: 'center', width: 150}
        ],
        url:getPath()+'/ebsite/concern/listData'
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
	
	// 提醒时间
	var queryStartDate = "";
	var queryEndDate = "";
	var queryDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
	}
	if(queryStartDate == queryEndDate && queryEndDate != ""){
		$list_dataParam['queryDate'] = queryStartDate;
	}else{
		// 查询开始时间
		if(queryStartDate != ""){
			$list_dataParam['queryStartDate'] = queryStartDate;
		} else {
			delete $list_dataParam['queryStartDate'];
		}
		// 查询结束时间
		if(queryEndDate != ""){
			$list_dataParam['queryEndDate'] = queryEndDate;
		} else {
			delete $list_dataParam['queryEndDate'];
		}
		delete $list_dataParam['queryDate'];
	}	
	resetList();
}

/**
 * 清空
 */
function onEmpty() {
	delete $list_dataParam['searchKeyWord'];
	MenuManager.menus["effectTime"].resetAll();
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
	searchData();
}
