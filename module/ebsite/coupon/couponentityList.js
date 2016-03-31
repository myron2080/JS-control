/**
 * 优惠券
 * @author Cai.xing
 * @since 2012-04-02
 * */
$list_addUrl = getPath()+"/ebsite/couponentity/add";//新增url
$list_editUrl = getPath()+"/ebsite/couponentity/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebsite/couponentity/delete";//删除url
$list_editWidth = "682px";
$list_editHeight = "250px";
$list_dataType = "优惠券";//数据名称
$list_hr_approve = false;//是审批界面
var true_count=0;
$(document).ready(function(){
	params ={};
	params.inputTitle = "使用期限";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
	//新增按钮
	$("#toAddBtn").bind("click",function(){
		addRow();
	});
	//清空按钮
	$("#resetBtn").bind("click",function(){
		MenuManager.common.resetAll();
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'center', width: 130,render:oprator},
            {display: '券名称', name: 'name', align: 'left', width: 300},
            {display: '使用起始日期', name: 'beginTime', align: 'center', width: 85},
            {display: '使用结束日期', name: 'endTime', align: 'left', width: 100},
            {display: '券金额', name: 'couponAmount', align: 'center', width: 120},
            {display: '最低消费金额', name: 'lowPrice', align: 'center', width: 120},
            {display: '券类型', name: 'couponType', align: 'center', width: 120},
            {display: '所属类目', name: 'goodsCategory.name', align: 'center', width: 120},
            {display: '所属商品', name: 'goods.name', align: 'center', width: 120},
            {display: '创建时间', name: 'createDate', align: 'center', width: 120},
            {display: '创建人', name: 'creator.name', align: 'center', width: 120},
            {display: '最后更新时间', name: 'updateDate', align: 'center', width: 120},
            {display: '最后更新人', name: 'updator.name', align: 'center', width: 120}
        ],
        url:getPath()+'/ebsite/couponentity/listData'
    }));
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	
	$('#tab li').bind('click',function(){
		$(this).addClass("hover").siblings().removeClass("hover");
		searchData();
	});
	searchData();
});

function searchData(){
	if(MenuManager.menus["effectdate"]!=null){
		$list_dataParam["beginDate"] =  MenuManager.menus["effectdate"].getValue().timeStartValue;
		$list_dataParam["endDate"] =  MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
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

function onOff( dataId ,enable){
	art.dialog.confirm('确定该操作吗?', function() {
		$.post(getPath() + '/ebsite/couponentity/onOff', {
			id : dataId,
			isEnable : enable
		}, function(res) {
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				searchData();
			}
		}, 'json');
		return true;
	}, function() {
		return true;
	});
}

function oprator(data){
//	if (hybj_permission== 'Y') {
		var html = "<a style=\"color:red\" href=\"javascript:deleteRow({id:'"+(data.id)+"'})\">删除</a>" ;
		    html+= "|<a style=\"color:blur\" href=\"javascript:editRow({id:'"+(data.id)+"'})\">编辑</a>" ;
		    if(data.isEnable == 1){
		    	 html+= "|<a style=\"color:green\" href=\"javascript:onOff('"+(data.id)+"',0)\">禁用</a>" ;
		    }else if (data.isEnable == 0) {
		    	 html+= "|<a style=\"color:green\" href=\"javascript:onOff('"+(data.id)+"',1)\">启用</a>" ;
		    }
		return html;
//	}
}



