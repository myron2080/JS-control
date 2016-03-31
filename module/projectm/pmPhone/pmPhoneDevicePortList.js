$list_editUrl = getPath()+"/projectm/pmPhoneDevicePort/edit";//编辑及查看url
$list_addUrl = "";//新增url
$list_deleteUrl = getPath()+"/projectm/pmPhoneDevicePort/delete";//删除url
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/customer/simpleTreeData";
$tree_addUrl = getPath()+"/projectm/customer/add";//新增
$tree_editUrl = getPath()+"/projectm/customer/edit";//编辑及查看url
$tree_deleteUrl = getPath()+"/projectm/customer/delete";//删除url
$list_editWidth = 370;
$list_editHeight = 140;
$list_dataType = "设备端口" ;
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "250px";//界面高度
$tree_dataType = "客户类型";//数据名称

$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
//	$("#toolBar").ligerToolBar({
//		items:[{id:'status',text:'<select id="status" style="width: 60px;height:22px;">'
//								+'<option value="" selected=selected>状态</option>'
//								+'<option value="NOTDISTRIBUTED" >空闲</option>'
//								+'<option value="DAMAGED">损坏</option>'
//								+'<option value="DISTRIBUTED">已配号</option>'
//								+'</select>'}]
//	});
	 
//	$("#toolBar").append(
//			'<div style="float:left;display:inline;">'
//	    	+'	<form onsubmit="searchData();return false;">'	
//	    	+'	<li class="k01" id ="operatedate" style="width:200px;text-align:left;margin-right:10px;">配号日期<div class="k01_right"></div></li>'	
//		    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="Mac/TT号/对应号码" defaultValue="Mac/TT号/对应号码" value="Mac/TT号/对应号码" id="searchKeyWord" class="input"/>'
//		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
//	    	+'	</form>'
//	    	+'</div>'
//	);
	
	params ={};
	params.inputTitle = "日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	
//	$("#toolBar").ligerToolBar({
//		items:[{id:'clearSearch',text:'<a href="javascript:void(0)">清除</a>',click:clearSearch}]
//	});
	
//	$("#toolBar").ligerToolBar({
//		items:[{id:'batchDistribute',text:'<a href="javascript:void(0)">批量配号</a>',click:openBatch}]
//	});
	
//	
//	$("div[toolbarid='clearSearch'] span","#toolBar").addClass("graybtn btn");
//	$("div[toolbarid='clearSearch']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
//	$("div[toolbarid='status']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
//	$("div[toolbarid='batchDistribute'] span","#toolBar").addClass("orangebtn btn");
//	$("div[toolbarid='batchDistribute']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
 
	initSimpleDataTree();
	 
	var columnsParam=[ 
	                {display: '设备标识', name: 'deviceMac', align: 'center',  width: 160, isSort:false},
	                {display: '端口序号', name: 'portSortNum', align: 'center',  width: 80, isSort:false},
	                {display: '端口TT号', name: 'portNum', align: 'center',  width: 120, isSort:false},
                    {display: '操作', name: '', align: 'center', width: 150,render:editMethod, isSort:false},
                    {display: '端口状态', name: 'status.name', align: 'center',  width: 100 },
                    {display: '配号日期', name: 'distributeDate', align: 'center', width: 100, isSort:false},
                    {display: '对应号码', name: 'phoneNum', align: 'center', width: 100, isSort:false,render:phoneRender},
                    {display: '号码状态', name: 'phoneStatus.name', align: 'center',  width: 100 },	               		            		       
                    {display: '客户', name: 'customer.name', align: 'center',  width: 120, isSort:false}
	                  ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        enabledSort:true,
        delayLoad:true,
        parms:{orgId:$("#orgId").val(),status:$('#status').val()},
        url:getPath() + '/projectm/pmPhoneDevicePort/listData' 
    }));
});
 

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

function phoneRender(data){
	var phoneStr = data.phoneNum;
	
	if(data.phoneMemberId && data.phoneStatus && (data.phoneStatus.value=='USE' || data.phoneStatus.value=='UNUSE')){
		phoneStr = '<a href="javascript:void(0)" onclick="viewPhone(\''+data.phoneMemberId+'\')">'+data.phoneNum+'</a>';
	}else{
		phoneStr = '<font color="red">'+data.phoneNum+"</font>";
	}
	return phoneStr;
}


//查看电话号码
function viewPhone(phoneMemberId){
	var url = getPath()+"/projectm/pmPhonemember/edit";
	var paramStr;
	if(url.indexOf('?')>0){
		paramStr = '&VIEWSTATE=VIEW&id='+phoneMemberId;
	}else{
		paramStr = '?VIEWSTATE=VIEW&id='+phoneMemberId;
	}
	art.dialog.open(url+paramStr,
			{title:'电话查看',
			lock:true,
			width:570||'auto',
			height:230||'auto',
			id:'viewPhone-VIEW',
			button:[{name:'关闭'}]}
	);
	 
}

function editMethod(data){
	var str='';
	if(data.status.value == 'DISTRIBUTED'){
		str = '<a href="javascript:cancelDistribute({id:\''+data.id+'\'});">取消配号</a>';
	}else{
		str = '<a href="javascript:editRow({id:\''+data.id+'\'});">配号</a>';
	} 
	 
	return str;
}

 

/**
 * 删除行
 * @param rowData
 */
function cancelDistribute(rowData){
	var url = getPath()+"/projectm/pmPhoneDevicePort/cancelDistribute?id="+rowData.id ;
	var cfDlg = art.dialog.confirm('是否确定取消配号？',function(){
		$.post(url,{},function(res){
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

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	$('#status').val('');
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
	
	var status=$('#status').val();
	if(status==null || status == ''){
		delete $list_dataParam['status'];
	}else{
		$list_dataParam['status'] = status;
	}
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["operatedate"]){
		queryStartDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
	}
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['startTimeStr'] = queryStartDate;
	} else {
		delete $list_dataParam['startTimeStr'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['endTimeStr'] = queryEndDate;
	} else {
		delete $list_dataParam['endTimeStr'];
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
	$list_dataParam['orderByClause'] = " D.FDISTRIBUTEDATE DESC";
	resetList();
 
}

 
function clearSearch(){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	$('#status').val('');
	MenuManager.menus["operatedate"].resetAll();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
     }
}); 


//增加行
function openBatch(source){
	var url = getPath()+"/projectm/pmPhoneDevicePort/toBatch";
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	var customerId = "";
	if(node==null || node.length==0 || node[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){
		 
	}else{
		url += "?customerId="+node[0].id+"&customerName="+node[0].name;
	}
	
	var flag = true;
	var dlg = art.dialog.open(url,
		{title:'批量配号',
		 lock:true,
		 width:650||'auto',
		 height:560||'auto',
		 id:"openBatch-ADD",
		 button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
					dlg.iframe.contentWindow.saveAdd(this);
				}
				return false; 
			}},{name:'关闭',callback:function(){
				flag = false;
				resetList();
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
 