var $list_dataGrid;//表格引用
var $list_dataParam = {};//主要用于搜索
var $list_currentPageData;//当前页原始数据
var $list_editUrl;//编辑及查看url
var $list_addUrl;//新增url
var $list_editWidth;
var $list_editHeight;
var $list_deleteUrl;//删除url
var $list_dataType;//数据名称
var $list_defaultGridParam = {//默认表格设置
	allowUnSelectRow:true,
	width: '100%', 
    height: '100%', 
    checkbox: false,
    rownumbers:true,
    enabledSort:false,
    pageSize:20,
    //以下用于兼容后台的pagination
    pageParmName:'currentPage',
    pagesizeParmName:'pageSize',
    root:'items',
    record:'recordCount',
    pageSize:30,
    pageSizeOptions:[20,30,40,60,100],
    showtime:true,
    onSuccess:function(data,grid){
    	$list_currentPageData = data;
    	if(this.options.showtime){
    		//isAppendTime(data);
    	}
    	
    },
    onBeforeShowData:function(data){
    	//用于支持多级取值方式绑定如name:'data.aa.dd.bcc'的方式
    	function updateColumnData(column,grid){
    		var name = column.columnname;
    		if(name && name.indexOf('.')>0){
    			if(data.items){
	       			 for(var i = 0; i < data.items.length; i++){
	       				updateColumnValueByName(data.items[i],column,grid.options.tree);
	       			 }
    			}
    		}
    		if(column.columns && column.columns.length > 0){
    			for(var i = 0; i < column.columns.length;i++){
    				updateColumnData(column.columns[i],grid);
    			}
    		}
    	}
    	if(this.columns){
    		for(var i = 0; i < this.columns.length;i++){
    			updateColumnData(this.columns[i],this);
    		}
    	}
    	return true;
    },
    onDblClickRow:function(rowData,rowIndex,rowDomElement){
    	viewRow(rowData);
    }
};

function updateColumnValueByName(rowdata,column,tree){
	var name = column.columnname;
	if(name && name.indexOf('.')>0){
		var names = name.split('.');
		var tmp = rowdata;
		for(var i = 0;i < names.length; i++){
			if(tmp[names[i]]!=null){
				tmp = tmp[names[i]];
			}else{
				tmp = null;
				break;
			}
		}
		rowdata[name] = tmp;
		if(tree){
			var children = rowdata[tree.childrenName];
			if(children && children.length > 0){
				for(var j = 0; j < children.length; j++){
					updateColumnValueByName(children[j],column,tree);
				}
			}else{
				if(tree.childrenName in rowdata){
					delete rowdata[tree.childrenName];
				}
			}
		}
	}
}

function mergeGrid(data){
	var g = this;
	var columns = g.getColumns();
	function mergeColumn(columnIndex,startIndex,endIndex){
		var c = columns[columnIndex];
		var columnName = c.display; 
		if(c.columnname){
			var v;
			var count = 1;
			var cell;
			var start = startIndex;
			var end = endIndex;
			if((end - start) < 1){
				return;
			}
			var filter = ".l-grid-body-table td[id$='|"+c['__id']+"']";
			$(filter,'#'+g.id).each(function(s,d,f,g,h){
				if(s >=startIndex && s <= endIndex){
    				var tx = $("div",this).text();
    				if(v==tx){
						count++;
						$(this).addClass("l-remove");
						cell.attr('rowspan',count.toString());
						if(s===endIndex){
							if((columnIndex+1)<columns.length){
    							end = start + count - 1;
    							mergeColumn(columnIndex+1,start,end);
    						}
						}
					}else{
						if(count > 1){
							if((columnIndex+1)<columns.length){
    							end = start + count - 1;
    							mergeColumn(columnIndex+1,start,end);
    							start = start + count;
    						}
						}else{
							if(s!=0 && s!=startIndex){
								start ++;
							}
						}
						count = 1;
						cell = $(this);
						v = tx;
					}
				}
			});
		}
	}
	for(var i = 0; i < columns.length ;i++){
		var c = columns[i];
		if(c.columnname){
			mergeColumn(i,0,g.getData().length-1);
			break;
		}
	}
	$(".l-remove").remove();      
}

//增加行
function addRow(source){
	if($list_addUrl && $list_addUrl!=''){
		var paramStr = '';
		if($list_addUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		if(typeof(getAddRowParam) == "function"){
			var param = getAddRowParam();
			//临时增加不满足则不打开窗口
			if(param=='notValidate') return;
			if(param){
				for(var p in param){
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_addUrl+paramStr,
				{title:getTitle('ADD'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'确定',callback:function(){
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
						 if(typeof(afterAddRow)=='function'){
							 afterAddRow();
						 }
						 resetList();
					 }
				 }
				});
	}
}



//查看行
function viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.id;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
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
				 button:[{name:'确定',callback:function(){
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
						 if(typeof(afterEditRow)=='function'){
							 afterEditRow();
						 }
						 refresh();
					 }
				 }
				});
	}
}

