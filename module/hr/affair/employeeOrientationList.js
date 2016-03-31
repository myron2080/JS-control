/**
 * 员工入职
 * @author Cai.xing
 * @since 2012-04-02
 * */
$list_addUrl =  getPath()+"/hr/employeeOrientation/add";//add
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
            {display: '单据编号', name: 'billNumber', align: 'left', width: 120},
            {display: '单据状态', name: 'billStatuName', align: 'center', width: 80},
            {display: '员工编码', name: 'number', align: 'left', width: 100},
            {display: '员工姓名', name: 'name', align: 'left', width: 120},
            {display: '部门', name: 'mainPositionOrg.name', align: 'left', width: 120},
            {display: '职位', name: 'mainPosition.name', align: 'center', width: 120},
            {display: '职级', name: 'mainJobLevel.name', align: 'center', width: 120},
            {display: '申请入职日期', name: 'innerDate', align: 'center', width: 120},
            {display: '试用期(月)', name: 'probationPeriod', align: 'center', width: 80},
            {display: '创建日期', name: 'createTime', align: 'center', width: 100},
            {display: '推荐人', name: 'referrer.name', align: 'center', width: 60} 
        ],
        checkbox:true,
        delayLoad:true,
        url:getPath()+'/hr/employeeOrientation/listData'
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
	if($("#orgId").val()!="所属组织"){
		$list_dataParam["orgId"] =  $("#orgId").val();
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
function batchApp(){
	
	var array = $list_dataGrid.getCheckedRows () ;
	 var housePowers =[];
	 for (var i = 0; i < array.length; i++)
	    {
		 	if(array[i].billStatu=="SUBMIT" ){
		 		var newRow={};
			 	newRow.id = array[i].id;
		    	housePowers.push(newRow);
		 	}
	    }
	 if(housePowers.length==0){
		 art.dialog.tips("请选择审批中的单据进行操作！");
		 return;
	 }
	art.dialog.confirm("你选择了"+housePowers.length+"个可审批的单据,是否全部通过审批？",function(){
		var a=1;
		$("#approveBtn").unbind().removeAttr("onclick");
		$(array).each(function(){
			if(this.billStatu=="SUBMIT" ){
			var billId = this.id;
			$.post(ctx+"/hr/employeeOrientation/approvalBill",{billId:billId},function(data){
				     a++;
					if(data.STATE=="SUCCESS"){
						true_count+=1;
						if(true_count==array.length ){
							true_count=0;
							art.dialog.tips(data.MSG,null,"succeed");
			    			resetList();
						}
		    		}else{
		    			art.dialog.tips(data.MSG);
		    			resetList();
		    		}
				
	    	});
			 if(a>=array.length){
				$("#approveBtn").unbind().bind("click",function(){
					batchApp()
				});
			 }
			}
		});
		
	});
	
}
function cleanData(){
	$("#orgId").val("");
	$("#orgName").val("所属组织");
//	$("#billSta").val("");
	MenuManager.menus["createTime"].resetAll();
}

function changeStatu(id,billStatu,opName){
	art.dialog.confirm("是否"+opName+"此单据？",function(){
		$.post(ctx+"/hr/employeeOrientation/changeStatu",{billId:id,billStatu:billStatu},function(data){
    		if(data.STATE=="SUCCESS"){
    			art.dialog.tips(data.MSG);
    			resetList();
    			art.dialog.list["appView"].close();
    		}else{
    			art.dialog.tips(data.MSG);
    			resetList();
    		}
    	});
	});
}
function approval(id){
	art.dialog.confirm("是否通过审批？",function(){
		$.post(ctx+"/hr/employeeOrientation/approvalBill",{billId:id},function(data){
    		if(data.STATE=="SUCCESS"){
    			art.dialog.tips(data.MSG);
    			resetList();
    			art.dialog.list["appView"].close();
    		}else{
    			art.dialog.tips(data.MSG);
    			resetList();
    		}
    	});
	});
}