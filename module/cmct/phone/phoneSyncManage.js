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
       url:getPath()+'/cmct/syncManage/queryData'
   }));
	searchData();
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
	if($("#selSyncOrgYun :selected").val()==null || $("#selSyncOrgYun :selected").val()==''){
		art.dialog.tips("请选择核算渠道");
		return false;
	}
	var partners=$("#selSyncOrgYun :selected").attr('partners');
	
	art.dialog.tips("正在同步中！");
	Loading.init();
	$.post(getPath()+"/cmct/phoneDialDetail/syncCallListDay",{partners:partners,syncTime:data.date,syncOrgId:$("#selSyncOrgYun :selected").val(),syncOrgKey:$("#selSyncOrgYun :selected").attr('orgKey'),getCallUrl:$("#selSyncOrgYun :selected").attr('getCallUrl')},function(data){
		Loading.close();
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips("成功同步 "+data.syncCount+" 条话单记录！");
			searchData();
		}else{
			art.dialog.alert("同步失败："+data.MSG);
			//art.dialog.tips("同步失败："+data.MSG);
		}		
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
	$("#btnSyncCall a").text("同步中，请稍等片刻...");
	$("#btnSyncCall").removeClass("orangebtn");
	$("#btnSyncCall").addClass("graybtn");
	Loading.init();
	$.post(getPath()+"/cmct/syncManage/syncCallList",{periond:$('#showMonth').val()},function(data){
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
	$.post(getPath()+"/cmct/syncManage/getTimeFlagSysCount",{periond:$('#showMonth').val(),syncOrgId:$("#selSyncOrgYun :selected").val()},function(data){
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
	
	if($("#selSyncOrgYun :selected").val()==null || $("#selSyncOrgYun :selected").val()==''){
		art.dialog.tips("核算渠道不存在");
		return false;
	}
	
	$list_dataParam['dateType']=$("#dateType").val();
	$list_dataParam['showMonth']=$("#showMonth").val();
	$list_dataParam['showDay']=$("#showDay").val();
	$list_dataParam['orgId']=$("#orgId").val();
	$list_dataParam['syncOrgId']=$("#selSyncOrgYun :selected").val();
	
	resetList();
	getTimeFlagSysCount();
}