//删除行
function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		art.dialog.confirm('确定删除该行数据?',function(){
			$.post($list_deleteUrl,{id:rowData.id},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
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

function resizeDialog(id){
	if(art.dialog.list[id]){
		var dlg = art.dialog.list[id];
		var _isIE6 = window.VBArray && !window.XMLHttpRequest;
		var aConfig = dlg.config;
		var iwin = dlg.iframe.contentWindow;
		var $idoc = $(iwin.document);
		ibody = iwin.document.body;
		// 获取iframe内部尺寸
		var iWidth = aConfig.width === 'auto'
		? $idoc.width() + (_isIE6 ? 0 : parseInt($(ibody).css('marginLeft')))
		: aConfig.width;
		
		var iHeight = aConfig.height === 'auto'
		? $idoc.height()
		: aConfig.height;
		
		dlg.size(iWidth, iHeight);
		
		// 调整对话框位置
		aConfig.follow
		? dlg.follow(aConfig.follow)
		: dlg.position(aConfig.left, aConfig.top);
	}
}

//获取弹出窗口的标题
function getTitle(viewstate){
	if(!$list_dataType){
		$list_dataType = "数据";
	}
	switch(viewstate){
		case 'ADD':return $list_dataType+'-新增';
		case 'VIEW':return $list_dataType+'-查看';
		case 'EDIT':return $list_dataType+'-编辑';
		default:return $list_dataType;
	}
}

/**
 * 表格重置查询
 */
function resetList(){
	if($list_dataGrid){
		$list_dataGrid.setOptions({
			parms:$list_dataParam
		});
		$list_dataGrid.loadData();
		$list_dataGrid.changePage('first');
	}
}

function refresh(){
	if($list_dataGrid){
		$list_dataGrid.loadData();
	}
}

function searchData(){
	var kw = $('#searchKeyWord').val();
	if(kw){
		kw = kw.replace(/^\s+|\s+$/g,'');
		$('#searchKeyWord').val(kw);
		if(kw==$('#searchKeyWord').attr('defaultValue')){
			kw='';
		}
		if(kw==null || kw == ''){
			delete $list_dataParam['key'];
		}else{
			$list_dataParam['key'] = kw;
		}
	}
	resetList();
}

/**yyyy-mm-dd**/
function format2date(str){
	if(str==null || str.length == 0){
		return null;
	}
	var year = parseInt(str.substring(0,str.indexOf('-')),10);
	var month = parseInt(str.substring(str.indexOf('-')+1,str.lastIndexOf('-')),10);
	var date = parseInt(str.substring(str.lastIndexOf('-')+1));
	return new Date(year,month-1,date);
}


/**
 * 点击查看执行的脚本语句
 * @param data
 */
function showExceSql(data){
	var content = '密码:<input type="password" id="mangerPass" />';
	function showSQLMsg(){
		if($("#mangerPass").val() !="manager"){
			$("#mangerPass").val("");
			$("#mangerPass").focus();
			art.dialog.tips("密码错误");
			return false;
		}
		closeSQLDialog();
		var sqlDialog = art.dialog({
			title:"数据库脚本",
			icon:"",
		    content:'<div><textarea  cols="75" rows="30">'+$("#exceSql").html()+'</textarea></div>',
		    id: "ajaxExceSql",
		    lock:true,
		    width:500,
		    height:300,
		    button:[{name:"关闭",callback:closeSQLDialog}]
		});
		return false;
	}
	var dialog = art.dialog({
		title:"后台管理",
		icon:"manager",
	    content: content,
	    id: "ajaxManager",
	    lock:true,
	    button:[{name:"确定",callback:showSQLMsg},{name:"取消",callback:closeSQLDialog}]
	});
	function closeSQLDialog(){
		dialog.close();
	}
	
	dialog.show();
}

/**
 * 点击查看执行的脚本语句  ,用于测试库用
 * @param data
 */
function showTestExceSql(data){
	
	//by lxl 15.2.4 根据系统参数查看是否可以显示sql
	$.post(getPath()+"/basedata/showSql/showSql",{},function(res){
		if(res.value=='YES'){
			var content = '密码:<input type="password" id="mangerPass" />';
			var sqlDialog = art.dialog({
					title:"数据库脚本",
					icon:"",
				    content:'<div><textarea  cols="75" rows="30">'+$("#exceSql").html()+'</textarea></div>',
				    id: "ajaxExceSql",
				    lock:true,
				    width:500,
				    height:300,
				    button:[{name:"关闭",callback:function(){
				    	sqlDialog.close();
				    }}]
				});
				return false;
//			});
			
			function closeSQLDialog(){
				sqlDialog.close();
			}
			sqlDialog.show();
		}
	},'json');
}

/**
 * 追加数据加载时间
 * @param data
 */
function isAppendTime(data){
	if(data.exceSql !=undefined && data.exceSql!="" && data.exceSql!=null){
    	$(".l-panel-bbar-inner").append("<b id=\"reponseTime\" style=\"color:#74c0f9;position:absolute; left:50%;top:5px; \"></b><b id=\"exceSql\" style=\"display:none;\"></b>");
    	$("#reponseTime").html("<a style=\"color:#74c0f9;\" href=\"#\" onclick=\"showTestExceSql();\">"+$list_currentPageData.exceTime+"</a>");
    	$("#exceSql").html($list_currentPageData.exceSql);
	}
}
