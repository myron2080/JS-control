/**
 * 积分列表
 * @author Cai.xing
 * @since 2012-04-02
 * */
//$list_addUrl = getPath()+"/ebsite/integralInfo/add";//新增url
$list_editUrl = getPath()+"/ebsite/integralInfo/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebsite/integralInfo/delete";//删除url
$list_editWidth = "552px";
$list_editHeight = "150px";
$list_dataType = "积分";//数据名称
$list_hr_approve = false;//是审批界面
var true_count=0;
$(document).ready(function(){
	//$("#toolBar").ligerToolBar();
	params ={};
	params.inputTitle = "使用期限";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
	//$("#main").ligerLayout({});
	//新增按钮
	$("#toAddBtn").bind("click",function(){
		addRow();
	});
	//清空按钮
	$("#resetBtn").bind("click",function(){
		MenuManager.common.resetAll();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'center', width: 80,render:oprator},
            {display: '积分来源/用途', name: 'integralOriginTs', align: 'center', width: 220},
            {display: '所属人', name: 'member.name', align: 'center', width: 105},
            {display: '积分变化', name: 'change', align: 'center', width: 100},
            {display: '积分变化日期', name: 'changeTime', align: 'center', width: 120},
            {display: '积分备注', name: 'remark', align: 'center', width: 320}
        ],
        checkbox:false,
        delayLoad:true,
        url:getPath()+'/ebsite/integralInfo/listData'
       
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
});

function searchData(){
//	$list_dataParam["billSta"] =  $("#billSta").val();
	$list_dataParam["billSta"] =  $("#tab li[class='hover']").attr("key");
	if(MenuManager.menus["effectdate"]!=null){
		$list_dataParam["beginDate"] =  MenuManager.menus["effectdate"].getValue().timeStartValue;
		$list_dataParam["endDate"] =  MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	resetList();
}

function oprator(data){
	console.info(data);
	return "<a style=\"color:red\" href=\"javascript:deleteRow({id:'"+(data.id)+"'})\">删除</a>";
}

