$list_editWidth = "580px";
$list_editHeight = "320px";
$list_dataType = "项目";//数据名称
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
            {display: '项目登记名', name: 'registerName', align: 'left', width: 120},
            {display: '项目推广名', name: 'spreadName', align: 'left', width: 120},
            {display: '项目专员', name: 'projectManstr', align: 'left', width: 120}
        ],
        url:getPath()+'/interflow/bill/getProjectData',
        onDblClickRow:function(data){
	    	 //$(parent.document.getElementById("projectName")).val(data.registerName);
	    	 //$(parent.document.getElementById("projectId")).val(data.id);
	    	/// 
	    	 art.dialog.data("projectName",data.registerName);
	 		art.dialog.data("projectId",data.id);
	 		art.dialog.close();
	      }
    }));
});

