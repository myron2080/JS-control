$list_editUrl = getPath()+"/cmct/phoneDialLog/edit";// 编辑及查看URL
$list_deleteUrl = getPath()+"/cmct/phoneDialLog/delete";// 删除URL
$list_editWidth = 570;
$list_editHeight = 230;

$(document).ready(function(){
	params ={};
	params.dateFmt='yyyy-MM-dd';
	params.inputTitle = "日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(startDate!=''){
		MenuManager.menus["operatedate"].setValue(startDate,endDate);
		MenuManager.menus["operatedate"].confirm();
	}

	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
            {display: '操作人', name: 'person.name', align: 'center', width: 90},
            {display: '操作时间', name: 'callTime', align: 'center',width: 150},
            {display: '被叫名字', name: 'toName', align: 'left', width: 100},
            {display: '被叫手机号码', name: 'toPhone', align: 'center', width: 100},
            {display: '返回代号', name: 'code', align: 'center', width: 150},
            {display: '返回描述', name: 'rtnDesc', align: 'left', width: 400}
        ],
        width:"98%",
        height:"98%",
        url:getPath()+'/cmct/phoneDialLog/listData',
        delayLoad:true,
        usePager:true,
        enabledSort:false,
        onSelectRow:function(rowdata, rowid, rowobj){
        	
        }
    }));
	bindEvent(); 
	searchData();
});
function person(rowData){
	return "<a href=\"javascript:deleteRow({id:'"+rowData.id+"'})\">删除</a>";
}

function bindEvent(){
	// 查询
	$("#searchBtn").click(function(){
		searchData();
	});
	// 清空
	$("#clear").click(function(){
		MenuManager.menus["operatedate"].resetAll();
		$('#code').val('');
		$("#key").val($("#key").attr("dValue"));
	});
}


function searchData(){
	// 录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["operatedate"]){
		queryStartDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
	}
	// 查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	// 查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	var key = $('#key').val();
	if(key && ($('#key').attr("dValue") != key)){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	resetList();
}
/** 清除查询，日期框 */
function clearSearch(){
	MenuManager.menus["operatedate"].resetAll();
	$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
}
// 回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
});
