$(document).ready(function(){
	$list_defaultGridParam.pageSize=100;
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            { display: '基本信息', columns:
		                [
							{display: '所属客户', name: 'customer.name', align: 'center', width: 80,height:40},
							{display: '月份', name: '', align: 'center', width: 60,height:40,render:getTime},
							{display: '电话号码', name: 'phoneNumber', align: 'center', width: 100,height:40,render:operaRender},
							{display: '所属套餐', name: '', align: 'center',  width: 120, isSort:false,render:comboNameRender},
		                ]
		             },
					
					
				/*	{display: '电话量', name: 'callNumber', align: 'center', width: 60,height:40},
					{display: '总时长', name: 'durationTotal', align: 'center', width: 60,height:40},*/
		            
		             { display: '费用(元)', columns:
			                [
			                 	{display: '总费用', name: '', align: 'center', width: 80,height:40,render:totalCost},
								{display: '本地手机费', name: 'localMobile', align: 'center', width: 80,height:40},
								{display: '本地固话费', name: 'localFixPhone', align: 'center', width: 80,height:40},
								{display: '国内长途费', name: 'inlandLong', align: 'center', width: 80,height:40},
								//{display: '国际长途费', name: 'internationLong', align: 'center', width: 80,height:40},
								//{display: '短信费', name: 'sms', align: 'center', width: 60,height:40},
								{display: '月租合计', name: 'monthlyRent', align: 'center', width: 60,height:40},
								{display: '套餐扣费', name: 'comboDeduction', align: 'center', width: 60,height:40},
								{display: '低消补扣', name: 'offsetDeduction', align: 'center', width: 60,height:40},
								{display: '线上总费用', name: 'callTotal', align: 'center', width: 80,height:40},
								{display: '线下总费用', name: 'lineDownCallTotal', align: 'center', width: 80,height:40}
								//{display: '其他合计', name: 'other', align: 'center', width: 60,height:40},
								//{display: '总计', name: 'callTotal', align: 'center', width: 60,height:40}
			                ] 
			          },
			          { display: '时长(分钟)', columns:
			                [
								{display: '总时长', name: '', align: 'center', width: 100,height:40,render:totalDuration},
								{display: '线上总时长', name: 'durationTotal', align: 'center', width: 80,height:40,render:renderMin},
								{display: '线下总时长', name: 'lineDownDurationTotal', align: 'center', width: 80,height:40}
			                ]
			           },
					{display: '查看明细', name: '', align: 'center', width: 90,height:40,render:detailCall}
		        ],
       delayLoad:true,
       url:getPath()+'/projectm/pmPhoneCm/queryCmdData',
       onAfterShowData:function(gridData){
//	    	getAllNumberPackageList(gridData);
	    }
   }));
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	$("#importData a").click(function(){
		importData();
	});
	
	$("#exportExcel").bind("click",function(){
		exportSearch();
	});
	
	$('#syncCombo').bind('click',function(){
		syncCombo();
	});
	
	$('.system_tab li').click(function(){
		$(this).addClass("hover").siblings().removeClass("hover");
		var _this=$(this);
		$('[sync]').each(function(){
			if($(this).attr("index")==_this.attr("id")){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
		searchData();
	});
});

function syncCombo(){
	art.dialog.confirm('确定同步当前月份的所以客户的套餐吗?',function(){
		Loading.init();
		syncComboTemp();
	});
}

function syncComboTemp(){
	if(!monthTemp){
		art.dialog.tips('时间不能为空...');
		return false;
	}
	$.post(getPath()+'/projectm/pmPhoneCm/syncCombo',{numberStatus:1,showMonth:$("#showMonth").val()},function(res){
		if(Loading.isExistLoad()){
			Loading.close();
		}
		if(res.STATE=='SUCCESS'){
			art.dialog.tips('同步成功');
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

/**
 * 导入数据
 */
function importData(){
	if(!$('#orgInterfaceId option:selected').val()){
		art.dialog.tips('请先选择客户.....');
		return false;
	}
	art.dialog.data("searchData",searchData);
	art.dialog.data("loadClose",Loading.close);
	var dlg = art.dialog.open(getPath()+'/projectm/pmPhoneCm/importData',{
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

function comboNameRender(rowData){
	return rowData.comboName;
}

function detailCall(data,filterData){
	var period=getTime(data);
	return '<a href="javascript:viewDeail({infoNumber:\''+data.phoneNumber+'\',period:\''+period+'\'});">查询明细</a>';
	
}

function viewDeail(data){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem( 'detailCall',getPath()+'/projectm/pmPhoneDialDetail/list?infoNumber='+data.infoNumber+'&period='+data.period+'&orgId='+$('#orgInterfaceId option:selected').val(),'查询明细');
	}
}

function getAllNumberPackageList(gridData){
	if(!gridData){
		return ;
	}
	var url;
	if($list_dataParam['partners']=='TTEN'){
		url=getPath()+'/projectm/pmPhonenumber/getAllNumberPackageList';
	}else{
		url=getPath()+'/projectm/pmDefinePackage/getAllNumberPackageList';
	}
	$.post(url,$list_dataParam,function(data){
		if(!data || data.length<1){
			$("td[id^='tableContainer|2|r10'][id$='|c106'] div").html("<font color='red'>无此号码</font>");
			return ;
		}
		for(var i = 0 ; i < gridData.items.length ; i ++){
			var rowObj = gridData.items[i];
			var existsFlag = false;
			var existsFlag2 = false;
			var tdId = "";
			if((i+1)<10){
				tdId = "tableContainer|2|r10"+(i+1)+"|c106";
			}else if((i+1)>=10 && (i+1)<100){
				tdId = "tableContainer|2|r100"+(i+1)+"|c106";
			}else{
				tdId = "tableContainer|2|r1"+(i+1)+"|c106";
			}
			for(var k = 0 ; k < data.length ; k ++){
				var numPkg = data[k];
				 if($list_dataParam['partners']=='TTEN'){
					 if($.trim(rowObj.phoneNumber) == $.trim(numPkg.phoneNo)){
							$("td[id='"+tdId+"'] div").text(numPkg.currentPackName);
							existsFlag = true;
							break;
					  }
				 }else{
					 var phoneNumber=rowObj.phoneNumber;
					 if(rowObj.phoneNumber && rowObj.phoneNumber.indexOf("86")==0){
						 phoneNumber="0"+phoneNumber.substring(2, phoneNumber.length);  
					 }
					 
					 if(phoneNumber == $.trim(numPkg.showNumber)){
							 if(numPkg.pmDefinePackage && numPkg.pmDefinePackage.name){
								 $("td[id='"+tdId+"'] div").text(numPkg.pmDefinePackage.name);
									existsFlag2 = true;
									break;
							 }else{
								 existsFlag2=false;
								 break;
							 }
					  }
				 }
			}
			if(!existsFlag && $list_dataParam['partners']=='TTEN'){
				$("td[id='"+tdId+"'] div").html("<font color='red'>无此号码</font>");
			}
			if(!existsFlag2 && $list_dataParam['partners']=='HW'){
				$("td[id='"+tdId+"'] div").html("<font color='red'>未设置套餐</font>");
			}
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

function getListDataParam(){
	$("#orgId").val($('#orgInterfaceId option:selected').val());
	if($('#orgId').val()==null || $('#orgId').val()==''){
		art.dialog.tips("请先选择客户在点击查询");
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
	
	$list_dataParam['orgId']=$("#orgId").val();
	$list_dataParam['showMonth']=showMonth;
//	$list_dataParam['customerId']=$('#customerId').val();
	var partners=$('#orgInterfaceId option:selected').attr('partners');
	if(partners=='TTEN'){
		/*$list_dataGrid.toggleCol("callTotal",false);
		$list_dataGrid.toggleCol("lineUpCallTotal",false);
		$list_dataGrid.toggleCol("lineUpDuration",false);
		$list_dataGrid.toggleCol("lineDownDuration",false);*/
	}else{
		/*$list_dataGrid.toggleCol("callTotal",true);
		$list_dataGrid.toggleCol("lineUpCallTotal",true);
		$list_dataGrid.toggleCol("lineUpDuration",true);
		$list_dataGrid.toggleCol("lineDownDuration",true);*/
		if(!$('#LineUp').is(":checked") && !$('#LineDown').is(":checked")){
			art.dialog.tips('至少选择一个线上或则线下...');
			return false;
		}

		if($('#LineUp').is(":checked")){
			$list_dataParam['lineUp']='YES';
		}else{
			delete $list_dataParam['lineUp'];
		}
		if($('#LineDown').is(":checked")){
			$list_dataParam['lineDown']='YES';
		}else{
			delete $list_dataParam['lineDown'];
		}
	}
	$list_dataParam['partners']=partners;
	$list_dataParam['version']=$(".system_tab li[class='hover']").attr("id");
	$list_dataParam['customerName']=$("#customerName").val();
	$list_dataParam['configId']=$('#orgInterfaceId option:selected').attr("configId");
	return true;
}

function searchData(){
	$('[moneySpan]').html("0.00");
	if(getListDataParam()){		
		getPhoneCmrData();
	}
	
}

function getPhoneCmrData(){
	$.post(getPath()+'/projectm/pmPhoneCm/queryData',$list_dataParam,function(res){
		if(res){
			var pprs=res.items;
			if(!pprs[0]){
				$list_dataParam['cmrId']='';
				$('#cmrId').val(''); 
				resetList();
				return false;
			}
			$('#cmrId').val(pprs[0].id); 
			$('#sumMoney').html(pprs[0].costTotal);
			$('#phoneMoney').html(pprs[0].localFixPhone);
			$('#moblieMoney').html(pprs[0].localMobile);
			$('#inlandLong').html(pprs[0].inlandLong);
			$('#skypeMoney').html(pprs[0].comboDeduction);
			$('#lowMoney').html(pprs[0].offsetDeduction);
			$('#monthMoney').html(pprs[0].monthlyRent);
			$list_dataParam['cmrId']=$('#cmrId').val();
			resetList();
		}else{
			$('#cmrId').val(''); 
			$list_dataParam['cmrId']='';
			resetList();
		}
	},'json');
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
				select+="<option configId="+pcsList[i].id+" partners="+pcsList[i].partners+" value="+pcsList[i].orgId+">"+pcsList[i].configName+"</option>";
			}
			select+="</select></li>";
			$('ul li :eq(0)').after(select);			
			searchDataAndChangeLi();
		}else{
			art.dialog.tips(res.MSG);
		}
	});
}

function searchDataAndChangeLi(){
	if($('#orgInterfaceId option:selected').attr("partners")=='HW'){
		$('[Line]').show();
	}else{
		$('[Line]').hide();
	}
	searchData();
}

/**
 * 同步
 */
function customerSync(obj){
	var startValue=$(obj).find('A').text();
	var version = $(obj).attr('index');
	if($(obj).hasClass("graybtn")){
		art.dialog.tips(startValue+"正在处理中，请稍等片刻...");
		return false ;
	}
	
	if($('#customerId').val()==null || $('#customerId').val()==''){
		art.dialog.tips("请先选择客户在同步");
		return false;
	}
	
	var partners=$('#orgInterfaceId option:selected').attr('partners');
	var customerId = $('#customerId').val();
	$(obj).find('A').text(startValue+"中......");
	$(obj).removeClass("orangebtn");
	$(obj).addClass("graybtn");
	
	if(version=='SYNCVERSION'){
		if(partners=='TTEN'){
			var periond=$('#showMonth').val().replace("-","");
			var per=$('#showMonth').val();
			$.post(getPath()+"/projectm/pmPhoneCm/cmSync",{billingCycle:periond,orgId:$('#orgId').val(),type:$('#syncType').val(),customerId:customerId,per:per},function(data){
				if(data.STATE == 'SUCCESS'){
					art.dialog.tips(data.MSG);
					$(obj).find('A').text(startValue);
					$(obj).removeClass("graybtn");
					$(obj).addClass("orangebtn");
					searchData();
				}else{
					art.dialog.alert("同步失败："+data.MSG);
					$(obj).find('A').text(startValue);
					$(obj).removeClass("graybtn");
					$(obj).addClass("orangebtn");
				}
			},'json');
		}else{
			var periond=$('#showMonth').val();
			$.post(getPath()+"/projectm/pmPhoneCm/cmSyncAndHw",{periond:periond,orgId:$('#orgId').val(),customerId:customerId},function(data){
				if(data.STATE == 'SUCCESS'){
					art.dialog.tips(data.MSG);
					$(obj).find('A').text(startValue);
					$(obj).removeClass("graybtn");
					$(obj).addClass("orangebtn");
					searchData();
				}else{
					art.dialog.alert("同步失败："+data.MSG);
					$(obj).find('A').text(startValue);
					$(obj).removeClass("graybtn");
					$(obj).addClass("orangebtn");
				}

			},'json');
		}
		
	}else if(version=='EDITVERSION'){		
		
		var cmrId=$('#cmrId').val();
		if(!cmrId){
			art.dialog.tips('没有找到当前月账单数据');
			return false;
		}
		$.post(getPath()+"/projectm/pmPhoneCm/editDataCreate",{cmrId:cmrId},function(res){
			$(obj).find('A').text(startValue);
			$(obj).removeClass("graybtn");
			$(obj).addClass("orangebtn");
			if(res.STATE=='SUCCESS'){
				art.dialog.tips(res.MSG);
				searchData();
			}else{
				art.dialog.alert("修订失败："+data.MSG);
			}
		},'json')
	}else if(version=='PUBLISHVERSION'){
		
		$.post(getPath()+"/projectm/pmPhoneCm/judjeEditData",{year:$list_dataParam['year'],month:$list_dataParam['month'],orgId:$('#orgId').val()},function(res){
			$(obj).find('A').text(startValue);
			$(obj).removeClass("graybtn");
			$(obj).addClass("orangebtn");
			if(res.STATE=='SUCCESS'){
				var cmrEditId=res.cmrEditId;
				syncPublish(cmrEditId);
			}else{
				$(obj).find('A').text(startValue);
				$(obj).removeClass("graybtn");
				$(obj).addClass("orangebtn");
				art.dialog.alert(res.MSG);
			}
		},'json');
	}
}

function syncPublish(cmrEditId){
	if(!cmrEditId){
		art.dialog.tips('账单id不存在');
		return false;
	}
	$.post(getPath()+"/projectm/pmPhoneCm/createPublisgData",{cmrId:cmrEditId},function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			searchData();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}


function editData(){
	var checkSyncDataUrl=getPath()+"/projectm/pmPhoneCm/checkSyncData";
	$.post(checkSyncDataUrl,$list_dataParam,function(res){
		if(res.STATE!='SUCCESS'){
			art.dialog.tips('还没有同步数据,不能生成修订版');
			return false;
		}else{
			$('#cmrId').val(res.ppr.id);
			$list_editDataListUrl = getPath()+"/projectm/pmPhoneCm/editPhoneCmList?cmrId="+res.ppr.id;
			art.dialog.data("flag",false);
			art.dialog.open($list_editDataListUrl,
					{title:"修改账单",
					lock:true,
					width:'350px',
					height:'350px',
					id:'editData',
					button:[{name:'关闭'}],
					close:function(){
						if(art.dialog.data("flag")){
							searchData();
						}
					}
				}
			);
		}		
	},'json');
	
}

function operaRender(data){
	if(!data.phoneNumber){
		return "隐藏号码";
	}
	return data.phoneNumber;
}

function checkPhone(phoneNo){
	if (phoneNo){
		phoneNo = phoneNo.replace('\\s','');
	}	
	var mobileReg = /^1[3|5|8]\d{9}$/ , phoneReg = /^0\d{2,3}-?\d{7,8}$/;
	return mobileReg.test(phoneNo) || phoneReg.test(phoneNo);
}

function getTime(data){
	return data.year+"-"+data.month;
}

function changeVersion(obj){
	$('[sync]').each(function(){
		if($(this).attr('index')==$(obj).val()){
			$list_dataParam['version']=$(this).attr('index');
			$(this).show();
		}else{
			$(this).hide();
		}
	});
	searchData();
}

function renderMin(data){
	return ""+data.durationTotal/60;
}

function totalDuration(data){
	var t1=0;
	var t2=0;
	if(data.durationTotal){
		t1=data.durationTotal/60;
	}
	if(data.lineDownDurationTotal){
		t2=data.lineDownDurationTotal;
	}
	return ""+(t1+t2);
}

function totalCost(data){
	var t1=0;
	var t2=0;
	if(data.callTotal){
		t1=data.callTotal;
	}
	if(data.lineDownCallTotal){
		t2=data.lineDownCallTotal;
	}
	return ""+(t1+t2);
}

function exportSearch(){
	 if(getListDataParam()){		 
		 var params=JSON.stringify($list_dataParam);
		 params=params.replace(/\{"/g,"");
		 params=params.replace(/\"}/g,"");
		 params=params.replace(/\":"/g,"=");
		 params=params.replace(/\","/g,"&");
		 var LoadFile=$("#downLoadFile");
		 LoadFile.attr("src",base+"/projectm/pmPhoneCm/export?"+params);
//		 $.post(base+"/projectm/pmPhoneCm/export?"+params,{},function(res){
//			 if(res.STATE!="SUCCESS"){
//				 art.dialog.alert(res.MSG);
//			 }
//		 },'json');
	 }
}


