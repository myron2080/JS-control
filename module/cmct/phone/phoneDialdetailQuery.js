$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '电话号码', name: 'infoNumber', align: 'left', width: 100,render:renderInfoNumber},
            {display: '通话类型', name: 'busType', align: 'left', width: 160,render:renderBusType},
            {display: '通话时长', name: 'callDuration', align: 'left', width: 80,render:renderCostTime},
            {display: '费率', name: 'rate', align: 'left', width: 80,render:checkRate},
            {display: '话费', name: 'callCost', align: 'left', width: 80,render:checkCallCost}
        ],
        width:"98%",
        height:"98%",
        url:getPath()+'/cmct/phoneDialDetail/queryDtail',
        delayLoad:true,
        usePager:true,
        enabledSort:false
    }));
	bindEvent();
	searchData();

});
function renderInfoNumber(data){
	var infoNumber = $("#keyConditions").val();
	if(infoNumber == "隐藏呼出"){
		return "隐藏号码" ;
	}
	return data.infoNumber ;
}

function renderBusType(data){
	if(data.busType=='101'){
		return '点击拨号';
	}
	return data.busType;
}

function checkRate(data){
	if(data.rate==null||data.rate==''){
		return "0";
	}
	return data.rate;
}
function renderCostTime(data){
	var costTime = data.callDuration ;
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

function checkCallCost(data){
	if(data.callCost==null||data.callCost==''){
		return "0";
	}
	return data.callCost;
}

function bindEvent(){
	
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
}
function searchData(){
	var busType = $('#busType').val();
	var infoNumber=$('#infoNumber').val();
	var period=$('#period').val();
	$list_dataParam['infoNumber']=infoNumber;
	var partners=$('#partners').val();
	if(partners=='TTEN'){
		$("#call").show();
	}else {
		$("#call").hide();
		}
	if(busType!=null&&busType!=''){
		$list_dataParam['busType']=busType;
	}else
		delete $list_dataParam['period'];
	if(period!=null&&period!=''){
		$list_dataParam['period']=period;
	}else
		delete $list_dataParam['period'];
	if(busType!=null && busType!=''){
		$list_dataParam['busType'] = busType;
	}else{
		delete $list_dataParam['busType'];
	}
	resetList();
	
}