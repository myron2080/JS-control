$list_editUrl = getPath()+"/projectm/pmPhoneDevice/edit";//编辑及查看url
$list_addUrl = "";//新增url
$list_deleteUrl = getPath()+"/projectm/pmPhoneDevice/delete";//删除url
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/customer/simpleTreeData";
$tree_addUrl = getPath()+"/projectm/customer/add";//新增
$tree_editUrl = getPath()+"/projectm/customer/edit";//编辑及查看url
$tree_deleteUrl = getPath()+"/projectm/customer/delete";//删除url
$list_editWidth = 570;
$list_editHeight = 260;
$list_dataType = "设备" ;
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "250px";//界面高度
$tree_dataType = "客户类型";//数据名称

$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
//	$("#toolBar").append(
//			'<div style="float:left;display:inline;margin-left:5px;">'
//	    	+'	<form onsubmit="searchData();return false;">'	
//		    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="Mac/TT号/对应号码" defaultValue="Mac/TT号/对应号码" value="Mac/TT号/对应号码" id="searchKeyWord" class="input"/>'
//		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
//	    	+'	</form>'
//	    	+'</div>'
//	);
	
	
	/*$("#toolBar").ligerToolBar({
		items:[{id:'clearSearch',text:'<a href="javascript:void(0)">清除</a>',click:clearSearch}]
	});*/
	
//	$("#toolBar").ligerToolBar({
//		items:[{id:'add',text:'<a href="javascript:void(0);" >新增</a>',click:addPhoneDevice}]
//	});
//	
//	$("div[toolbarid='add'] span","#toolBar").addClass("orangebtn btn");
//	$("div[toolbarid='add']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
//	
//	$("div[toolbarid='clearSearch'] span","#toolBar").addClass("graybtn btn");
//	$("div[toolbarid='clearSearch']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
//	$("div[toolbarid='state']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
//	$("div[toolbarid='partners']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
 
	initSimpleDataTree();
	 
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'center', width: 150,render:editMethod, isSort:false},
                    {display: '客户', name: 'customer.name', align: 'center', width: 120, isSort:false},
                    {display: '出货日期', name: 'dispatchDate', align: 'center', width: 100, isSort:false},
	                {display: '设备标识', name: 'deviceMac', align: 'center',  width: 160, isSort:false},
	                {display: '端口数量', name: 'portNum', align: 'center',  width: 90, isSort:false},
	                {display: '开通数量', name: 'portOpenNum', align: 'center',  width: 90, isSort:false},
	                {display: '备注', name: 'remark', align: 'center',  width: 180 }	               		            		       
	                  ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        enabledSort:true,
        delayLoad:true,
        parms:{orgId:$("#orgId").val(),state:$('#state').val()},
        url:getPath() + '/projectm/pmPhoneDevice/listData' 
    }));
});
 

//增加行
function addPhoneDevice(){
	$list_addUrl=getPath()+"/projectm/pmPhoneDevice/add";
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node==null || node.length==0 || node[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){
		art.dialog.tips('请先在左边选择客户类型');
		return false;
	}
	$list_addUrl += "?customerId="+node[0].id+"&customerName="+node[0].name;
	addRow();
}

function refreshTree(){
	initSimpleDataTree();
}
function afterAddNode(){
	$('#'+$tree_container).empty();
	refreshTree();
}

function afterUpdateNode(){
	$('#'+$tree_container).empty();
	refreshTree();
}

function afterDeleteNode(){
	$('#'+$tree_container).empty();
	refreshTree();
}


function editMethod(data){
	var str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
	 
	if(data.portOpenNum == 0){
		
		str += ' ||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	} 
	 
	return str;
}


/**
 * 删除行
 * @param rowData
 */
function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		var cfDlg = art.dialog.confirm('是否确认删除？',function(){
			$.post($list_deleteUrl,{id:rowData.id},function(res){
				if(res.STATE=='SUCCESS'){
					art.dialog.tips(res.MSG);
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
					}
					refresh();
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
		});
	}
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	$('#state').val('');
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(treeNode.id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){//全部客户
			delete $list_dataParam['customerId'];
		}else{
			$list_dataParam['customerId'] = treeNode.id; 
		}
	}
	searchData();
}


function searchData(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['keyWord'];
	}else{
		$list_dataParam['keyWord'] = kw;
	}
	
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(node[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){//全部客户
			delete $list_dataParam['customerId'];
		}else{
			$list_dataParam['customerId'] = node[0].id;
		}
	}
	$list_dataParam['orderByClause'] = " D.FDISPATCHDATE DESC ";
	resetList();
//	queryAccount();
}

function queryAccount(){
	$.post(getPath()+"/projectm/pmPhoneDevice/queryAccount",$list_dataParam,function(data){
		
		if(data.STATE == 'SUCCESS'){
			var configList = data.configList ;
			var text = "" ;
			if(configList!=null && configList.length == 1){
				text = configList[0].balance +" 元";
			}else{
				for(var i = 0 ; i < configList.length ;i ++){
					text += configList[i].configName + "：" +  configList[i].balance + " 元；" ; 
				}
			}
			 
		}
	},'json');
}

function clearSearch(){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	$('#state').val('');
	$('#parten').val('');
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
     }
}); 

 