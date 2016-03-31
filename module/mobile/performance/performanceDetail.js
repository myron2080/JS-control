$(document).ready(function(){
	searchData();
});

function nextDay(type){
	var nowDate=$("#nowDate").text();
	$.post(base+'/mobilefastsale/performance/getDate',{nowDate:nowDate,type:type},function(json){
		if(null != json.result){
			$("#nowDate").text(json.result);
			searchData();
		}
	},'json');
	
}

function searchData(){
	$.post(base+'/mobilefastsale/performance/getDetail',{personId:$("#personId").val(),dataLevel:$("#dataLevel").val(),
		orgId:$("#orgId").val(),nowDate:$("#nowDate").text()},function(res){
			/**
			 * 电话量
			 */
		 if(null != res.perData){
			 var obj=res.perData;
			 $("#newAdd").text(obj.NEW_ADD);
			 $("#washResource").text(obj.WASH_RESOURCE);
			 $("#streetData").text(obj.STREET_DATA);
			 $("#messageData").text(obj.MESSAGE_DATA);
			 $("#otherData").text(obj.OTHER_DATA);
			 $("#allFollow").text(obj.FOLLOW_TOTAL);
			 $("#yuyueData").text(obj.YUYUE_DATA);
			 $("#allTel").text(obj.TLE_DATA);
			 $("#successTel").text(obj.TEL_SUCCESS);
			 $("#failPercent").text(obj.FAIL_PERCENT);
		 }else{
			 $("#newAdd").text(0);
			 $("#washResource").text(0);
			 $("#streetData").text(0);
			 $("#messageData").text(0);
			 $("#otherData").text(0);
			 $("#allFollow").text(0);
			 $("#yuyueData").text(0);
			 $("#allTel").text(0);
			 $("#successTel").text(0);
			 $("#failPercent").text("0%");
		 }
		 
		 $("#achieve").text(res.achieve);
		 $("#openBillDay").text(res.days);
		 if(null != res.chiefRank){
			 $("#chiefRank").text(res.chiefRank);
			 $("#rankIndex").text(res.rankIndex); 
		 }else{
			 $("#chiefRank").text("暂无");
			 $("#rankIndex").text("暂无");
		 }
	},'json');
}