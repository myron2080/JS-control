/**
 * 收货地址
 * @author Cai.xing
 * @since 2012-04-02
 * */
//$list_addUrl = getPath()+"/ebsite/receiptAddress/add";//新增url
$list_editUrl = getPath()+"/ebsite/receiptAddress/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/ebsite/receiptAddress/delete";//删除url
$list_editWidth = "652px";
$list_editHeight = "150px";
$list_dataType = "收货地址";//数据名称
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
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		searchData();
	});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'left', width: 180,render:oprator},
            {display: '创建人',name: '', align: 'center', width: 180,render:createName},
            {display: '创建人手机号', name: 'member.mobilePhone', align: 'center', width: 100},
            {display: '收货人', name: 'receiptPersonName', align: 'center', width: 100},
            {display: '收货人电话', name: 'contactPhone', align: 'center', width: 85},
            {display: '创建日期', name: 'createTime', align: 'center', width: 120},
            {display: '是否默认地址', name: 'isDefaultAddress', align: 'center', width: 120,render:function(data){
            	if(data.isDefaultAddress==1+""){return "是";}return "否";
            }
            },
            {display: '所属地区', name: 'address', align: 'center', width: 150},
            {display: '详细地址', name: 'addressInfo', align: 'center', width: 260}
        ],
        checkbox:false,
        delayLoad:true,
        url:getPath()+'/ebsite/receiptAddress/listData'
       
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

function oprator(data){
	var result ="";
	if (shdzsc_permission == 'Y') {
		result+="<a style=\"color:red\" href=\"javascript:deleteRow({id:'"+(data.id)+"'})\">删除 </a>"
	}
	if(data.member!=null){
		if (szmrz_permission!='undefined' && szmrz_permission == 'Y') {
			result+="| <a style=\"color:green\" href=\"javascript:changeDefault('"+(data.id)+"','"+data.member.id+"')\">设置默认地址</a>";
		}
	}
	if (shdzbj_permission == 'Y') {
		result+=" | <a style=\"color:blue\" href=\"javascript:editRow({id:'"+(data.id)+"'})\">编辑</a>";
	}
	return result;
}

function createName(data){
	var result = "";
	if(data.member==null){
		return "";
	}
	if(data.nickName == ""){
		result = data.userName;
	}else{
		result = data.nickName;
	}
	return result;
}
//设置默认地址
function changeDefault(id,mId){
	art.dialog.confirm("是否确认设置？",function(){
		$.post(ctx+"/ebsite/receiptAddress/changeDefault",{id:id,mId:mId},function(data){
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
