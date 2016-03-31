$(document).ready(function(){

	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '客户名称', name: 'customer.name', align: 'left', width: 120,height:40},
		            {display: '月份', name: 'showMonth', align: 'left', width: 100,height:40},
		            {display: '核算渠道', name: 'orgName', align: 'left', width: 150,height:40},
		            {display: '线路数', name: 'memberCount', align: 'center', width: 100,height:40 ,totalSummary:{type: 'sum'}},
		            {display: '总时长(分钟)', name: 'tatalDuration', align: 'left', width: 120,height:40 ,totalSummary:{type: 'sum'}},
		            {display: '总费用(元)', name: 'tatalCost', align: 'left', width: 100,height:40 ,totalSummary:{type: 'sum'}},
		            {display: '平均时长(分钟)', name: 'avgDuration', align: 'center', width: 120,height:40 ,totalSummary:{type: 'avg'}}
		        ],
        delayLoad:true,
        url:getPath()+'/projectm/pmPhoneCm/costDetailData'
    }));
	 
	 $('#searchBtn').click(function(){
		 searchData();
	 });
	 searchData();
});

function searchData(){
	var showMonth=$("#showMonth").val();
	if(null == showMonth || showMonth == ''){
		art.dialog.tips("请选择日期!");
		return false;
	}
	$list_dataParam['showMonth']=showMonth;
	$list_dataParam['customerId']=$('#customerId').val();
	resetList();
}

function changeMonth(type){
	var showMonth=$("#showMonth").val();
	if(null != showMonth && showMonth != ''){
		var y=parseInt(showMonth.split("-")[0],10);//年
		var m=parseInt(showMonth.split("-")[1],10);//月
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
		}else{//下一月
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
		}
		
		if((year+"-"+month)<('2013-07')){
			art.dialog.tips("只能查询当前月以后同步的信息");
			return ;
		}
		if((year+"-"+month)>formatDate(new Date(),'yyyy-MM').trim()){
			art.dialog.tips("只能查询当前月以前同步的信息");
			return ;
		}
		$("#showMonth").val(year+"-"+month);
		searchData();
	}else{
		art.dialog.tips("请选择日期!");
	}
}