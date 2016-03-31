$(document).ready(function(){
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '所属客户', name: 'customer.name', align: 'center', width: 100,height:40},
		            {display: '号码', name: 'phoneNumber', align: 'center', width: 100,height:40,render:operaRender},
		            {display: '时间', name: '', align: 'center', width: 100,height:40,render:getTime},
		            {display: '总计', name: 'callTotal', align: 'center', width: 80,height:40},
		            {display: '本地手机费', name: 'localMobile', align: 'center', width: 80,height:40},
		            {display: '本地固话费', name: 'localFixPhone', align: 'center', width: 80,height:40},
		            {display: '国内长途费', name: 'inlandLong', align: 'center', width: 80,height:40},
		            {display: '国际长途费', name: 'internationLong', align: 'center', width: 80,height:40},
		            {display: '短信费', name: 'sms', align: 'center', width: 80,height:40},
		            {display: '月租合计', name: 'monthlyRent', align: 'center', width: 80,height:40},
		            {display: '套餐合计', name: 'comboDeduction', align: 'center', width: 80,height:40},
		            {display: '低消合计', name: 'offsetDeduction', align: 'center', width: 80,height:40},
		            {display: '其他合计', name: 'other', align: 'center', width: 80,height:40}
		        ],
	   parms:{orgId:$("#orgId").val(),month:$('#month').val(),year:$('#year').val()},
       url:getPath()+'/projectm/pmPhoneCm/queryCmdData'
   }));
	
});

function operaRender(data){
	if(!checkPhone(data.phoneNumber)){
		return "隐藏号码";
	}
	return data.phoneNumber;
}

function getTime(data){
	return data.year+"-"+data.month;
}

function searchData(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('dValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	$list_dataParam['orgId']=$("#orgId").val();
	$list_dataParam['month']=$('#month').val();
	$list_dataParam['year']=$('#year').val();
	resetList();
}

function checkPhone(phoneNo){
	if (phoneNo){
		phoneNo = phoneNo.replace('\\s','');
	}
	var var1 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/ ;
	var var2 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{3}$/ ;
	return var1.test(phoneNo) || var2.test(phoneNo);
}









