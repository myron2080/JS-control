$list_editUrl = getPath()+"/interflow/callCostReport/edit";//编辑及查看url
$list_editWidth = 550;
$list_editHeight = 140;
$list_dataType = "话费统计查看";//数据名称
var sumMoney=0;
$(document).ready(function(){
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '月份', name: 'period', align: 'left', width: 80},
            {display: '使用组织', name: 'orgName', align: 'left', width: 120},
            {display: '固话号码', name: 'infoNumber', align: 'left', width: 120,render:renderInfoNumber},
            {display: '使用模式', name: 'useType', align: 'left', width: 100},
            {display: '电话量', name: 'numberCount', align: 'left', width: 100},
            {display: '总时长', name: 'callDuration', align: 'left', width: 100,render:renderDuration},
            {display: '话费', name: 'callCost', align: 'left', width: 200},
            {display: '套餐扣费', name: '', align: 'left', width: 100},
            {display: '抵消扣费', name: '', align: 'left', width: 100},
            {display: '操作', name: '', align: 'left', width: 200,render:detailCall}
        ],
        url:getPath()+'/interflow/callCostReport/queryByMonth',
        delayLoad:true,
        usePager:true,
        pageSize:100,
        enabledSort:false
    }));
	bindEvent(); 
	searchData();
});

function renderDuration(data){
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
	}else{
		var h = Math.floor(costTime/(60*60)) ;
		var m = Math.floor((costTime - h*(60*60))/60);
		var s = (costTime - h*(60*60))%60;
		rtnVal = h+"小时"+m+ "分"+ s + "秒";
	}
	return rtnVal ;
}

function renderInfoNumber(data){
	var infoNumber = data.infoNumber ;
	if(infoNumber == "HIDE"){
		return "隐藏呼出" ;
	}
	return infoNumber ;
}

/**
 * 统计金额合计
 * @returns
 */
function getTatCost(){
	$.post(getPath()+"/interflow/callCostReport/getTotalCost",$list_dataParam,function(data){
		if(data!=null){
			$("#sumMoney").html(data.total);
		}else{
			$("#sumMoney").html("0.00");
		}
	},'json');
}

//金额千分位自动分位
function comdify(num){    
  num  =  num+"";   
  if(num.indexOf(',')>0)  
  {  
  num = num.replace(/,/gi,'') + "";   
  }  
  var  re=/(-?\d+)(\d{3})/    
  while(re.test(num)){    
  num=num.replace(re,"$1,$2")    
  }    
  return  num;    
} 
function detailCall(data,filterData){
	return '<a href="javascript:viewDeail({infoNumber:\''+data.infoNumber+'\',period:\''+data.period+'\',comboType:\''+data.comboType+'\'});">查询明细</a>';
}

function viewDeail(data){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem( 'detailCall',getPath()+'/interflow/callCostQuery/list?infoNumber='+data.infoNumber+'&period='+data.period+'&comboType='+data.comboType,'查询明细');
	}
}
function bindEvent(){
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
	$("#clear").click(function(){
		$("#orgId").val("");
		$("#orgName").val($("#orgName").attr("defaultValue"));
	});
}
function searchData(){
	//月份查询
	var period = $('#period').val();
	if(!period){
		art.dialog.tips("请选择日期!");
		return ;
	}
	if(period){
		$list_dataParam['period'] = period;
	}else{
		delete $list_dataParam['period'];
	}
	
	//查询组织
	if($("#orgId").val()!=null && $("#orgId").val()!=''){
		$list_dataParam["orgId"] =  $("#orgId").val();
	}else{
		delete $list_dataParam['orgId'];
	}
	
	resetList();
	
	//统计金额合计
	getTatCost();
}

/**清除查询，日期框*/
function clearSearch(){
	$("#orgId").val("");
	$("#orgName").val($("#orgName").attr("defaultValue"));
}
 
function changeMonth(type){
	var period=$("#period").val();
	if(!period){
		art.dialog.tips("请选择日期!");
		return ;
	}
	var y=parseInt(period.split("-")[0],10);//年
	var m=parseInt(period.split("-")[1],10);//月
	var year;
	var month;
	if(type == 'up'){//上一月
		if(m == 1){
			year=(y-1)+"";
			month="12";
		}else{
			year=y+"";
			if(m <11){//月份 需加0
				month="0"+(m-1);
			}else{
				month=(m-1)+"";
			}
		}
		$("#period").val(year+"-"+month);
	}else if(type == 'down'){//下一月
		if(m == 12){
			year=(y+1)+"";
			month="01";
		}else{
			year=y+"";
			if(m <9){//月份 需加0
				month="0"+(m+1);
			}else{
				month=(m+1)+"";
			}
		}
		if((year+"-"+month)>formatDate(new Date(),'yyyy-MM').trim()){
			art.dialog.tips("只能查询当前月以前的话费");
			return ;
		}
		$("#period").val(year+"-"+month);
	} 
	searchData();
}

function viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.period+'&infoNumber='+rowData.infoNumber+'&callCost='+rowData.callCost+'&comboType='+rowData.comboType;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.period+'&infoNumber='+rowData.infoNumber+'&callCost='+rowData.callCost+'&comboType='+rowData.comboType;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}













