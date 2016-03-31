$list_editUrl = getPath()+"/basedata/org/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/org/add";//新增url
$list_deleteUrl = getPath()+"/basedata/org/delete";//删除url
$list_editWidth = "900px";
$list_editHeight = "340px";
$list_dataType = "组织";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/org/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	
/*	$("#toolBar").append(
		' <div style="float:left;display:inline;padding:0 0 0 3px;"><label id="includeContainer"><input type="checkbox" name="includeChild" id="includeChild" checked="checked" />包含下级</label></div>'
		+'<div style="float:left;padding:0 0 0 10px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
	    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
    	+'	</form>'
    	+'</div>'
	);
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRow,icon:'add'},
		       {id:'businessType',text:'业务类型',click:businessType,icon:'config'},
		       {id:'orgleveldesc',text:'组织级别',click:orgleveldialog,icon:'config'}
			]
		});*/
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
	        {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
            {display: '编码', name: 'number', align: 'left', width: 70},
            {display: '名称', name: 'name', align: 'left', width: 80},
            {display: '成立日期', name: 'effectiveDate', align: 'left', width: 80},
            {display: '业务类型', name: 'businessTypesName', align: 'left', width: 180},
//            {display: '描述', name: 'description', align: 'left', width: 180},
            //{display: '包含岗位', name: 'jobs', align: 'left', width: 150},
            {display: '状态', name: 'status', align: 'left', width: 60,render:function(data){
            	var e = (data.status=='ENABLE'?'DISABLED':'ENABLE');
            	var t = (data.status=='ENABLE'?'禁用':'启用');
            	var desc;
            	if(data.status=='ENABLE'){
            		desc = '启用';
            	}else{
            	  desc = '禁用';}
            	return desc; //+'&nbsp;<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>';
            }},
            {display: '包含岗位', name: 'jobs', align: 'left', width: 150,render:function(data){
            	return data.jobs+'&nbsp;<a href="javascript:postionSetting({id:\''+data.id+'\'});">设置</a>';
            }}
        ],
        height:'95%',
        fixedCellHeight:false,
        url:getPath()+'/basedata/org/listData',
        delayLoad:true
    }));
	$('#includeContainer').bind('change',searchData);
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	
	if(!isBusinessType){
		$("div[toolbarid='businessType']").hide();
	}
	if(!isOrglevel){
		$("div[toolbarid='orgleveldesc']").hide();
	}
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});
function operateRender(data,filterData){
	var e = (data.status=='ENABLE'?'DISABLED':'ENABLE');
	var t = (data.status=='ENABLE'?'禁用':'启用');
	var str = '<a href="javascript:editRowData({id:\''+data.id+'\'});">编辑</a> | ';
	//str += +'<a href="javascript:postionSetting({id:\''+data.id+'\'});">岗位设置|</a>'
	if(deleteOrg){
		str += '<a href="javascript:deleteRow({id:\''+data.id+'\'});" >删除</a> | ';
	}
//	str += '<a href="javascript:moveRow({id:\''+data.id+'\'},true);">组织迁移|</a>'
//	str += '<a href="javascript:copyRowAdd({id:\''+data.id+'\'} );">复制新增</a>'*/
//	str += '|<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>'
	str += '<div class="smore">';
	str += '<div class="menu2" onmouseover="this.className=\'menu1\'" onmouseout="this.className=\'menu2\'">';
	str += '<a href="#">更多</a>';
	str += '<div class="smore-box" style="z-index:9999">';
	str += '<b id="searchBtn"><a href="javascript:moveRow({id:\''+data.id+'\'},true);">组织迁移</a></b>';
	str += '<b><a href="javascript:copyRowAdd({id:\''+data.id+'\'});">复制新增</a></b>';
	str += '<b><a href="javascript:gardenMapMark(\''+data.id+'\');">地图设置</a></b>';
	str += '<b><a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a></b>';
	str == ' </div>  </div> </div>';
	return str;		
}
/**
 * *************************************
 * 地图标点
 * *************************************
 * */
function gardenMapMark(id){
	art.dialog.data("flag",false);
	art.dialog.open(getPath()+'/basedata/org/toMapMark?fid=' + id,
	{
		lock : true,
		id : "toMapMark",
		title : "楼盘地图标点",
		width:1082,
		height:590,
		close:function(){
			if(art.dialog.data("flag")){
				art.dialog.tips("保存成功",null,"succeed");
			}
		}
	});
}
function editRowData(data){
	$list_editUrl = getPath()+"/basedata/org/edit";
	editRow(data);
}

function copyRowAdd(data){
	$list_editUrl = getPath()+"/basedata/org/edit?dataType=copyAdd";
	editRow(data);
}

function afterAddRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterEditRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterDeleteRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}else{
			artDialog.alert("请先选择树节点",function(){})
			return 'notValidate';
		}
		
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function postionSetting(org){
	if(org){
		var dlg = art.dialog.open(getPath()+'/basedata/org/positionSetting?VIEWSTATE=ADD&org='+org.id,{
			 title:'岗位设置',
			 lock:true,
			 width:'830px',
			 height:'320px',
			 id:"positionSetting",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd();
					}
					return false;
				}},{name:'取消'}],
			close:function(){
				refresh();
			}
			});
	}
}

function businessType(){
	var dlg = art.dialog.open(getPath()+'/basedata/businessType/list',{
		 title:'业务类型',
		 lock:true,
		 width:'750px',
		 height:'480px',
		 id:"businessType",
		 button:[{name:'关闭'}]
		});
}

function orgleveldialog(){
	var dlg = art.dialog.open(getPath()+'/basedata/orgleveldesc/list',{
		 title:'业务类型',
		 lock:true,
		 width:'500px',
		 height:'350px',
		 id:"orgleveldialog",
		 button:[{name:'关闭'}]
		});
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
			delete $list_dataParam['id'];
			$list_dataParam['longNumber'] = selectNodes[0].longNumber;
		}else{
			$list_dataParam['id'] = selectNodes[0].id;
			delete $list_dataParam['longNumber'];
		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['longNumber'];
	}
	var kw = $('#searchKeyWord').val();
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
	resetList();
}

/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRow(config){
	var t = (config.status=='ENABLE'?'启用':'禁用');
	art.dialog.confirm('确定'+t+'数据吗?',function(){
	$.post(getPath() + '/basedata/org/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}

function moveRow(rowData,flag){
	editRow(rowData,flag);
}



//编辑行
function editRow(rowData,editState){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
				paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
				paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		if(editState){
			art.dialog.data("EDITSTATE",'MOVE');
			paramStr +='&move=1';
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle(editState?'MOVE':'EDIT'),
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
					 art.dialog.data("EDITSTATE",null);
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

//获取弹出窗口的标题
function getTitle(viewstate){
	if(!$list_dataType){
		$list_dataType = "数据";
	}
	switch(viewstate){
		case 'ADD':return $list_dataType+'-新增';
		case 'VIEW':return $list_dataType+'-查看';
		case 'EDIT':return $list_dataType+'-编辑';
		case 'MOVE':return $list_dataType+'-迁移';
		default:return $list_dataType;
	}
}
