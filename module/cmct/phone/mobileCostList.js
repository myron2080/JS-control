$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/org/simpleTreeData";
var parentWechatId="";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:215,allowLeftCollapse:true,allowLeftResize:true});
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '部门', name: 'org.name', align: 'center', width: 120},
            {display: '工号', name: 'person.number', align: 'left', width: 80},
            {display: '姓名', name: 'person.name', align: 'center', width: 100},
            {display: '手机号', name: 'phoneNum', align: 'center', width:100},
            {display: '呼出通数', name: 'countPhone', align: 'center',width:80,render:getcountPhone},
            {display: '统计时长(秒)', name: 'phoneDuration', align: 'center', width: 100}
        ],
        delayLoad:true,
        url:getPath()+'/cmct/mobileMember/listCostData',
    }));
	searchData();
});

$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function getcountPhone(data){
	if(data.countPhone){
		return data.countPhone;
	}
	return "0";
}

function searchData(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		$list_dataParam['longNumber'] = node[0].longNumber;
	}else{
		delete $list_dataParam['longNumber'];
	}
	var showMonth=$("#showMonth").val();
	if(null == showMonth || showMonth == ''){
		art.dialog.tips("请选择日期!");
		return false;
	}
	var yearMonthArr = showMonth.split("-");
	$list_dataParam['year']=yearMonthArr[0];
	$list_dataParam['month']=yearMonthArr[1];
	$list_dataParam['yearMonth']=showMonth;
	
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	resetList();
}

function onTreeNodeClick(event, treeId, treeNode){
	searchData();
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