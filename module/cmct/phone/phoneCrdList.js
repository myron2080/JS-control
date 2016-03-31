$list_addUrl = "";//查看url
$list_editWidth = 450;
$list_editHeight = 140;

$list_dataType = "录音记录";//数据名称
 
$(document).ready(function(){
	 
	params ={};
	params.inputTitle = "录音时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	//默认值，当月
	MenuManager.menus["effectdate"].setValue(startDay,endDay);
	MenuManager.menus["effectdate"].confirm();
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '计费号码', name: 'costNumber', align: 'left', width: 100,render:renderCostNumber},
            {display: '主叫号码', name: 'callerNumber', align: 'left', width: 120},
            {display: '被叫号码', name: 'calleeNumber', align: 'left', width: 100},
            {display: '录音时间', name: 'callRdDate', align: 'left', width: 140},
          //  {display: '录音时长', name: '', align: 'left', width: 80,render:getCallDuration},
            {display: '状态', name: '', align: 'center', width: 120,render:getStatus},
            {display: '录音地址', name: 'callRdUrl', align: 'center', width: 200},
            {display: '操作', name: '', align: 'center', width: 80,render:downCall}
           
        ],
        url:getPath()+'/cmct/phoneCrd/listData',
        delayLoad:true,
        usePager:true,
        checkbox:true,
        enabledSort:false        
    }));
	
	bindEvent(); 
	searchData();
});

function getCallDuration(data){
	if(data.callDuration){
		return data.callDuration+"秒";
	}
}

function renderCostNumber(data){
	if(!data.costNumber){
		return data.callerNumber;
	}
	return data.costNumber;
} 

function downCall(rowData){
	var str="";
	if(rowData.downStatus=='NO'){
		str = '<a href="javascript:turnSave({id:\''+rowData.id+'\'});">转存</a>';
	}
	if(rowData.callRdUrl){
		//api http://www.phon.ucl.ac.uk/home/mark/audio/play9.htm 参考
		var index=rowData.sessionId;
		var callRdUrl=rowData.callRdUrl;
		var fname=getPath()+callRdUrl;
		str +='<a id='+index+"_play"+' href="javascript:doPlay(\''+fname+'\',\''+index+'\');">播放</a>'
		str +='<a id='+index+"_stop"+' style="display: none" href="javascript:doStop(\''+index+'\');">停止</a>'
	}	
	return str;
}

function jplayVoice(name,index){
	var openUrl = name;
	var newWindow = window.open(openUrl,'_blank','toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no,status=no');
	newWindow.moveTo(350,180);
	newWindow.resizeTo(650,250);
	newWindow.focus();
}

/*function jplayVoice(fname,index){
		$("#jquery_jplayer").jPlayer({ready: function (event) {
			$(this).jPlayer("setMedia", {
	        wav:fname
	    });
		},
		swfPath: getPath()+"/default/js/control/flv/Jplayer.swf",
		supplied: "wav",
	 }).jPlayer("play",5);
}*/


function turnSave(data){
	var dateArr=formate_yyyyMMdd(new Date()).split("-");
	$.post(getPath()+'/cmct/phoneCrd/turnSave',{id:data.id,year:dateArr[0],month:dateArr[1]},function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json')
}

/**
 * 批量转存
 */
function batchSave(){
	
	if(Loading.isExistLoad()){
		Loading.close();//关闭加载
	}
	
	var recordes = $list_dataGrid.getSelectedRows();	
	var recordesIds = "";
	for(var i in recordes){
		if(recordes[i].downStatus=='NO'){
			if(!recordesIds){
				recordesIds = recordes[i].id;
			}else{
				recordesIds += ","+ recordes[i].id;
			}
		}
	}
	if(!recordesIds){
		art.dialog.tips("未勾选或未查找到满足条件的数据！！",2);
		return ;
	}
	var dateArr=formate_yyyyMMdd(new Date()).split("-");
	  art.dialog.confirm("转存需要一段时间,确定批量转存吗?",function(){
		  Loading.init(null,'正在转存,亲稍等......');
			$.post(getPath()+'/cmct/phoneCrd/batchTurnSave',{ids:recordesIds,year:dateArr[0],month:dateArr[1]},function(data){
				Loading.close();
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
				}else{
					art.dialog.alert(data.MSG);
				}	
			},'json');
		});
}


function getStatus(data){
	if(data.downStatus=='NO'){
		return　"未下载";
	}
	return "已下载";
}

function bindEvent(){
	
 
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	
	$('#batchSave').click(function(){
		batchSave();
	});
	
	//清空
	$("#resetBtn").click(function(){
		MenuManager.menus["effectdate"].resetAll();
		$("#searchStr").val($("#searchStr").attr("defaultValue"));
	});
	
	eventFun($("#searchStr"));
	
	inputEnterSearch('searchStr',searchData);
}

function renderCostTime(data){
	var costTime = data.costTime ;
	var rtnVal = '' ;
	if(costTime == 0){
		
	}else if(costTime < 60 ){
		rtnVal = costTime + "秒" ;
	}else if(costTime >= 60 && costTime < 60*60){
		rtnVal = Math.floor(costTime/60) + "分" + costTime%60 + "秒";
	}else if(costTime >= 60*60 && costTime < 24*60*60){
		var h = Math.floor(costTime/(60*60)) ;
		var m = Math.floor((costTime - h*(60*60))/60);
		var s = (costTime - h*(60*60))%60;
		rtnVal = h+"小时"+m+ "分"+ s + "秒";
	}
	return rtnVal ;
}



  
function searchData(){
	
	var searchStr = $('#searchStr').val();
	if(searchStr && $("#searchStr").attr("defaultValue") != searchStr){
		$list_dataParam['searchStr'] = searchStr;
	}else{
		delete $list_dataParam['searchStr'];
	}
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	var tempStart="";
	var tempEnd="";
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
		tempStart=queryStartDate.substring(5,7);
		
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
		tempEnd=queryEndDate.substring(5,7);
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	if(tempStart!=tempEnd){
		art.dialog.tips('不能跨月查询....');
		return false;
	}
	resetList();
}