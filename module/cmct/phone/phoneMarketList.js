$list_editUrl = getPath()+"/cmct/phoneMarket/edit";
$list_addUrl = getPath()+"/cmct/phoneMarket/add?marketPersonId="+parent.art.dialog.open.origin.marketPersonId;
$list_deleteUrl = getPath()+"/cmct/phoneMarket/delete";
$list_editWidth = "610px";
$list_editHeight = "400px";
$list_dataType = "营销";
var callModeMap={1:'自定义按键流程',2:'自定义转人工流程',3:'普通流程'};
var statusMap={1:'暂停',2:'启用',3:'执行',YES:'已执行',NO:'未执行'};

$(document).ready(function(){
	params ={};
	params.inputTitle = "日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: 'WorkId', name: 'modeID', align: 'left', width: 200,height:40,render:clickDetail},
		            {display: '名称', name: 'name', align: 'left', width: 100,height:40},
		            {display: '计费号码', name: 'chargeNbr', align: 'left', width: 100,height:40},
//		            {display: '来电显示号码', name: 'displayNbr', align: 'left', width: 100,height:40},
		            {display: '语音名称', name: 'voiceName', align: 'center', width: 150,height:40},
//		            {display: '营销类型', name: '', align: 'left', width: 100,height:40,render:getCallMode},
//		            {display: '转人工时间间隔', name: 'waitTime', align: 'left', width: 100,height:40},
		            /*{display: '转接号码url', name: 'transferUrl', align: 'center', width: 100,height:40},*/
		            {display: '创建日期', name: 'createTime', align: 'center', width: 120,height:40},
		            {display: '执行状态', name: '', align: 'center', width: 100,height:40,render:getExecuteStatus},
		            {display: '状态', name: '', align: 'center', width: 100,height:40,render:getStatus},
		            {display: '操作', name: '', align: 'center', width: 160,render:operateRender}
		        ],
        delayLoad:false,
       // height:"55%",
        parms:{marketPersonId:parent.art.dialog.open.origin.marketPersonId},
        url:getPath()+'/cmct/phoneMarket/listData',
        onAfterShowData:function(gridData){
//	    	$("#main").ligerLayout({after:400});
//			$("#main").height(320);
//			$("div[position='center']").height(360);
        }
    }));
	 
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
	$("#clear").click(function(){
		MenuManager.menus["operatedate"].resetAll();
		$('#status').val('');
		$("#key").val($("#key").attr("dValue"));
	});
	
});

function clickDetail(data){
	return '<a href="javascript:viewDetail({modeID:\''+data.modeID+'\'});">'+data.modeID+'</a>';
}

function viewDetail(data){
	parent.workID=data.modeID;
	parent.document.getElementById("two2").click();
}

function getExecuteStatus(data){
	return statusMap[data.executeStatus];
}

function getStatus(data){
	return statusMap[data.status];
}

function getCallMode(data){
	return callModeMap[data.callMode];
}

function operateRender(data,filterData){
	var str='';
	var status=data.status
	if(status!='3'){
		if(status=='1'){
			str+='<a href="javascript:updateStstus({id:\''+data.id+'\',flag:2});">启动&nbsp;</a>';
		}else{
			if(data.executeStatus && data.executeStatus=='NO'){
				str+='<a href="javascript:updateStstus({id:\''+data.id+'\',flag:2});">重新启动&nbsp;</a>';
			}
			str+='<a href="javascript:updateStstus({id:\''+data.id+'\',flag:1});">暂停&nbsp;</a>';
		}
		str+='<a href="javascript:updateStstus({id:\''+data.id+'\',flag:3});">关闭</a>';
	}
	return str;
}

function updateStstus(data){
	var status="";
	if(data.flag=='1'){
		status="MARKET_STOP";
	}else if(data.flag=='2'){
		status="MARKET_BEGIN";
	}else{
		status="MARKET_CLOSE";
	}
	var updateStstusUrl=getPath()+"/cmct/phoneMarket/updateStauts";
	art.dialog.confirm('确定操作该行数据?',function(){
		$.post(updateStstusUrl,{id:data.id,statusValue:data.flag,status:status},function(res){
			if(res.STATE=='SUCCESS'){
				art.dialog.tips(res.MSG);
				refresh();
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json');
		return true;
	},function(){
		return true;
	});
}

function searchData(){
	
	//录入时间
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["operatedate"]){
		startDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
		endDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(startDate != ""){
		$list_dataParam['startDate'] = startDate;
	} else {
		delete $list_dataParam['startDate'];
	}
	//查询结束时间
	if(endDate != ""){
		$list_dataParam['endDate'] = endDate;
	} else {
		delete $list_dataParam['endDate'];
	}
	
	var key = $('#key').val();
	if(key && ($('#key').attr("dValue") != key)){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
	var status=$('#status').val();
	if(status){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	resetList();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
