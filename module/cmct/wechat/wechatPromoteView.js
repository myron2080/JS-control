$(document).ready(function(){
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	params ={};
	params.width = 260;
	params.inputTitle = "创建日期";
	MenuManager.common.create("DateRangeMenu","createDate",params);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '转发人', name: 'PNAME', align: 'center', width: 100},
            {display: '所属部门', name: 'ONAME', align: 'left', width: 100},
            {display: '阅读量', name: 'READCOUNT', align: 'left', width: 80},
            {display: '注册量', name: 'REGCOUNT', align: 'center', width: 80}
        ],
        delayLoad:true,
//        parms:{parentWechatId:parent.parentWechatId,type:'read'},
        url:getPath()+'/cmct/wechatPromote/listViewData',
        onAfterShowData:function(gridData){
        	getTotalAmount(gridData);
        }
    }));
	
	$(".system_tab li").click(function(){
		delete $list_dataParam['type'];
		$(this).addClass("hover").siblings("li").removeClass("hover");
		var key = $(this).attr("key");
		$list_dataParam['type']=key;
		searchData();
	});
	searchData();
});

function getLongNumber(oldObj,newObj,doc){
	if(newObj){
		$('#longNumber').val(newObj.longNumber);
	}else{
		$('#longNumber').val('');
	}
}


function onEmpty(){
	$('#orgName').val('组织');
	$('#orgId').val('');
	$('#longNumber').val('');
	$("#key").val($("#key").attr("dValue"));
}


$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function searchData(){
	$list_dataParam['type']=$('.hover').attr("key");
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	$list_dataParam['longNumber'] = $('#longNumber').val();
	$list_dataParam['parentWechatId'] = parent.parentWechatId;
	resetList();
}

function getTotalAmount(gridData){
//	if(gridData){
//		var total1=0;
//		var total2=0;
//		for(var i=0;i<gridData.items.length;i++){
//			var amountObj=gridData.items[i];
//			if(null!=amountObj.READCOUNT){
//				total1+=amountObj.READCOUNT;
//			}
//			if(null!=amountObj.REGCOUNT){
//				total2+=amountObj.REGCOUNT;
//			}
//		}
//		$('#readTotal').text(total1);
//		$('#regiTotal').text(total2);
//	}else{
//		$('#readTotal').text(0);
//		$('#regiTotal').text(0);
//	}
	
	$.post(getPath()+'/cmct/wechatPromote/getEachData',{parentWechatId:parent.parentWechatId},function(res){
		$('#readTotal').text(res.READCOUNT);
		$('#regiTotal').text(res.REGISTCOUNT);
	},'json');
}


 
 
 