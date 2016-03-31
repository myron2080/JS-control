$list_editWidth = ($(window).width()-130);
$list_editHeight = ($(window).height()-130);
var keyVal='客户姓名/持有人/电话';
var status = "EFFECTIVE";
$(document).ready(function(){
	
	$("#key").focus(function(){ 
		if($(this).val()==keyVal){
			$(this).val("");
		}
	}); 
	$("#key").blur(function(){
		if($(this).val()==""){
			$(this).val(keyVal);
		}
	});
	
	//回车操作
	inputEnterSearch("key",searchData);
	
	params ={};
	params.inputTitle = "登记日期";	
	MenuManager.common.create("DateRangeMenu","foundingDate",params);
	
	$(".ds_title li").click(function(){
		$(this).addClass("hover").siblings("li").removeClass("hover");
		status = $(this).attr("key");
		searchData();
	});
	params ={};
	params.inputTitle = "登记日期";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '姓名', name: 'name', align: 'left', width: 150,render:nameRender},
            {display: '购买类型',name:'saleTypeStr',align:'center',width:90},
            {display: '联系电话1',name:'phone',align:'left',width:110},
            {display: '联系电话2',name:'phone2',align:'left',width:110},
            {display: '意向',name:'intentionDesc',align:'center',width:300},
            {display: '跟进条数', name: 'followCount', align: 'center', width: 90},
//            {display: '通话次数', name: 'bunkCount', align: 'center', width: 90,render:callCountRender},
            {display: '登记日期', name: 'createTime', align: 'center', dateFormat:"yyyy-MM-dd HH:mm",formatters:"date",width:160},
            {display: '登记人',name:'user.name',align:'center',width:90,render:userNameRender}
        ],
	    checkbox:false,
	    fixedCellHeight:false,
	    enabledSort:true,
	    parms:{status:status},
	    url:base+"/bageCustomerList/listData",
        onDblClickRow : function (data, rowindex, rowobj) {
    		showManager(data);
        }
    }));
});


function onEmpty(){
	$('#key').val(keyVal);
	$('#saleType').val("");
	$('#customerLevel').val("");
	MenuManager.menus["createTime"].resetAll();
	$('[clear]').val('');
}

function showManager(data){
	art.dialog.open(base +"/bageCustomerList/bageCustomerView?id="+data.id,{
		id : "bageCustomerView",
		title : '查看客户信息',
		background : '#333',
		width : 550,
		height : 600,
		lock : true	
	});	
}

function searchData(){
	var param = {};
	var params = getFilter();
	$('.disk_source_box').find('input,select').each(function(){
	  var v = $(this).val();
	  if(v){
		  if(!($(this).attr('id')=='key' && v==keyVal)){
			  param[$(this).attr('name')] = $(this).val();
		  }
	   }
	});
	param.status = status;
	$list_dataParam=param;	
	jQuery.extend($list_dataParam,params);
	resetList();
}

function getFilter(){
	var params = {};
	var paramsTemp;	
	if(MenuManager.menus["createTime"]){
		paramsTemp = MenuManager.menus["createTime"].getValue();
	}
	jQuery.extend(params,paramsTemp);
	return params;
}



function nameRender(data,filterData){
	if(data.customerLevel == "VIP"){
		return data.name + " <span style='background-color:red;'>&nbsp;VIP&nbsp;</span>";
	}else{
		return data.name;
	}
	
}

function followCountRender(data,filterData){
	return '<a style="color:#ECA613;" href="javascript:followCountList(\''+data.id+'\');">11</a>';
}

function callCountRender(data,filterData){
	return '<a style="color:#ECA613;" href="javascript:callCountList(\''+data.id+'\');">' + data.phoneCount + '</a>';
}

function userNameRender(data,filterData){
	if(data.user != null){
		if(data.user.name == '' || data.user.name == null){
			return data.user.nickName;
		}else{
			return data.user.name;
		}
	}else{
		return "";
	}
}



function followCountList(customerId){
//	var title = "跟进记录";
//	var dlg =art.dialog.open(base +"/bageCustomerList/followCountList?customerId=" + customerId,
//			{
//				id : "followCountList",
//				title : title,
//				background : '#333',
//				width : 650,
//				height : 500,
//				lock : true
//			});		

}


function callCountList(customerId){
	var title = "通话记录";
	var dlg =art.dialog.open(base +"/bageCustomerList/calllHistoryList?customerId=" + customerId,
			{
				id : "calllCountList",
				title : title,
				background : '#333',
				width : 700,
				height : 400,
				lock : true
			});		

}
