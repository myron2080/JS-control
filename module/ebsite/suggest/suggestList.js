/**
 * 意见反馈
 * @author Cai.xing
 * @since 2012-04-02
 * */
//$list_addUrl = getPath()+"/ebsite/integralInfo/add";//新增url
$list_editUrl = getPath()+"/ebsite/suggest/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebsite/suggest/delete";//删除url
$list_editWidth = "752px";
$list_editHeight = "250px";
$list_dataType = "意见";//数据名称
$list_hr_approve = false;//是审批界面
var true_count=0;
$(document).ready(function(){
	//$("#toolBar").ligerToolBar();
	params ={};
	params.inputTitle = "反馈日期";	
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
		$("#isHandle").val("");
		searchData();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'center', width: 120,render:oprator},
            //{display: '反馈标题', name: 'title', align: 'center', width: 220},
            {display: '联系方式', name: 'member.mobilePhone', align: 'center', width: 105},
            {display: '反馈日期', name: 'createTime', align: 'center', width: 100},
            {display: '反馈类型', name: 'suggestTypeTs', align: 'center', width: 105},
            {display: '是否被处理', name: 'isHandle', align: 'center', width: 120,render:function(data){
            	if(data.isHandle==1+""){return "是";}return "否";
            }
            },
            {display: '反馈会员', name: 'member.nickName', align: 'center', width: 105},
            {display: '反馈内容', name: 'context', align: 'left', width: 320}
        ],
        checkbox:false,
        delayLoad:true,
        url:getPath()+'/ebsite/suggest/listData'
       
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
	var isHandle = $("#isHandle").val();
	if(isHandle !=""){
		$list_dataParam['isHandle'] = isHandle;
	}else{
		delete $list_dataParam['isHandle'];
	}
	resetList();
}

function oprator(data){
	var result = "<a style=\"color:red\" href=\"javascript:deleteRow({id:'"+(data.id)+"'})\">删除</a>";
	if(data.isHandle==(0+"")){
		result+="|<a style=\"color:green\" href=\"javascript:changeDefault('"+(data.id)+"',1)\">标记为已处理</a>";
	}else{
		result+="|<a style=\"color:\"#726A6A\" href=\"javascript:changeDefault('"+(data.id)+"',0)\">标记为未处理</a>";
	}
//	result+=" | <a style=\"color:blue\" href=\"javascript:editRow({id:'"+(data.id)+"'})\">编辑</a>";
	return result;
	
}

//标记为以处理
function changeDefault(id,statu){
	art.dialog.confirm(statu==0?"是否标记为未处理？":"是否标记为已处理？",function(){
		$.post(ctx+"/ebsite/suggest/makerHandle",{id:id,statu:statu},function(data){
    		if(data.STATE=="SUCCESS"){
    			art.dialog.tips(data);
    			resetList();
    			art.dialog.list["appView"].close();
    		}else{
    			art.dialog.tips(data);
    			resetList();
    		}
    	});
	});
}

