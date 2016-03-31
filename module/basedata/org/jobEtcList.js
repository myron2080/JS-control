$list_editUrl = getPath()+"/basedata/jobEtc/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/jobEtc/add";//新增url
$list_deleteUrl = getPath()+"/basedata/jobEtc/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "200px";
$list_dataType = "职等";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                {display: '职等编码', name: 'number', align: 'left', width:100 },
      			{display: '职等名称', name: 'name', align: 'left', width:130},
      			{display: '备注', name: 'description', align: 'left', width:250 },
      			{display: '状态', name: 'status.name', align: 'left', width:100 },
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/basedata/jobEtc/listData',
        delayLoad:false
    }));
	$("#selectData").click(function(){
		selectList();
	});
	eventFun($("#keyConditions"));
});

function operateRender(data,filterData){
	return '<a href="javascript:enable({id:\''+data.id+'\',enable:\''+(data.status.value=='ENABLE'?'DISABLED':'ENABLE')+'\'});">'+(data.status.value=='ENABLE'?'禁用':'启用')+'</a>|'
	+'<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function enable(data){
	$.post(getPath()+"/basedata/jobEtc/enable",data,function(res){
		if(res.STATE=="SUCCESS"){
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}


function beforeAddRow(){
	addRow({});
}
function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}
//清除
$("#clearData").click(function(){	
	$("#keyConditions").val($('#keyConditions').attr("defaultValue"));
});
//新增
$("#addNoteApply").click(function(){
	beforeAddRow();
});

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	var keyWord = $("#keyConditions").val();
	if(keyWord== '' || keyWord ==$('#keyConditions').attr("defaultValue")){
		delete $list_dataParam['key'];
	} else{
		$list_dataParam['key'] = keyWord;
	}
	
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
