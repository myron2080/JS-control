$list_editUrl = getPath()+"/cmct/ucsPhoneShowTel/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/ucsPhoneShowTel/add";//新增url
$list_editWidth = 520;
$list_editHeight = 220;
$(document).ready(function(){
	$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'增加',click:addRow,icon:'add'}]
	});
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '显示号码', name: 'showTelNo', align: 'left', width: 120,height:40},
		            {display: '状态', name: '', align: 'left', width: 80,height:40,render:getState},
		            {display: '审核', name: '', align: 'left', width: 80,height:40,render:getAudit},
		            {display: '创建时间', name: 'createTime', align: 'left', width: 80,height:40},
		            {display: '创建人', name: 'creator.name', align: 'left', width: 120,height:40},
		            {display: '所属企业', name: 'agent.agentName', align: 'left', width: 100,height:40}
		        ],
        delayLoad:false,
        url:getPath()+'/cmct/ucsPhoneShowTel/listData'
    }));
});

function getState(data){
	if(data.state){
		if(data.state.value=='NO'){
			return "未显示";
		}else{
			return "已显示";
		}
	}
}

function getAudit(data){
	if(data.state){
		if(data.state.value=='NO'){
			return "未审核";
		}else{
			return "已审核";
		}
	}
}