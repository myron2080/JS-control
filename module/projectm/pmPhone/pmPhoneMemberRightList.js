$list_editUrl = getPath()+"/projectm/pmPhonemember/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/pmPhonemember/add";//新增url
$list_deleteUrl = getPath()+"/projectm/pmPhonemember/delete";//删除url
$tree_async_url = getPath()+"/projectm/customer/simpleTreeData";
$list_editWidth = 1000;
$list_editHeight = 600;
$list_dataType = "电话" ;
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "250px";//界面高度
$tree_dataType = "客户类型";//数据名称
$tree_container = "leftTree";
$tree_addUrl = getPath()+"/projectm/customer/add";//新增
$tree_editUrl = getPath()+"/projectm/customer/edit";//编辑及查看url
$tree_deleteUrl = getPath()+"/projectm/customer/delete";//删除url
var curbindId = '';
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	
	/*$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addNode,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
	});*/
	
	initSimpleDataTree();
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'center', width: 70,render:editMethod, isSort:false},
                    {display: '核算渠道', name: 'config.configName', align: 'center', width: 150, isSort:false},
                    /*{display: '使用组织', name: 'org.name', align: 'center', width: 100, isSort:false},*/
	                {display: '分配固定号码', name: 'showNumber', align: 'center', width: 100, isSort:false}, 
		            {display: '权限模版', name: 'range.name', align: 'left',width:180,render:operateIsDefaultPrivilege},
		            {display: '允许呼叫本地手机', name: 'range.localMob', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许呼叫本地固话', name: 'range.localFixed', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许呼叫国内长途', name: 'range.domestic', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许呼叫国际长途', name: 'range.interTempletID', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许隐藏呼出', name: 'range.hide', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '黑名单', name: 'range.black', align: 'center', width: 150, isSort:false}
	                  ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        enabledSort:true,
        delayLoad:true,
        parms:{orgId:$("#orgId").val()},
        url:getPath() + '/projectm/pmPhonemember/listRightData'
    }));
	
});

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
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

function editMethod(data){
	var str='';
	
	if(data.range&&data.range.callRightId&&data.isDefaultPrivilege!='YES'){
		str += '<a class="delete_font" href="javascript:unbindRight({id:\''+data.id+'\'});">解绑权限</a>';
	}else{
		str += '<a class="delete_font" href="javascript:bindRight({id:\''+data.id+'\',orgId:\''+data.config.orgId+'\'});">绑定权限</a>';
	}
	
	return str;
}


function searchData(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['showNumber'];
	}else{
		$list_dataParam['showNumber'] = kw;
	}
	
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(node[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){//全部客户
			delete $list_dataParam['customerId'];
		}else{
			$list_dataParam['customerId'] = node[0].id;
		}
	}
	
	resetList();
}


function bindRight(obj){
	var orgId = obj.orgId;
	curbindId = obj.id;
	art.dialog.open(getPath()+"/framework/dataPicker/list?query=pmPhoneRightQuery&isMultiple=false&orgId="+orgId,{
		id : "getPhoneRight",
		title : '绑定权限',
		background : '#333',
		width : 450,
		height : 450,
		lock : true	 
		});
	art.dialog.data("returnFunName","updateRight");
}

function updateRight(obj,type){
	var param = {};
	param['rightid'] = obj[0].id;
	param['memberid'] = curbindId;
	param['callRightId'] = obj[0].callRightId;
	param['type'] = 'bind';
	$.post(getPath()+"/projectm/pmPhonemember/bindRight",param,function(res){
		
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function unbindRight(obj){
	var param = {};
	param['memberid'] = obj.id;
	param['type'] = 'unbind';
	$.post(getPath()+"/projectm/pmPhonemember/bindRight",param,function(res){
		
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function staterender(d,filterData,a,b){
	if(b.name == 'range.localMob'){
		if(a=='1') return "是";
		else return "";
	}else if(b.name == 'range.localFixed'){
		if(a=='1') return "是";
		else return "";
	}else if(b.name == 'range.domestic'){
		if(a=='1') return "是";
		else return "";
	}else if(b.name == 'range.interTempletID'){
		if(a=='99') return "是";
		else return "";
	}else if(b.name == 'range.hide'){
		if(a=='1') return "是";
		else return "";
	}
	return "";
}

function operateIsDefaultPrivilege(data){
	if(data.range!=null){
		if(data.isDefaultPrivilege=="YES"){
			return data.range.name+ "<img src='"+imgPrePath+"/default.png'/>";
		}
		return data.range.name;
	}

}
function rightmanage(){
	 art.dialog.open(getPath()+'/projectm/pmPhoneright/list',
				{title:'权限管理',
				 lock:true,
				 width:"1100px",
				 height:"500px",
				 id:$list_dataType+"-ADD",
				 button:[{name:'取消',callback:function(){					
						return true;
					}}],
				 close:function(){
					 searchData();
				 }
				});
}