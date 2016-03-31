$list_editUrl = getPath()+"/basedata/job/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/job/add";//新增url
$list_deleteUrl = getPath()+"/basedata/job/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "320px";
$list_dataType = "岗位";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").append(
		'<div style="padding-right:50px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '编码', name: 'number', align: 'left', width: 120},
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '简拼', name: 'simplePinyin', align: 'left', width: 120},
            {display: '描述', name: 'description', align: 'left', width: 180}
        ],
        url:getPath()+'/basedata/online/jobListData',
        onDblClickRow:function(data){
	    	 $(parent.document.getElementById("jobName")).val(data.name);
	    	 parent.toCloseJobWin();
	      }
    }));
});

