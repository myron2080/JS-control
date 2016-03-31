$list_editUrl = getPath()+"/projectm/phoneMobile/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/phoneMobile/add";//新增url
$list_deleteUrl = getPath()+"/projectm/phoneMobile/delete";//删除url
$list_takeCostUrl = getPath()+"/projectm/phoneMobile/takeCost";
$list_setShowUrl = getPath()+"/projectm/phoneMobile/setShow";
$list_toBindUrl = getPath()+"/projectm/phoneMobile/toBind";
$list_editWidth = "700px";
$list_editHeight = "420px";
$list_dataType = "线路";//数据名称
$(document).ready(function(){
	
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '操作', name: '', align: 'center', width: 100,render:operateRender},
		            {display: '核算渠道', name: 'config.configName', align: 'left', width: 100,height:40},
		            {display: '用户ID', name: 'userId', align: 'left', width: 100,height:40},
		            {display: '手机号码', name: 'showNumber', align: 'left', width: 100,height:40},
		            {display: '状态', name: 'state.name', align: 'left', width: 100,height:40},
		            {display: '剩余分钟数', name: '', align: 'center', width: 100,height:40},
		            {display: '剩余话费', name: '', align: 'center', width: 100,height:40}
		        ],
        delayLoad:true,
        url:getPath()+'/projectm/phoneMobile/listData',
        onAfterShowData:function(gridData){	
	    	loadCumulative(gridData);
	    }
    }));
	searchData();
	
	$('#searchBtn').bind('click',function(){
		searchData();
	});
	
	
});

function loadCumulative(gridData){	
	var userIds="";
	if(gridData && gridData.items){	
		var dataItems = gridData.items;
		for(var i = 0 ; i < dataItems.length ; i ++){
			userIds+=dataItems[i].id+",";
		}
		if(userIds){
			userIds=userIds.substring(0,userIds.length-1);
		}
		if(!userIds){
			return false;
		}
		$.post(getPath() + '/projectm/phoneMobile/getCumulative',{userIds:userIds},function(res){
			if(res.details){
				var details=res.details;
				for(var i = 0 ; i < dataItems.length ; i ++){
					var tdId1 = "";
					var tdId2 = "";
					if(i+1<10){
						tdId1 = "tableContainer|2|r100"+(i+1)+"|c107"
						tdId2 = "tableContainer|2|r100"+(i+1)+"|c108"
					}else if((i+1)<=100){
						tdId1 = "tableContainer|2|r10"+(i+1)+"|c107"
						tdId2 = "tableContainer|2|r10"+(i+1)+"|c108"
					}else{
						tdId1 = "tableContainer|2|r1"+(i+1)+"|c107"
						tdId2 = "tableContainer|2|r1"+(i+1)+"|c108"
					}
					var rowObj = dataItems[i];
					for(var k = 0 ; k < details.length ; k ++){
						if($.trim(rowObj.id) == $.trim(details[k].MEMBERID)){
							$("td[id='"+tdId1+"'] div").html(details[k].REMAIN_MIN?details[k].REMAIN_MIN.toFixed(2):"");
							$("td[id='"+tdId2+"'] div").html(details[k].REMAIN_AMOUNT?details[k].REMAIN_AMOUNT.toFixed(2):"");
							break;
						}
					}
				}
			}
		},'json');
	}
}

function operateRender(data){
	var str='';
	if(data.state && data.state.value!='DELETE'){		
		str+='<a href="javascript:enable({id:\''+data.id+'\'});">'+(data.state&&data.state.value=='USE'?'禁用':'启用')+'</a>';
		str+='<a href="javascript:waste({id:\''+data.id+'\'});">|作废</a>';
	}
	return str;
}

function waste(data){
	if(data.id){
		art.dialog.confirm('确定作废吗?',function(){			
			$.post(getPath()+'/projectm/phoneMobile/waste',{id:data.id},function(res){
				if(res.STATE=='SUCCESS'){
					art.dialog.tips('操作成功');
					resetList();
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
		});
	}
}

function enable(data){
	if(data.id){
		$.post(getPath()+'/projectm/phoneMobile/enable',{id:data.id},function(res){
			if(res.STATE=='SUCCESS'){
				art.dialog.tips('操作成功');
				resetList();
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json');
	}
}


function searchData(){
	var alias = $("#key").val();
	if(alias!="" && alias!=null && alias!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
	$list_dataParam['partners'] = 'GL';
	if($('#state').val()){		
		$list_dataParam['stateEq'] = $('#state').val();
	}else{
		delete $list_dataParam['stateEq'];
	}
	if($('#configId').val()){		
		$list_dataParam['configId'] = $('#configId').val();
	}else{
		delete $list_dataParam['configId'];
	}
	resetList();
}

function clearSearch(){
	$('#key').val($('#key').attr('defaultValue'));
	$('#state').val('');
	$('#configName').val('核算渠道');
}