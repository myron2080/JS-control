$(document).ready(function(){

});

function reLoadData(){
	location.reload(); 
}

function toEditDB(id){
	art.dialog.data("reLoadData","reLoadData");
	var dlg =art.dialog.open(base +"/basedata/dbeSql/toEditDB?id="+id,
		{
			id : "editDB",
			title : "添加数据库连接",
			background : '#333',
			width : 300,
			height : 200,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(dlg);
					}
					return false;
				}
			},
			{
				className : 'aui_state_highlight',
				name : '测试',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.test){
						dlg.iframe.contentWindow.test();
					}
					return false;
				}
			}
			, {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){					
			 }
		});			
}

function deleteDB(id){
	art.dialog({
	    content: '确认删除该数据库信息吗？',
	    ok: function () {
	    	var _this=this;
	    	_this.title('正在删除...');
	    	$.post(base+'/basedata/dbeSql/deleteDB',{id:id},function(data){
	    		 var state=data.STATE;
	    		 var tipStr='';
	    		 if(state=='SUCCESS'){
	    			 tipStr='删除成功';
	    			 reLoadData();
	    		 }else{
	    			 tipStr='删除失败';
	    		 }
	    		 _this.title(tipStr).time(1);
	    	},'json');
	    },
	    cancelVal: '关闭',
	    cancel: true
	});
}


function runSQL(){
	var sql = $("#sql").val();
	if(isNotNull($.trim(sql))){
		var ids = "";
		$("input[type='checkbox']").each(function(i, ele){
			if(ele.checked){
				ids +="'" + ele.value + "',";
			}
		});
		if (ids.indexOf(",") != -1) {
			ids = ids.substring(0, ids.length - 1);
		}
		$.post(base+'/basedata/dbeSql/excuteSqlNew',{sql:sql},function(data){
			if(data.items){
				var columnsParam=[];
				var row=data.items[0];
				var idx=0;
				for(var key in row){
					columnsParam[idx]={display: key, name: key, align: 'center', width: 80, isSort:false};
					idx++;
				}
				$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
			        columns: columnsParam,
			        width:"99%",
			        usePager:true,
			        enabledSort:true 
			    }));
			$list_dataGrid.loadData(data);
			}
		},'json');
		
	}else{
		art.dialog.tips("SQL语句不能为空！");
	}
}

function sqlmanager(){
	art.dialog.open(getPath()+"/basedata/sqlupgrade/list",{
		id : "sqlmanager",
		title : '脚本管理',
		background : '#333',
		width : 1000,
		height : 550,
		lock : true	 
		});
}