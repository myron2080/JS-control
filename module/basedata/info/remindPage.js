$list_deleteUrl = getPath()+"/basedata/info/deleteRemind";//删除url
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'number', align: 'center', width: 50,render:delRow},
            {display: '状态', name: 'effectiveDate', align: 'center', width: 60,render:isReadRender},
            {display: '提醒时间', name: 'time', align: 'center', width: 120,dateFormat:"yyyy-MM-dd HH:mm",formatters:"date"},
            {display: '提醒人', name: 'personIds', align: 'left', width: 100},
            {display: '提醒标题', name: 'title', align: 'left', width: 90},
            {display: '提醒内容', name: 'content', align: 'left', width: 120},
            {display: '提醒方式', name: 'description', align: 'left', width: 90,render:remindType}
        ],
        height:'95%',
        fixedCellHeight:false,
        url:getPath()+'/basedata/info/remindData',
        delayLoad:true
    }));
//	resetList();
	
	
	init();
	var height = $(window).height();
	var width = $(window).width();
	width = width - $('.navbar').width();
	$("#rightarea").css("height",height);
	$("#main").ligerLayout({leftWidth:112,allowLeftCollapse:true,allowLeftResize:true});
	$("#process_main").height($("#main").height()-20); 
	//定向指定页面
	$("#menu").find("li:first-child").click();
	
	
});

function remindType(data){
	var remindType = "";
	if(data.system=="1"){
		remindType+="系统";
	}
	if(data.sms=="1"){
		if(remindType==""){
			remindType+="短信";
		}else{
			remindType+="+短信";
		}
	}
	if(data.weixin=="1"){
		if(remindType==""){
			remindType+="微信";
		}else{
			remindType+="+微信";
		}
	}
	return remindType;  
}

function delRow(data){
	return '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';  
}

function isReadRender(data){
	if(data.isRead=='1'){
		return "已提醒";
	}else{
		return "未提醒";
	}
}

function init(){
	 var count = 0;
	 $("#menu").find("li").bind("click",function(){
	 	 $("#menu li").each(function(){
			$(this).attr("class","");
		});
		$(this).attr("class","hover");
	 	  
	 	  var type = $(this).attr("id");
	 	  $("#type").val($(this).attr("id"));
	 	  if(type=='check'){
	 		  resetList();
	 		  $("#homeIframe").hide();
	 		  $("#tableContainer").show();
	 	  }else{
	 		 $("#homeIframe").show();
	 		  $("#tableContainer").hide();
	 	  }
	 });
	
}