$list_editSynUrl = getPath()+"/cmct/syncManage/list";//同步的url
$list_editCpUrl = getPath()+"/cmct/phoneCostPay/list";//充值的url
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		           	{display: '月份', name: '', align: 'center', width: 100,height:40,render:getTime},
					{display: '电话号码', name: 'phoneNumber', align: 'center', width: 100,render:operaRender},
//					{display: '使用组织', name: 'orgName', align: 'left', width: 100,render:loadIngData},
//					{display: '使用模式', name: 'useType', align: 'left', width: 80,render:loadIngData},
//			        {display: '电话量', name: '', align: 'center', width: 80,render:loadIngData},
//			        {display: '总时长', name: '', align: 'left', width: 100,render:loadIngData},
					{display: '本地手机费', name: 'localMobile', align: 'center', width: 100,height:40},
					{display: '本地固话费', name: 'localFixPhone', align: 'center', width: 100,height:40},
					{display: '国内长途费', name: 'inlandLong', align: 'center', width: 100,height:40},
//					{display: '国际长途费', name: 'internationLong', align: 'center', width: 80,height:40},
//					{display: '短信费', name: 'sms', align: 'center', width: 60,height:40},
					{display: '月租合计', name: 'monthlyRent', align: 'center', width: 100,height:40},
					{display: '套餐扣费', name: 'comboDeduction', align: 'center', width: 100,height:40},
					{display: '低消补扣', name: 'offsetDeduction', align: 'center', width: 100,height:40},
					{display: '其他合计', name: 'other', align: 'center', width: 100,height:40},
					{display: '总计', name: 'callTotal', align: 'center', width: 100,height:40},
					{display: '查看明细', name: '', align: 'center', width: 100,height:40,render:detailCallQuery}
					//{display: '查看明细', name: '', align: 'center', width: 100,height:40,render:detailCall}
		        ],
       delayLoad:true,
       url:getPath()+'/cmct/phoneCm/queryCmdData',
       onAfterShowData:function(gridData){
	    	loadData(gridData);
	   }
   }));
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	searchData();
});

function loadIngData(){
	return '正在读取....'
}
/**
 * 加载,组织,使用模式.电话量,总时长
 */
function loadData(gridData){
	if(gridData){
		$.post(getPath()+'/cmct/phoneCm/loadData',$list_dataParam,function(data){
			
			if(!data || data.items.length<1){
				 $("td[id^='tableContainer|2|r10'][id$='|c104'] div").html("<font color='red'></font>");
				 $("td[id^='tableContainer|2|r10'][id$='|c105'] div").html("<font color='red'></font>");
				 $("td[id^='tableContainer|2|r10'][id$='|c106'] div").html("<font color='red'></font>");
				 $("td[id^='tableContainer|2|r10'][id$='|c107'] div").html("<font color='red'></font>");
				 return ;
			}
			for(var i = 0 ; i < gridData.items.length ; i ++){
				var rowObj = gridData.items[i];
					var existsFlag = false;
					var tdId1 = "";
					var tdId2 = "";
					var tdId3 = "";
					var tdId4 = "";
					if((i+1)>=10 && (i+1)<=100){
						tdId1 = "tableContainer|2|r10"+(i+1)+"|c104"
						tdId2 = "tableContainer|2|r10"+(i+1)+"|c105"
						tdId3 = "tableContainer|2|r10"+(i+1)+"|c106"
						tdId4 = "tableContainer|2|r10"+(i+1)+"|c107"
					}else{
						tdId1 = "tableContainer|2|r100"+(i+1)+"|c104"
						tdId2 = "tableContainer|2|r100"+(i+1)+"|c105"
						tdId3 = "tableContainer|2|r100"+(i+1)+"|c106"
						tdId4 = "tableContainer|2|r100"+(i+1)+"|c107"
					}
					if((i+1)>=100){
						tdId1 = "tableContainer|2|r1"+(i+1)+"|c104"
						tdId2 = "tableContainer|2|r1"+(i+1)+"|c105"
						tdId3 = "tableContainer|2|r1"+(i+1)+"|c106"
						tdId4 = "tableContainer|2|r1"+(i+1)+"|c107"
					}
					
					for(var k = 0 ; k < data.items.length ; k ++){
						var numPkg = data.items[k];
						 
						if($.trim(rowObj.phoneNumber) == $.trim(numPkg.infoNumber)){
							
							$("td[id='"+tdId1+"'] div").text(numPkg.orgName);
							$("td[id='"+tdId2+"'] div").text(numPkg.useType);
							$("td[id='"+tdId3+"'] div").text(numPkg.numberCount);
							$("td[id='"+tdId4+"'] div").text(renderDuration(numPkg.callDuration));
							existsFlag = true;
							break;
						}
					}
					if(!existsFlag){
						$("td[id='"+tdId1+"'] div").text('');
						$("td[id='"+tdId2+"'] div").text('');
						$("td[id='"+tdId3+"'] div").text('');
						$("td[id='"+tdId4+"'] div").text('');
					}
				
			}
		},'json');
	}
}


