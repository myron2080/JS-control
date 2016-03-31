$(document).ready(function(){
	$list_defaultGridParam.pageSize=100;
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
					{display: '客户', name: 'customerName', align: 'center', width: 100,height:40},
					{display: '开通号码', name: 'phoneNumber', align: 'center', width: 100,height:40},
					{display: '月份', name: '', align: 'center', width: 80,height:40,render:getMonth},
					{display: '系统计费', name: 'callTotal', align: 'center',  width: 80,height:40,render:getcallTotal},
					{display: '实际计费', name: 'cost', align: 'center',  width: 80,height:40,render:getCost},
					{display: '相差比例', name: '', align: 'center',  width: 80,height:40,render:getRate},
					{display: '操作', name: '', align: 'center',  width: 120,height:40,render:detailCall},
		        ],
	   delayLoad:false,
       url:getPath()+'/projectm/pmPhoneImportCost/listData'
   }));
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	$("#importData a").click(function(){
		importData();
	});
	searchData();
});

function getcallTotal(data){
	if(data.callTotal){
		return data.callTotal.toFixed(2);
	}
	return "0";
}

function getCost(data){
	if(data.cost){
		return data.cost.toFixed(2);
	}
	return "0";
}

function getRate(data){
	if(data.cost && data.callTotal){
		return ((data.cost-data.callTotal)/data.callTotal*100).toFixed(2)+"%";
	}
}

/**
 * 导入数据
 */
function importData(){
	art.dialog.data("searchData",searchData);
	art.dialog.data("loadClose",Loading.close);
	var dlg = art.dialog.open(getPath()+'/projectm/pmPhoneImportCost/importData',{
		 title:"导入账单",
		 lock:true,
		 width:'380px',
		 height:'100px',
		 id:"importDataDialog",
		 ok:function(){
			 Loading.init();
			 if(dlg.iframe.contentWindow){
				 art.dialog.data("saveImportData")();
			 }
			 return false ;
		 },
		 okVal:'确定'
	});
}


function getMonth(data){
	return $('#showMonth').val();
}

function detailCall(data){
	return '<a href="javascript:viewDeail({infoNumber:\''+data.phoneNumber+'\',period:\''+$('#showMonth').val()+'\'});">查询明细</a>';
	
}

function viewDeail(data){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem( 'detailCall',getPath()+'/projectm/pmPhoneDialDetail/list?infoNumber='+data.infoNumber+'&period='+data.period+'&orgId='+$('#orgInterfaceId option:selected').val(),'查询明细');
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


function searchData(){
	if($('#orgInterfaceId').val()==null || $('#orgInterfaceId').val()==''){
		art.dialog.tips("没有选择渠道商");
		return false;
	}
	var showMonth=$("#showMonth").val();
	if(null == showMonth || showMonth == ''){
		art.dialog.tips("请选择日期!");
		return false;
	}
	var yearMonthArr = showMonth.split("-");
	$list_dataParam['year']=yearMonthArr[0];
	$list_dataParam['month']=yearMonthArr[1];
	$list_dataParam['orgId']=$("#orgInterfaceId").val();
	$list_dataParam['yearMonth']=showMonth;
	resetList();
}


function getSyncOrgId(oldValue,newValue,doc){
	var customerId=newValue.id;
	$('#orgId').val('');
	$("select[index='moreOrgId']").remove();
	if(!customerId){
		$('#customerId').val('');
		return false;
	}
	$('#customerId').val(customerId);
	
	$list_dataParam['customerId']=customerId;
	/**
	 * 根据所选客户获取渠道商id
	 */
	$.post(getPath()+"/projectm/pmSyncManage/getSyncOrgId",{customerId:customerId},function(res){
		res=eval("("+res+")");
		if(res.STATE=='SUCCESS'){
			var pcsList=res.MSG;		
			var select="<li  class='k03'><select id='orgInterfaceId' index='moreOrgId' style='width: 120px' onchange=searchDataAndChangeLi()>";
			for(var i=0;i<pcsList.length;i++){
				if(pcsList[i].partners=="HW"){
					select+="<option partners="+pcsList[i].partners+" value="+pcsList[i].orgId+">"+pcsList[i].configName+"</option>";
				}
			}
			select+="</select></li>";
			$('ul li :eq(0)').after(select);			
			searchData();
		}else{
			art.dialog.tips(res.MSG);
		}
	});
}

function checkPhone(phoneNo){
	if (phoneNo){
		phoneNo = phoneNo.replace('\\s','');
	}	
	var mobileReg = /^1[3|5|8]\d{9}$/ , phoneReg = /^0\d{2,3}-?\d{7,8}$/;
	return mobileReg.test(phoneNo) || phoneReg.test(phoneNo);
}
