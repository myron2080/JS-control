$(document).ready(function(){
	
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '客户名称', name: 'customer.name', align: 'center', width: 120,height:40},
		            {display: '核算渠道', name: 'orgName', align: 'center', width: 150,height:40},
		            {display: '剩余余额', name: '', align: 'center', width: 120,height:40,render:comboNameRender},
		            {display: '总线路', name: '', align: 'center', width: 100,height:40,render:comboNameRender},
		            {display: '渠道备注', name: 'remark', align: 'center', width: 250,height:40}
		        ],
        delayLoad:false,
        url:getPath()+'/projectm/pmBalanceAccount/listData',
        onAfterShowData:function(gridData){
	    	loadCostAndMember(gridData);
	    }
    }));
});

function loadCostAndMember(gridData){
	var configArr = [];
	var orgIds = "(";
	if(gridData){
		for(var i=0;i<gridData.items.length;i++){
			var rowObj = gridData.items[i];	
			configArr.push(rowObj.orgId);
		}
		
		var configArrOrgId=jsArrayRepeat(configArr);
		for(var i=0;i<configArrOrgId.length;i++){
			orgIds += "'"+ configArrOrgId[i] +"',";
		}
		
		if(orgIds.indexOf(",")>=0){
			orgIds = orgIds.substring(0, orgIds.length- 1) + ")";
		}else{
			orgIds = "('')";
		}
	}
	$.post(getPath()+'/projectm/pmBalanceAccount/queryAccount',{orgIds:orgIds},function(data){
		if(!data || data.configList.length<1){
			$("td[id^='tableContainer|2|r10'][id$='|c104'] div").html("<font color='red'>无此信息</font>");
			$("td[id^='tableContainer|2|r10'][id$='|c105'] div").html("<font color='red'>无此信息</font>");
			return ;
		}
		for(var i = 0 ; i < gridData.items.length ; i ++){
			var rowObj = gridData.items[i];
			var existsFlag = false;
			var tdId = "";
			var tdId2 = "";
			if((i+1)>=10 && (i+1)<=100){
				tdId = "tableContainer|2|r10"+(i+1)+"|c104"
				tdId2 = "tableContainer|2|r10"+(i+1)+"|c105"
			}else{
				tdId = "tableContainer|2|r100"+(i+1)+"|c104"
				tdId2 = "tableContainer|2|r100"+(i+1)+"|c105"
			}
			if((i+1)>=100){
				tdId = "tableContainer|2|r1"+(i+1)+"|c104"
				tdId2 = "tableContainer|2|r1"+(i+1)+"|c105"
			}
			
			for(var k = 0 ; k < data.configList.length ; k ++){
				var numPkg = data.configList[k];
				 
				if($.trim(rowObj.orgId) == $.trim(numPkg.orgId)){
					if(numPkg.balance<=10){
						$("td[id='"+tdId+"'] div").html("<font color='red'>"+numPkg.balance+"元</font>");
					}else{
						$("td[id='"+tdId+"'] div").text(numPkg.balance+"元");
					}
					$("td[id='"+tdId2+"'] div").text(numPkg.memberCount);
					existsFlag = true;
					break;
				}
			}
			if(!existsFlag){
				$("td[id='"+tdId+"'] div").html("<font color='red'>无此信息</font>");
				$("td[id='"+tdId2+"'] div").html("<font color='red'>无此信息</font>");
			}
		}
	},'json')
}

function comboNameRender(rowData){
	return "正在读取..."
}

function jsArrayRepeat(array){
	var map={};
	var re=[];
	for(var i=0,l=array.length;i<l;i++) {
		if(typeof map[array[i]] == "undefined"){
			map[array[i]]=1;
			re.push(array[i]);
		}
	}
	return re;
}