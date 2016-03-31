$list_editUrl = getPath()+"/exporttools/exportScheme/edit";//编辑及查看url
$list_addUrl = getPath()+"/exporttools/exportScheme/add";//新增url
$list_deleteUrl = getPath()+"/exporttools/exportScheme/delete";//删除url
$list_editWidth = "600px";
$list_editHeight = "520px";
$list_dataType = "数据导出方案";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	/*$("#toolBar").ligerToolBar({
		items:[
		      {id:'add',text:'新增',click:addRow,icon:'add'},
		       {id:'execute',text:'执行方案',click:function(){
		    	   var row = $list_dataGrid.getSelectedRow();
		    	   if(row){
		    		   var dlg = art.dialog.open(getPath()+"/exporttools/exportScheme/export?id="+row.id,{
		    			  title:'数据导出',
		    			  lock:true,
		    			  width:'auto',
		    			  height:'auto',
		    			  button:[
		    			      {name:'导出Excel',callback:function(){
		    			    	  if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.executeExport){
										dlg.iframe.contentWindow.executeExport(this,"excel");
									}
									return false;
		    			      	}
		    			      },
		    			      {name:'导出Csv',callback:function(){
		    			    	  if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.executeExport){
										dlg.iframe.contentWindow.executeExport(this,"csv");
									}
									return false;
		    			      	}
		    			      },
		    			      {name:'导出Txt',callback:function(){
								if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.executeExport){
									dlg.iframe.contentWindow.executeExport(this,"txt");
								}
									return false;
		    			      	}
		    			      },
		    			      {name:'取消'}
						  ]
		    		   });
		    	   }else{
		    		   art.dialog.tips("请先选择方案");
		    	   }
		       },icon:'back'}
			]
		});*/
	//$("#toolBar").append($('#filter').html());
	//$('#filter').html('');
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '编码', name: 'number', align: 'left', width: 80},
            {display: '名称', name: 'name', align: 'left', width: 80},
            {display: '创建人', name: 'creator.name', align: 'left', width: 100},
            {display: 'SQL', name: 'sql', align: 'left', width: 250},
            {display: '操作', name: 'operate', align: 'center', width: 140,render:function(data){
            	var p = '';
            	p += '<a href="javascript:void(0)" onclick="editRow({id:\''+data.id+'\'})">编辑</a>|';
            	p += '<a href="javascript:void(0)" onclick="deleteRow({id:\''+data.id+'\'})">删除</a>';
            	return p;
            }}
        ],
        url:getPath()+'/exporttools/exportScheme/listData'
    }));
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});
function run(){
	   var row = $list_dataGrid.getSelectedRow();
	   if(row){
		   var dlg = art.dialog.open(getPath()+"/exporttools/exportScheme/export?id="+row.id,{
			  title:'数据导出',
			  lock:true,
			  width:'auto',
			  height:'auto',
			  button:[
			      {name:'导出Excel',callback:function(){
			    	  if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.executeExport){
								dlg.iframe.contentWindow.executeExport(this,"excel");
							}
							return false;
			      	}
			      },
			      {name:'导出Csv',callback:function(){
			    	  if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.executeExport){
								dlg.iframe.contentWindow.executeExport(this,"csv");
							}
							return false;
			      	}
			      },
			      {name:'导出Txt',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.executeExport){
							dlg.iframe.contentWindow.executeExport(this,"txt");
						}
							return false;
			      	}
			      },
			      {name:'取消'}
				  ]
		   });
	   }else{
		   art.dialog.tips("请先选择方案");
	   }
 }

//增加行
function addNewRow(){
	if($list_addUrl && $list_addUrl!=''){
		var paramStr = '';
		if($list_addUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		var flag = true;
		var dlg = art.dialog.open($list_addUrl+paramStr,
				{title:getTitle('ADD'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'预览',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.previewtable){
							dlg.iframe.contentWindow.previewtable(dlg);
						}
						return false;
					}},{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 if(flag){
						 resetList();
					 }
				 }
				});
	}
}

//编辑行
function editRow(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[{name:'预览',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.previewtable){
							dlg.iframe.contentWindow.previewtable(dlg);
						}
						return false;
					}},{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){				
					 if(flag){
						 refresh();
					 }
				 }
				});
	}
}