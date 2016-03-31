$list_dataType = "电话" ;
var map={RADIO:'无线电话',PHONE:'手机',TEL:'固定电话',SHAR:'共享',PERSONAL:'专用',BUSY:'忙碌',FREE:'空闲'};
var manager;
$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "开通日期";
	MenuManager.common.create("DateRangeMenu","openDate",params);
	
	$("#key").focus(function(){
		if($(this).val()=="号码/分配号码/mac地址"){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val("号码/分配号码/mac地址");
		}
	});
	
	//清空
	$("#resetBtn").click(function(){
		$("#key").val($("#key").attr("defaultValue"));
		$("#state").val("");
		MenuManager.menus["createTime"].resetAll();
	});
	
	
	
	//注册控件key的回车查询事件
	inputEnterSearch('key',searchData);
	
	/**
	 * 设置默认值
	 */
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	var columnsParam=[ 
                    {display: '使用组织', name: 'org.name', align: 'center', width: 100, isSort:false},
	                {display: '固定号码', name: 'showPhone', align: 'center', width: 120, isSort:false},
	                {display: '状态', name: 'state', align: 'center', width: 120, render:getName,isSort:false},
	                {display: '使用模式', name: 'useType', align: 'center', width: 120,render:getName, isSort:false},
	                {display: '当前使用', name: 'currentUser.name', align: 'right', width: 100,render:currentOprate,isSort:false},
		            {display: '上线时间', name: '', align: 'center', width: 150,render:onLineDate,isSort:false}
	                  ];
	manager =$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        enabledSort:true,
        checkbox:true,
        parms:{orgId:$("#orgId").val()},
        url:getPath() + '/cmct/phoneUseCase/listData'
    }));
});

function getName(record, rowindex, value, column){
	return map[value];
}

function onLineDate(data){
	if(data.currentUser!=null){
		return data.onlineTime;
	}
}
function searchData(){
	//上线时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	var key=$("#key").val();
	if(key == '号码/分配号码/mac地址'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	resetList();
}
/**
 * 当前使用情况
 * @param data
 */
function currentOprate(record, rowindex, value, column){
	var str='';
	if(record.state == 'BUSY'){//线路被使用状态
		str = (value == null || value == 'null' ? '' : value );
		str += '&nbsp;<a href="javascript:dropOne(\''+record.id+'\');">下线</a>';
	}
	return str;
}
function dropOne(id){
	art.dialog.confirm("确定下线么?",function(){
		$.post(getPath()+'/cmct/phonemember/dropOne',{id:id},function(data){
			if(data.STATE=='SUCCESS'){
				searchData();
			}
			art.dialog.tips(data.MSG);
		},'json');
	});
}
function toDropBatch(){
	var recordes = manager.getSelectedRows();	
	var recordesIds = "";
	for(var i in recordes){
		if(recordes[i].state == 'BUSY'){
			if(!recordesIds){
				recordesIds = recordes[i].id;
			}else{
				recordesIds += (","+ recordes[i].id);
			}
		}
	};
	
	if(!recordesIds){
		art.dialog.tips("未勾选或未查找到满足条件的数据！！",2);
		return ;
	}
   art.dialog.confirm("确定批量下线么?",function(){
		$.post(getPath()+'/cmct/phonemember/dropBatch',{ids:recordesIds},function(data){
			if(data.STATE=='SUCCESS'){
				resetList();
			}
			art.dialog.tips(data.MSG);
		},'json');
	});
}
