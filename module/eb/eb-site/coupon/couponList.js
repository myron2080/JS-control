/**
 * 优惠券
 * @author Cai.xing
 * @since 2012-04-02
 * */
$list_addUrl = getPath()+"/hr/employeeOrientation/add";//新增url
$list_editUrl = getPath()+"/hr/employeeOrientation/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/hr/employeeOrientation/delete";//删除url
$list_editWidth = "952px";
$list_editHeight = ($(window).height()-150)+"px";
$list_dataType = "员工入职";//数据名称
$list_hr_approve = true;//是审批界面
var true_count=0;
$(document).ready(function(){
	//$("#main").ligerLayout({});
	$("#toAddBtn").bind("click",function(){
		addRow();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'option', align: 'center', width: 80},
            {display: '券名称', name: 'billNumber', align: 'left', width: 220},
            {display: '使用起始日期', name: 'billStatuName', align: 'center', width: 80},
            {display: '使用结束日期', name: 'number', align: 'left', width: 100},
            {display: '状态', name: 'name', align: 'left', width: 120},
            {display: '券金额', name: 'mainPositionOrg.name', align: 'left', width: 120},
            {display: '归属人', name: 'mainPosition.name', align: 'center', width: 120},
            {display: '券类型', name: 'mainJobLevel.name', align: 'center', width: 120},
            {display: '所属类目', name: 'innerDate', align: 'center', width: 120},
            {display: '所属商品', name: 'probationPeriod', align: 'center', width: 80}
        ],
        checkbox:true,
        delayLoad:true,
        url:getPath()+'/ebsite/cuppon/listData'
    }));
	params ={};
	params.inputTitle = "范围";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
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

function uodateBillStatu(ststu){
	 var selectRows = $list_dataGrid.getSelectedRows();
	 var housePowers =[];
	 if(selectRows==null || selectRows.length==0){
			art.dialog.tips("请至少选择一个进行操作！");
			return false;
		}
	 for (var i = 0; i < selectRows.length; i++)
	    {
		 	if(selectRows[i].billStatu=="SUBMIT" ){
		 		var newRow={};
			 	newRow.id = selectRows[i].id;
			 	newRow.billStatu =ststu;
		    	housePowers.push(newRow);
		 	}
	    }
	 if(housePowers.length==0){
		 art.dialog.tips("没有需要做此操作的单据！");
		 return;
	 }
	 	var hpStr  =JSON.stringify(housePowers);
		$.post(getPath()+"/hr/employeeOrientation/updateStatu",{hpStr:hpStr},function(data){
			if(data.STATE=="SUCCESS"){
 			art.dialog.tips(data.MSG);
 			resetList();
 		}else{
 			art.dialog.tips(data.MSG);
 			resetList();
 		}
		},"json");
}
function searchData(){
//	$list_dataParam["billSta"] =  $("#billSta").val();
	$list_dataParam["billSta"] =  $("#tab li[class='hover']").attr("key");
	//日期范围类型
	var dateType = $('#dateType').val();
	$list_dataParam['dateType'] = dateType;
	if(MenuManager.menus["createTime"]!=null){
		$list_dataParam["beginDate"] =  MenuManager.menus["createTime"].getValue().timeStartValue;
		$list_dataParam["endDate"] =  MenuManager.menus["createTime"].getValue().timeEndValue;
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
	$list_dataParam['longNumber'] = longNumber;
	resetList();
}
