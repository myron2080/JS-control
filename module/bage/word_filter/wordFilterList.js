$list_addUrl = getPath()+'/bage/wordFilter/add';
$list_editUrl = getPath()+'/bage/wordFilter/edit';
$list_deleteUrl = getPath()+'/bage/wordFilter/delete';
$list_batchDeleteUrl = getPath()+'/bage/wordFilter/batchDelete';
$list_editWidth = "500px";
$list_editHeight = "150px";
$(function(){
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
            {display: '词语', name: 'word', align: 'left', width:'200'},
			{display: '过滤动作', name: 'filterAction.name', align: 'center', width:80},
			{display: '替换词语', name: 'replaceWord', align: 'center', width:130},
			{display: '词语分类', name: 'wordCategory.name', align: 'center', width:150},
			{display: '创建时间', name: 'createTime', align: 'center', width:150},
			{display: '创建人', name: 'creator.name', align: 'center', width:150}
        ],
        checkbox: true,
        url: getPath()+"/bage/wordFilter/listData"
    }));
	
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	searchData();
        }
    });
});

//操作
function operateRender(data){
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

//查询
function searchData(){
	var filterAction =   $("#filterAction").val();
	if(filterAction){
		$list_dataParam['filterAction'] = filterAction;
	} else{
		delete $list_dataParam['filterAction'];
	}
	var wordCategory =   $("#wordCategory").val();
	if(wordCategory){
		$list_dataParam['wordCategory'] = wordCategory;
	} else{
		delete $list_dataParam['wordCategory'];
	}
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}
//清空
function onEmpty(){
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['filterAction'];
	delete $list_dataParam['wordCategory'];
	$("#filterAction").val('');
	$("#wordCategory").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
}
//批量删除
function batchDelete(){
	//1、判断是否至少选择一行
	var rows=$list_dataGrid.getSelectedRows();
	if(rows && rows.length<=0){
		art.dialog.tips("请至少选择一行！");
		return ;
	}
	var rowIds=[];
	for(var i=0;i<rows.length;i++){
		rowIds.push(rows[i].id);
	}
	if($list_batchDeleteUrl && $list_batchDeleteUrl!=''){
		art.dialog.confirm('确定删除选中的数据?',function(){
			$.post($list_batchDeleteUrl,{ids:rowIds.join(',')},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(afterBatchDeleteRow)=='function'){
						afterBatchDeleteRow();
					}
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
	}
}

//备份词库
/**
 * 导出Excel
 */ 
function backupWord(){
	var filterAction =   $("#filterAction").val();
	var wordCategory =   $("#wordCategory").val();
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		
	} else{
		keyWord='';
	}
	var url = getPath()+"/bage/wordFilter/backupWord?keyWord="+keyWord+"&filterAction="+filterAction+"&wordCategory"+wordCategory;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}

//导入数据
function importData(){
	art.dialog.data("searchData",searchData);
	art.dialog.data("loadClose",Loading.close);
	var flag = true;
	var dlg = art.dialog.open(getPath()+'/bage/wordFilter/importData',{
		 title:"导入数据",
		 lock:true,
		 width:'400px',
		 height:'300px',
		 id:"importDataDialog",
		 ok:function(){
			 Loading.init();
			 if(dlg.iframe.contentWindow){
				 art.dialog.data("saveImportData")();
			 }
			 return false ;
		 },
		 okVal:'确定'
		 /*button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
					dlg.iframe.contentWindow.saveImportData(this);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 if(typeof(afterAddRow)=='function'){
					 afterAddRow();
				 }
				 resetList();
			 }
		 }*/
	});
}