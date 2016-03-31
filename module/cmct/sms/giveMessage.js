$(document).ready(function(){
	$("div[class=system_tab_title] li").click(
			function() {
				$(this).addClass("hover").siblings("li").removeClass("hover");
				var id=$(this).attr("id");
				if(id == 'two1'){
					$("#giveLi").hide();
                    $("#dataType").val("get");
                    searchData();
				}else{
					   $("#giveLi").show();
					   $("#dataType").val("give");
					   searchData();
				}
	});
	params ={};
	params.inputTitle = "赠送日期";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	

	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	eventFun($("#searchKeyWord"));
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	        columns: [ 
	            {display: '接收人', name: 'geter.name', align: 'left', width: 80},
	            {display: '赠送日期', name: 'giveDate', align: 'left', width: 120},
	            {display: '赠送条数', name: 'giveNum', align: 'left', width: 80},
	            {display: '赠送人', name: 'giver.name', align: 'left', width: 100},
	            {display: '备注', name: 'remark', align: 'left', width: 220}
	        ],
	        height:335,
	        parms:{dataType:$("#dataType").val(),personId:$("#personId").val()},
	        url:getPath()+'/cmct/messageGive/listData'
  })); 
});

/**
 * 短信赠送
 */
function btnClick(){
	var flag=$("#judgeFlag").val();
	   if(flag == 'yes'){
		   var dlg = art.dialog.open(base+"/cmct/messageGive/add",{
				id : 'add',
				title:"短信赠送",
				width : 500,
				height : 160,
				lock:true,
				ok: function () {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd();
					}
					return false;
				},
				cancelVal: '关闭',
			    cancel: true,
			    close:function(){	
			    	searchData();
			    }
			});
	   }else{
		   art.dialog.tips("您须开通短信余额控制!",2);
	   }
}

function searchData(){
	
	$list_dataParam['dataType'] = $("#dataType").val();
	$list_dataParam['personId'] = $("#personId").val();
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
	}else{
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
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
		$list_dataParam['key'] = "%"+kw+"%";
	}
	
	resetList();
}

