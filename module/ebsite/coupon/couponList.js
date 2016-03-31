/**
 * 优惠券
 * @author Cai.xing
 * @since 2012-04-02
 * */
$list_addUrl = getPath()+"/ebsite/coupon/add";//新增url
$list_editUrl = getPath()+"/ebsite/coupon/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebsite/coupon/delete";//删除url
$list_editWidth = "682px";
$list_editHeight = "280px";
$list_dataType = "优惠券";//数据名称
$list_hr_approve = false;//是审批界面
var true_count=0;
$(document).ready(function(){
	//$("#toolBar").ligerToolBar();
	params ={};
	params.inputTitle = "使用结束日期";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
	//$("#main").ligerLayout({});
	//新增按钮
	$("#toAddBtn").bind("click",function(){
		addRow();
	});
	//清空按钮
	$("#resetBtn").bind("click",function(){
		MenuManager.common.resetAll();
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#sourceEnum").val('');
		searchData();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'center', width: 80,render:oprator},
            {display: '券名称', name: 'name', align: 'left', width: 300},
            {display: '使用起始日期', name: 'beginTime', align: 'center', width: 85},
            {display: '使用结束日期', name: 'endTime', align: 'left', width: 100},
            {display: '状态', name: 'couponStatusTs', align: 'center', width: 120},
            {display: '券金额', name: 'couponAmount', align: 'center', width: 120},
            {display: '最低消费金额', name: 'lowPrice', align: 'center', width: 120},
            {display: '归属人电话', name: 'member.mobilePhone', align: 'center', width: 120},
            {display: '券类型', name: 'couponTypesTs', align: 'center', width: 120},
            {display: '券来源', name: 'sourceEnum.name', align: 'center', width: 100},
            {display: '所属类目', name: 'goodsCategory.name', align: 'center', width: 120},
            {display: '所属商品', name: 'goods.name', align: 'center', width: 120}
        ],
        checkbox:false,
        delayLoad:true,
        url:getPath()+'/ebsite/coupon/listData'
       
    }));
	$("#revokeBtn").bind("click",function(){
		uodateBillStatu("REVOKE");
	});
	$("#rejectBtn").bind("click",function(){
		uodateBillStatu("REJECT");
	});
	
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
	
	//指派礼包
	$('#addGift').click(function(){
		addGift();
	});
	
});

function searchData(){
	if(MenuManager.menus["effectdate"]!=null){
		$list_dataParam["beginDate"] =  MenuManager.menus["effectdate"].getValue().timeStartValue;
		$list_dataParam["endDate"] =  MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	//alert(MenuManager.menus["effectdate"].getValue().timeStartValue+":"+MenuManager.menus["effectdate"].getValue().timeEndValue);
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
	
	var sourceEnum = $('#sourceEnum').val();
	if(sourceEnum==null || sourceEnum == ''){
		delete $list_dataParam['source'];
	}else{
		$list_dataParam['source'] = sourceEnum;
	}
	
	resetList();
}

function oprator(data){
	if (hybj_permission== 'Y') {
		var html = "<a style=\"color:red\" href=\"javascript:deleteRow({id:'"+(data.id)+"'})\">删除</a>";
		    html+= " | <a style=\"color:green\" href=\"javascript:editRow({id:'"+(data.id)+"'})\">编辑</a>";
		    html+= ' | <a href="javascript:addGift({id:\'' + data.id + '\'});">添加礼包</a>';
		return html;
	}
}

/**
 * 添加礼包功能
 */
function addGift(){
	var flag = false;
	var dlg = art.dialog.open(base+'/ebsite/coupon/addGift',
			{title:'指派礼包',
			 lock:true,
			 width:'500px',
			 height:'200px',
			 id:"ADDGIFT-EDIT",
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

