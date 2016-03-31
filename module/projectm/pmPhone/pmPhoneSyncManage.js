$(document).ready(function(){
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '日期', name: 'dateStr', align: 'center', width: 100,height:40,render:function(data,filterData){
		            	return data.dateStr+"日";
		            }},
		            {display: '同步状态', name: '', align: 'center', width: 100,height:40,render:renderStatus},
		            {display: '同步时间', name: 'syncTime', align: 'center', width: 160,height:40},
		            {display: '同步数量', name: 'syncCount', align: 'center', width: 160,height:40},
		            {display: '操作', name: '', align: 'center', width: 200,height:40,render:renderSync}
		        ],
       delayLoad:true,
       url:getPath()+'/projectm/pmSyncManage/queryData'
   }));
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	openDataPicker('getCustomer');
	//searchData();
});

function renderStatus(data){
	if(data.flag==true){
		return '已同步';
	}else{
		return '未同步';
	}
}
function renderSync(data){
	var str='';
	var date=$('#showMonth').val()+"-"+data.dateStr;
	if(data.flag==true){
		str='重新同步';
	}else{
		str='同步';
	}
	return '<a href="javascript:syncCallListDay({date:\''+date+'\'});">'+str+'</a>';
}

/**
 * 按天同步话单
 */
function syncCallListDay(data){
	if($('#customerId').val()==null || $('#customerId').val()==''){
		art.dialog.tips("请先选择客户在同步");
		return false;
	}
	if(!$('#showMonth').val()){
		art.dialog.tips("请先选择月份");
		return false;
	}
	art.dialog.tips("正在同步中！");
	Loading.init();
	$.post(getPath()+"/projectm/pmPhoneDialDetail/syncCallListDay",{syncTime:data.date,customerId:$('#customerId').val(),showMonth:$('#showMonth').val()},function(data){
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips("成功同步 "+data.syncCount+" 条话单记录！");
			searchData();
		}else{
			art.dialog.alert("同步失败："+data.MSG);
			//art.dialog.tips("同步失败："+data.MSG);
		}
		Loading.close();
	},'json');
}

/**
 * 同步整月
 */
function syncCallList(){
	if($("#btnSyncCall").hasClass("graybtn")){
		art.dialog.tips("同步正在处理中，请稍等片刻...");
		return false ;
	}
	if($('#customerId').val()==null || $('#customerId').val()==''){
		art.dialog.tips("请先选择客户在同步");
		return false;
	}
	
	$("#btnSyncCall a").text("同步中，请稍等片刻...");
	$("#btnSyncCall").removeClass("orangebtn");
	$("#btnSyncCall").addClass("graybtn");
	Loading.init();
	$.post(getPath()+"/projectm/pmSyncManage/syncCallList",{periond:$('#showMonth').val(),customerId:$('#customerId').val()},function(data){
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips("成功同步 "+data.syncCount+" 条话单记录！");
			$("#btnSyncCall a").text("同步整月");
			$("#btnSyncCall").removeClass("graybtn");
			$("#btnSyncCall").addClass("orangebtn");
			searchData();
		}else{
			art.dialog.alert("同步失败："+data.MSG);
			//art.dialog.tips("同步失败："+data.MSG);
			$("#btnSyncCall a").text("同步整月");
			$("#btnSyncCall").removeClass("graybtn");
			$("#btnSyncCall").addClass("orangebtn");
		}
		Loading.close();
	},'json');
}

/**
 * 获取1日的同步数量的状态
 */
function getTimeFlagSysCount(){
	$.post(getPath()+"/projectm/pmSyncManage/getTimeFlagSysCount",{periond:$('#showMonth').val(),syncOrgId:$("#customerId").val()},function(data){
		if(data.STATE == 'MONTH'){
			$("#li_timeFlagSysCount").text("注：01日的同步数量为当前整个月的数量");
		}else if(data.STATE == 'DAY'){
			$("#li_timeFlagSysCount").text("注：01日的同步数量为01日整天的数量");
		}else{
			$("#li_timeFlagSysCount").text("注：01日还未同步");
		}
	},'json');
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
	
	var flag=$('li select').attr('index')=='moreOrgId'?true:false;
	if(flag){
		$("#customerId").val($('#orgInterfaceId option:selected').val())
	}
	/**
	 * 客户id
	 */
	if($('#customerId').val()==null || $('#customerId').val()==''){
		art.dialog.tips("请先选择客户在点击查询");
		return false;
	}
	
	//var orgId=$("#orgId").val();
	$list_dataParam['dateType']=$("#dateType").val();
	$list_dataParam['showMonth']=$("#showMonth").val();
	$list_dataParam['showDay']=$("#showDay").val();
	$list_dataParam['orgId']=$("#orgId").val();
	$list_dataParam['syncOrgId']=$("#customerId").val();
	
	resetList();
	getTimeFlagSysCount();
}

function getSyncOrgId(oldValue,newValue,doc){
	var customerId=newValue.id;
	$('#customerId').val('');
	$('select').remove();
	if(!customerId){			
		return false;
	}
	/**
	 * 根据所选客户获取渠道商id
	 */
	$.post(getPath()+"/projectm/pmSyncManage/getSyncOrgId",{customerId:customerId},function(res){
		res=eval("("+res+")");
		if(res.STATE=='SUCCESS'){
			var pcsList=res.MSG;
			if(pcsList.length==1){
				$('#customerId').val(pcsList[0].orgId);
				$('select').remove();
			}else{
				var select="<li><select id='orgInterfaceId' index='moreOrgId' style='width: 120px' onchange=getSearchData()>";
				for(var i=0;i<pcsList.length;i++){
					select+="<option value="+pcsList[i].orgId+">"+pcsList[i].configName+"</option>";
				}
				select+="</select></li>";
				$('ul li :eq(0)').after(select);
			}
		searchData();
		}else{
			art.dialog.tips(res.MSG);
		}
	});
}

function getSearchData(){
	searchData();
}