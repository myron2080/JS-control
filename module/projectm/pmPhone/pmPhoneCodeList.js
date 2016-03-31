$list_editUrl = getPath()+"/projectm/pmPhoneCode/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/pmPhoneCode/add";//新增url
$list_deleteUrl = getPath()+"/projectm/pmPhoneCode/delete";//删除url
$list_editWidth = "251px";
$list_editHeight = "105px";
$list_dataType = "归属地";//数据名称
$(document).ready(function(){
	 $list_defaultGridParam.pageSize=100;
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '排序号', name: 'number', align: 'center', width: 100,height:40},
		            {display: 'H码', name: 'hCode', align: 'center', width: 100,height:40},
		            {display: '归属省份', name: 'province', align: 'center', width: 100,height:40},
		            {display: '归属城市', name: 'city', align: 'center', width: 150,height:40},
		            {display: '归属运营商', name: 'corp', align: 'center', width: 100,height:40}
		        ],
        delayLoad:false,
        url:getPath()+'/projectm/pmPhoneCode/listData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){}
    }));
	 
	 //清除
	$("#clearBtn").click(function(){	
		clearAll();
	});
	$("#searchBtn").click(function(){
		searchData();
	});
});

/**
 * 清空
 */
function clearAll(){
	$("#key").val($("#key").attr("dValue"));
}

function sync(){
	$list_dataParam['syncFlag'] = "SYNC";
	addRow();
}

function syncUpdate(){
	$list_dataParam['syncFlag'] = "SYNCUPDATE";
	addRow();
}

function searchData(){	
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	resetList();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 