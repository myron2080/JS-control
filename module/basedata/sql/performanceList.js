$(document).ready(function(){
	params ={};
	params.inputTitle = "统计周期";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: 'sql_id', name: 'SQL_ID', align: 'left', width: 100,height:40},
		            {display: 'sql_text', name: 'SQL_TEXT', align: 'left', width: 250,height:40,render:sqlRender},
		            {display: 'child_number', name: 'CHILD_NUMBER', align: 'left', width: 100,height:40},
		            {display: '总耗时(秒)', name: 'ELAPSED_TIME', align: 'left', width: 100,height:40,render:getSeconds},
		            {display: 'cpu耗时(秒)', name: 'CPU_TIME', align: 'left', width: 100,height:40,render:getCpuSeconds},
		            {display: '消耗资源', name: 'DISK_READS', align: 'left', width: 100,height:40}
		        ],
	    root:'Rows',
	    record:'Total',
        delayLoad:true,
        url:getPath()+'/basedata/dbeSql/performanceData',
        onAfterShowData:function(gridData,rowIndex,rowDomElement){
        	$('.l-panel-bar').hide();
        	getDbCount();
	    },
	    onDblClickRow:function(data){
	    	var sql=data.SQL_FULLTEXT;
	    	$('#exceSql').html(sql);
	    	viewSqlTemp();
	    }
    }));
	searchData();
});

function sqlRender(data){
	var operateStr ="";
	operateStr +='<span title="'+data.SQL_TEXT+'">'+data.SQL_TEXT+'</span>';
	return operateStr;
}

function resetBtn(){
	MenuManager.menus["createTime"].resetAll();
}

function getSeconds(data){
	if(data.ELAPSED_TIME){
		return (data.ELAPSED_TIME/1000000).toFixed(2);
	}
}

function getCpuSeconds(data){
	if(data.CPU_TIME){
		return (data.CPU_TIME/1000000).toFixed(2);
	}
}

var sqlDialog;
function viewSqlTemp(){
	sqlDialog= art.dialog({
		title:"数据库脚本",
		icon:"",
	    content:'<div><textarea  cols="75" rows="30">'+$('#exceSql').html()+'</textarea></div>',
	    id: "ajaxExceSql",
	    lock:true,
	    width:500,
	    height:300,
	    button:[{name:"关闭",callback:function(){
	    	sqlDialog.close();
	    }}]
	});
}

function getDbCount(){
	$.post(getPath()+'/basedata/dbeSql/getDbCount',{},function(res){
		$('#currJoin').text(res.currJoin);
		$('#maxJoin').text(res.maxJoin);
		$('#currSessioin').text(res.currSessioin);
	},'json');
}

function searchData(){
	if(!dataBaseType=='ORACLE'){
		art.dialog.tips('该功能目前只支持oracle数据库');
		return false;
	}
	var sD = "";
	var eD = "";
	if(MenuManager.menus["createTime"]){//天
		sD = MenuManager.menus["createTime"].getValue().timeStartValue;
		eD = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	$list_dataParam['startDate']=sD;
	$list_dataParam['endDate']=eD;
	$list_dataParam['accessNumber']=$('#accessNumber').val();
	$list_dataParam['performanceType']=$('#performanceType').val();
	resetList();
}