$list_deleteUrl = getPath()+"/cmct/phoneCostPay/delete";
$list_dataType = "话费充值";//数据名称
$list_editWidth = "480px";
$list_editHeight = "180px";
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '充值日期', name: 'paytime', align: 'center', width: 120},
            {display: '充值金额', name: 'paycost', align: 'center', width: 80,render:function(data,filterData){
            	return comdify(data.paycost);
            }},
            {display: '充值后余额', name: 'paySurplusCost', align: 'center', width: 80,render:function(data,filterData){
            	return comdify(data.paySurplusCost,data.flag.value);
            }},
            {display: '备注', name: 'remark', align: 'center', width: 100},
            {display: '状态', name: 'flag.name', align: 'center', width: 120},
            {display: '操作', name: '', align: 'center', width: 200,render:operateRender}
        ],
        height: "98%",
        width:"98%",
        url:getPath()+'/cmct/phoneCostPay/listData',
        usePager:true,
        pageSize:100,
        enabledSort:false,
        delayLoad:true,
        onDblClickRow:function(data){
        	viewDetail(data.id);
        }
    }));
	searchData();
});

function operateRender(data,filterData){
	var str="";
	if(data.flag.value=="APPLY"){
		if(perType=='T01'){
			str+= '<a href="javascript:confirmPay({id:\''+data.id+'\',paycost:\''+data.paycost+'\'});">确定充值</a>|&nbsp;';
		}
		str+= '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
		
	}
	return str;
}

function confirmPay(data){
	var queryAccount=$("#SurplusMoney").text().replace(" 元","");
	art.dialog.confirm('确定充值吗?',function(){
		$.post(getPath()+"/cmct/phoneCostPay/confirmPay",{id:data.id,queryAccount:queryAccount,payAccount:data.paycost},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips(res.MSG,null,"succeed");
				refresh();
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json');return true;},
		function(){
				return true;
		});
}
//金额千分位自动分位
function comdify(num,flag){ 
	if(flag=='APPLY'){
		return '申请中';
	}
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

/**
 *统计余额 
 */
function queryAccount(){
	var partners=$("#orgId :selected").attr('partners');
	var orgId=$("#orgId :selected").val();
	var orgKey=$("#orgId :selected").attr('orgKey');
	var accountUrl=$("#orgId :selected").attr('accountUrl');

	$.post(getPath()+"/cmct/phonemember/queryAccountByOrgId",{orgInterfaceId:orgId,orgKey:orgKey,accountUrl:accountUrl,partners:partners},function(data){
		if(data.STATE == 'SUCCESS'){
			var config= data.config ;
			var text = "" ;
			if(config!=null){
				text = config.balance;
			}
			$("#SurplusMoney").text(text + " 元");
			$('#nowPay').show();
		}else{
			$('#nowPay').show();
		}
	},'json');
}

//查看
function viewDetail(rowData){
		var	url="viewDetail?id="+rowData;
		art.dialog.open(getPath()+"/cmct/phoneCostPay/"+url,
				{title:"充值-查看",
				lock:true,
				width:"580px",
				height:"150px",
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
}


function searchData(){
	var orgId=$("#orgId :selected").val();
	if(orgId==null || orgId==''){
		return false;
	}
	$list_dataParam['orgId']=orgId;
	queryAccount();
	resetList();
}

function addCost(){
	var orgId=$("#orgId :selected").val();
	if(orgId==null || orgId==''){
		art.dialog.tips('请先选择核算渠道');
		return false;
	}
	
	$list_addUrl = getPath()+"/cmct/phoneCostPay/add?orgId="+orgId;
	addRow();
}







