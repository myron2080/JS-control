$list_editUrl = getPath()+"/interflow/wxQuestion/edit";//编辑及查看url
$list_addUrl = getPath()+"/interflow/wxQuestion/add";//新增url
$list_deleteUrl = getPath()+"/interflow/wxQuestion/delete";//删除url
$list_editWidth = "570px";
$list_editHeight = "400px";
$list_dataType = "问题反馈";//数据名称
$(document).ready(function(){
	
	/*$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
	});*/
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '公司名称', name: 'companyName', align: 'center', width: 120,height:40},
		            {display: '联系方式', name: 'telNumber', align: 'center', width: 100,height:40},
		            {display: '内容', name: 'content', align: 'center', width: 150,height:40},
		            {display: '反馈日期', name: 'createTime', align: 'center', width: 120,height:40},
		            {display: '状态', name: 'status.label', align: 'center', width: 80,height:40},
		            {display: '处理人', name: 'updator.name', align: 'center', width: 80,height:40},
		            {display: '处理日期', name: 'lastUpdateTime', align: 'center', width: 120,height:40},
		            {display: '操作', name: '', align: 'center', width: 160,render:operateRender}
		        ],
        delayLoad:false,
        url:getPath()+'/interflow/wxQuestion/listData'
    }));
});

function operateRender(data,filterData){
	var str="";
	var flag=data.status;
	if(flag && flag.value=='UNTREATED'){
		str+='<a href="javascript:editRow({id:\''+data.id+'\'});">操作</a>';
	}
	return str;
}

function editRow(data){
	$list_editUrl = getPath()+"/interflow/wxQuestion/edit?id="+data.id;//编辑及查看url
	var dlg=art.dialog.open($list_editUrl,
			{title:"问题处理",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:$list_editHeight||'auto',
			 id:'dealQuestion',
			 button:[{name:'处理',callback:function(){
				 	dealQuestion(data);
				 	setTimeout(function(){
				 		dlg.close();
					},1000);
					return false;
				}},{name:'取消',callback:function(){
					return true;
				}}],
			 close:function(){
				 if(typeof(afterEditRow)=='function'){
					 afterEditRow();
				 }
				 refresh();
			 }
			});
}

function dealQuestion(data){
	$list_dealQuestionUrl = getPath()+"/interflow/wxQuestion/dealQuestion";
	$.post($list_dealQuestionUrl,{id:data.id},function(res){
		art.dialog.tips(res.MSG);
		refresh();
	},'json');
}

