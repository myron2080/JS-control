//$list_editUrl = getPath()+"/cmct/phoneCostReport/edit";//编辑及查看url
$list_editWidth = 550;
$list_editHeight = 140;
$list_dataType = "话费统计查看";//数据名称
var sumMoney=0;
$(document).ready(function(){
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '月份', name: 'period', align: 'center', width: 80},
            {display: '月末余额', name: 'monthSurplusCost', align: 'center', width: 120,render:function(data,filterData){
            	return comdify(data.monthSurplusCost);
            }},
            {display: '消费总额', name: 'callCost', align: 'center', width: 120,render:function(data,filterData){
            	return "-"+comdify(data.callCost);
            }},
            {display: '充值总额', name: 'totalPayCost', align: 'center', width: 100,render:function(data,filterData){
            	return comdify(data.totalPayCost);
            }},
            {display: '操作', name: '', align: 'center', width: 200,render:detailCall}
        ],
        height: "98%",
        width:"98%",
        url:getPath()+'/projectm/pmPhoneDialDetailReport/query',
        usePager:true,
        pageSize:100,
        enabledSort:false
    }));
});

function detailCall(data,filterData){
	return '<a href="javascript:viewDeail({period:\''+data.period+'\'});">查询月报</a>';
}

function viewDeail(data){
	window.parent.location.href=getPath()+'/projectm/pmPhoneMonthReport/manager?per='+data.period;
	//$(window.parent.document).find("#two1").click();
	/*if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem( 'detailCall',getPath()+'/cmct/phoneMonthReport/list?per='+data.period,'查询月报');
	}*/
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
  return  num+"元";    
} 