function changeType(){
	var type=$("#dateType").val();
	if(type == 'month'){
		$("#effectdate").hide();
		$("#day_single").hide();
		$("#month_single").show();
		searchData();
	}else if(type == 'day'){
		$("#month_single").hide();
		$("#effectdate").hide();
		$("#day_single").show();
		searchData();
	}else if(type == 'period'){
		$("#day_single").hide();
		$("#month_single").hide();
		$("#effectdate").show();
		searchData();
	}
		
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

function changeDay(type){
	var showDay=$("#showDay").val();
	if(null != showDay && showDay != ''){
		$.post(getPath()+'/fastsale/achieveDetail/getDate',{showDay:showDay,type:type},function(json){
			if(null != json.result){
				$("#showDay").val(json.result);
				searchData();
			}
		},'json');
	}else{
		art.dialog.tips("请选择日期!");
	}
}

function searchData(){
	$('[moneySpan]').html("0.00");
	
	if($("#orgId :selected").val()==null || $("#orgId :selected").val()==''){
		art.dialog.tips("核算渠道不存在");
		return false;
	}
	
	var showMonth=$("#showMonth").val();
	if(null == showMonth || showMonth == ''){
		art.dialog.tips("请选择日期!");
		return false;
	}
	var partners=$('#orgId option:selected').attr('partners');
	
	var yearMonthArr = showMonth.split("-");
	$list_dataParam['year']=yearMonthArr[0];
	$list_dataParam['month']=yearMonthArr[1];
	$list_dataParam['orgId']=$("#orgId :selected").val();
	$list_dataParam['partners']=partners;
	if(partners=='HW'){
		$list_dataParam['lineUp']='YES';
		$list_dataParam['lineDown']='YES';
	}else{
		delete $list_dataParam['lineUp'];
		delete $list_dataParam['lineDown'];
	}
	
	getPhoneCmrData();
	
}

function getPhoneCmrData(){
	$.post(getPath()+'/cmct/phoneCm/queryCmrData',{year:$list_dataParam['year'],month:$list_dataParam['month'],orgId:$list_dataParam['orgId'],lineUp:$list_dataParam['lineUp'],lineDown:$list_dataParam['lineDown']},function(res){
		if(res){
			$('#cmrId').val(res.id); 
			$('#sumMoney').html(res.costTotal);
			$('#phoneMoney').html(res.localFixPhone);
			$('#moblieMoney').html(res.localMobile);
			$('#inlandLong').html(res.inlandLong);
			$('#skypeMoney').html(res.comboDeduction);
			$('#lowMoney').html(res.offsetDeduction);
			$('#monthMoney').html(res.monthlyRent);
			$list_dataParam['cmrId']=$('#cmrId').val();
			resetList();
		}else{			
			resetList();
			return false;
		}
	},'json');
}

function getTime(data){
	return data.year+"-"+data.month;
}

function operaRender(data){
	if(!checkPhone(data.phoneNumber)){
		return "隐藏号码";
	}
	return data.phoneNumber;
}
function checkPhone(phoneNo){
	if (phoneNo){
		phoneNo = phoneNo.replace('\\s','');
	}
	var var1 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/ ;
	var var2 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{3}$/ ;
	return var1.test(phoneNo) || var2.test(phoneNo);
}

function detailCall(data,filterData){
	var period=getTime(data);
	return '<a href="javascript:viewDeail({infoNumber:\''+data.phoneNumber+'\',period:\''+period+'\',partners:\''+$("#orgId :selected").attr("partners")+'\'});">查询明细</a>';
	
}


function viewDeail(data){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem( 'detailCall',getPath()+'/cmct/phoneDialDetail/list?infoNumber='+data.infoNumber+'&period='+data.period+'&partners='+data.partners,'查询明细');
	}
}

function renderDuration(costTime){
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

function syncCallList(){
	art.dialog.open($list_editSynUrl,
			{title:"同步话单",
			lock:true,
			width:'800px',
			height:'600px',
			id:'synCall',
			button:[{name:'关闭'}]}
	);
}

function payCost(){
	art.dialog.open($list_editCpUrl,
			{title:"话费充值",
			lock:true,
			width:'770px',
			height:'600px',
			id:'synCall',
			button:[{name:'关闭'}]}
	);
}
function detailCallQuery(data,filterData){
	var period=getTime(data);
	return '<a href="javascript:viewQuery({infoNumber:\''+data.phoneNumber+'\',period:\''+period+'\',partners:\''+$("#orgId :selected").attr("partners")+'\'});">查询明细</a>';
	
}
function viewQuery(data){
	art.dialog.open(getPath()+'/cmct/phoneDialDetail/phoneDialdetailQuery?infoNumber='+data.infoNumber+'&period='+data.period+'&partners='+data.partners,{
		 title:'查看明细',
		 lock:true,
		 width:'750px',
		 height:'480px',
		 id:"detailCallQuery",
		 button:[{name:'关闭'}]
		});
	/*if(typeof(window.top.addTabItem)=='function'){
		art.dialog.open( 'detailCallQuery',getPath()+'/cmct/phoneDialDetail/phoneDialdetailQuery?infoNumber='+data.infoNumber+'&period='+data.period+'&partners='+data.partners);
	}*/
}
